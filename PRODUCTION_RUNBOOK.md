# 📚 Spotex Platform - Production Runbook

## 🚨 Emergency Contacts

### Technical Team
- **Technical Lead**: Alessio Spotex - +39 XXX XXX XXXX
- **DevOps Engineer**: [Name] - [Phone]
- **Database Administrator**: [Name] - [Phone]
- **Security Officer**: [Name] - [Phone]

### External Contacts
- **Hosting Provider (Kamatera)**: support@kamatera.com
- **DNS Provider**: [Provider Support]
- **SSL Certificate**: Let's Encrypt (automated)

## 🏥 Health Check URLs

- **API Health**: https://api.spotexsrl.com/health
- **Admin Dashboard**: https://admin.spotexsrl.com
- **Agency Dashboard**: https://agency.spotexsrl.com
- **Metrics Dashboard**: https://grafana.spotexsrl.com
- **Log Aggregation**: https://kibana.spotexsrl.com

## 🔧 Common Issues & Solutions

### 1. Database Performance Issues

**Symptoms**: Slow queries, high CPU usage, timeouts

**Diagnosis**:
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Find slow queries
SELECT query, calls, total_time, rows, 100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

-- Check table bloat
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Solutions**:
```bash
# Restart database (last resort)
docker-compose restart postgres

# Analyze and vacuum tables
docker-compose exec postgres psql -U spotex_prod -d spotex_platform_prod -c "VACUUM ANALYZE;"

# Kill long-running queries
docker-compose exec postgres psql -U spotex_prod -d spotex_platform_prod -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes';"
```

### 2. Service Downtime

**Symptoms**: 502/503 errors, services not responding

**Diagnosis**:
```bash
# Check service status
docker-compose ps

# Check service logs
docker-compose logs backend-api --tail=100
docker-compose logs frontend-admin --tail=100

# Check resource usage
docker stats

# Check health endpoint
curl -f https://api.spotexsrl.com/health || echo "API is down"
```

**Solutions**:
```bash
# Restart specific service
docker-compose restart backend-api

# Restart all services
docker-compose restart

# Full redeploy (zero downtime)
docker-compose pull
docker-compose up -d --no-deps --force-recreate

# Check for memory issues
docker system prune -af
```

### 3. SSL Certificate Issues

**Symptoms**: Certificate expired warnings, HTTPS not working

**Diagnosis**:
```bash
# Check certificate expiry
openssl s_client -connect admin.spotexsrl.com:443 -servername admin.spotexsrl.com </dev/null 2>/dev/null | openssl x509 -noout -dates

# Check all certificates
certbot certificates
```

**Solutions**:
```bash
# Manual renewal
certbot renew --force-renewal

# Restart nginx
docker-compose restart nginx

# Automatic renewal (should be in crontab)
0 0 * * * certbot renew --quiet && docker-compose exec nginx nginx -s reload
```

### 4. High CPU/Memory Usage

**Symptoms**: Slow responses, system sluggishness

**Diagnosis**:
```bash
# Check system resources
top
htop
free -h
df -h

# Check Docker resource usage
docker stats --no-stream

# Check process tree
ps auxf | grep node
```

**Solutions**:
```bash
# Restart resource-heavy services
docker-compose restart backend-api deployment-service

# Scale services (if using swarm/k8s)
docker-compose up -d --scale backend-api=3

# Clear caches
docker-compose exec redis redis-cli FLUSHALL

# Cleanup Docker
docker system prune -af --volumes
```

### 5. Database Connection Pool Exhausted

**Symptoms**: "too many clients already" errors

**Diagnosis**:
```sql
-- Check active connections
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

-- Check connection limits
SHOW max_connections;
```

**Solutions**:
```bash
# Increase pool size in .env
DB_POOL_SIZE=30

# Restart services to apply
docker-compose restart backend-api

# Emergency: kill idle connections
docker-compose exec postgres psql -U spotex_prod -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query_start < now() - interval '10 minutes';"
```

### 6. Deployment Failures

**Symptoms**: Failed deployments, pods not starting

**Diagnosis**:
```bash
# Check deployment logs
docker-compose logs --tail=100

# Check for failed containers
docker ps -a | grep Exit

# Check disk space
df -h
```

**Solutions**:
```bash
# Rollback to previous version
git checkout <previous-commit>
docker-compose up -d

# Check and fix migrations
docker-compose exec backend-api npx prisma migrate status
docker-compose exec backend-api npx prisma migrate resolve --rolled-back <migration>

# Clear failed deployments
docker-compose down
docker-compose up -d
```

## 🔄 Routine Maintenance

### Daily
- [ ] Check health endpoints (automated)
- [ ] Review error logs for critical issues
- [ ] Verify backup completion
- [ ] Monitor disk space (< 80%)

### Weekly
- [ ] Review performance metrics
- [ ] Check for security updates
- [ ] Analyze slow query logs
- [ ] Review SSL certificate expiry dates

### Monthly
- [ ] Database vacuum and analyze
- [ ] Review and optimize queries
- [ ] Update dependencies
- [ ] Security audit
- [ ] Disaster recovery drill

## 📊 Monitoring Thresholds

### Critical Alerts (Immediate Action)
- API response time > 5s
- Error rate > 5%
- Database connection failures
- Disk space > 90%
- Memory usage > 90%
- SSL certificate expires in < 7 days

### Warning Alerts (Investigate Soon)
- API response time > 2s
- Error rate > 1%
- Disk space > 80%
- Memory usage > 80%
- SSL certificate expires in < 30 days

## 🔐 Security Procedures

### Suspected Security Breach
1. **Isolate**: Block suspicious IPs immediately
   ```bash
   # Add to nginx config
   deny 123.456.789.0;
   docker-compose exec nginx nginx -s reload
   ```

2. **Investigate**: Check logs for unauthorized access
   ```bash
   grep "401\|403\|suspicious" /var/log/nginx/access.log
   docker-compose logs | grep -i "unauthorized\|failed\|attack"
   ```

3. **Notify**: Alert security team and stakeholders

4. **Rotate Credentials**: If breach confirmed
   ```bash
   # Rotate database password
   # Rotate JWT secrets
   # Rotate API keys
   docker-compose restart
   ```

### DDoS Attack
1. Enable rate limiting (if not already)
2. Use Cloudflare DDoS protection
3. Block attacking IP ranges
4. Scale up infrastructure temporarily

## 💾 Backup & Recovery

### Backup Verification
```bash
# Check latest backup
ls -lh /var/backups/spotex/

# Verify backup integrity
gunzip -t /var/backups/spotex/spotex_latest.sql.gz

# Check S3 backups
aws s3 ls s3://spotex-production-backups/ --recursive | tail -10
```

### Database Recovery
```bash
# Stop services
docker-compose stop

# Restore from backup
gunzip -c /var/backups/spotex/spotex_YYYYMMDD.sql.gz | \
  docker-compose exec -T postgres psql -U spotex_prod -d spotex_platform_prod

# Restart services
docker-compose up -d

# Verify data
docker-compose exec backend-api npx prisma db pull
```

## 📞 Escalation Procedures

### Level 1 (Developer)
- Application errors
- Minor performance issues
- Non-critical bugs

### Level 2 (DevOps)
- Infrastructure issues
- Deployment failures
- Resource constraints

### Level 3 (Senior Engineering)
- Database corruption
- Security breaches
- Major outages

### Level 4 (Management)
- Extended outages (> 4 hours)
- Data loss
- Legal/compliance issues

## 📝 Change Management

### Before Any Change
1. Create backup
2. Document change in changelog
3. Test in staging environment
4. Prepare rollback plan
5. Schedule during low-traffic period

### During Change
1. Monitor health endpoints
2. Watch error logs in real-time
3. Have rollback ready

### After Change
1. Verify all services healthy
2. Run smoke tests
3. Monitor for 30 minutes
4. Update documentation

## 🎯 Performance Benchmarks

### Acceptable Performance
- API response time: < 1s (95th percentile)
- Database query time: < 500ms
- Page load time: < 3s
- Uptime: > 99.9%

### Red Flags
- API response time: > 5s
- Database query time: > 2s
- Page load time: > 10s
- Uptime: < 99%

---

**Last Updated**: 2025-10-07  
**Document Owner**: Technical Team  
**Review Cycle**: Monthly  
**Version**: 1.0
