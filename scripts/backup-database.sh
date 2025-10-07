#!/bin/bash

# ====================
# Spotex Platform - Database Backup Script
# ====================

set -e

# Configuration
BACKUP_DIR="/var/backups/spotex"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="spotex_${TIMESTAMP}.sql"
RETENTION_DAYS=30
S3_BUCKET="${S3_BACKUP_BUCKET:-spotex-production-backups}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "🔄 Starting database backup..."

# Perform database backup
if pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"; then
    log "✅ Database backup created: $BACKUP_FILE"
    
    # Compress backup
    log "🗜️  Compressing backup..."
    if gzip "$BACKUP_DIR/$BACKUP_FILE"; then
        log "✅ Backup compressed successfully"
        BACKUP_FILE="${BACKUP_FILE}.gz"
    else
        warn "⚠️  Compression failed, continuing with uncompressed backup"
    fi
else
    error "❌ Database backup failed!"
    exit 1
fi

# Calculate backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
log "📦 Backup size: $BACKUP_SIZE"

# Upload to S3 if AWS CLI is available and configured
if command -v aws &> /dev/null && [ -n "$AWS_ACCESS_KEY_ID" ]; then
    log "☁️  Uploading backup to S3..."
    if aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$S3_BUCKET/$BACKUP_FILE"; then
        log "✅ Backup uploaded to S3: s3://$S3_BUCKET/$BACKUP_FILE"
    else
        error "❌ S3 upload failed, backup saved locally only"
    fi
else
    warn "⚠️  AWS CLI not configured, skipping S3 upload"
fi

# Clean up old local backups
log "🧹 Cleaning up old backups (keeping last $RETENTION_DAYS days)..."
DELETED_COUNT=$(find "$BACKUP_DIR" -name "spotex_*.sql.gz" -mtime +$RETENTION_DAYS -type f -delete -print | wc -l)
if [ "$DELETED_COUNT" -gt 0 ]; then
    log "✅ Deleted $DELETED_COUNT old backup(s)"
else
    log "ℹ️  No old backups to delete"
fi

# Clean up old S3 backups if AWS CLI is available
if command -v aws &> /dev/null && [ -n "$AWS_ACCESS_KEY_ID" ]; then
    log "🧹 Cleaning up old S3 backups..."
    CUTOFF_DATE=$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)
    aws s3 ls "s3://$S3_BUCKET/" | while read -r line; do
        createDate=$(echo "$line" | awk '{print $1" "$2}')
        createDate=$(date -d "$createDate" +%Y-%m-%d)
        if [[ "$createDate" < "$CUTOFF_DATE" ]]; then
            fileName=$(echo "$line" | awk '{print $4}')
            if [[ $fileName =~ ^spotex_.*\.sql\.gz$ ]]; then
                aws s3 rm "s3://$S3_BUCKET/$fileName"
                log "🗑️  Deleted old S3 backup: $fileName"
            fi
        fi
    done
fi

# Verify backup integrity
log "🔍 Verifying backup integrity..."
if gzip -t "$BACKUP_DIR/$BACKUP_FILE" 2>/dev/null; then
    log "✅ Backup integrity verified"
else
    error "❌ Backup integrity check failed!"
    exit 1
fi

# Summary
log "════════════════════════════════════"
log "✅ BACKUP COMPLETED SUCCESSFULLY"
log "════════════════════════════════════"
log "📁 Location: $BACKUP_DIR/$BACKUP_FILE"
log "📦 Size: $BACKUP_SIZE"
log "🕐 Timestamp: $TIMESTAMP"
log "☁️  S3 Bucket: s3://$S3_BUCKET/$BACKUP_FILE"
log "════════════════════════════════════"

# Send notification (optional)
if [ -n "$BACKUP_WEBHOOK_URL" ]; then
    curl -X POST "$BACKUP_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"✅ Database backup completed: $BACKUP_FILE ($BACKUP_SIZE)\"}" \
        2>/dev/null || true
fi

exit 0
