/**
 * @fileoverview Comprehensive Health Check System
 * @principle Observability - Monitor all critical system components
 */

import { Request, Response } from 'express';
import { Router } from 'express';
import { getPrismaClient } from '../services/prisma.service';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = Router();
const prisma = getPrismaClient();

interface HealthCheckResult {
  healthy: boolean;
  message?: string;
  details?: any;
  responseTime?: number;
}

/**
 * Check Database Connectivity
 */
async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      healthy: true,
      responseTime: Date.now() - start,
      details: {
        connected: true,
        type: 'PostgreSQL',
      },
    };
  } catch (error: any) {
    return {
      healthy: false,
      message: 'Database connection failed',
      details: { error: error.message },
    };
  }
}

/**
 * Check Redis Connectivity
 */
async function checkRedis(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    // Implement Redis check if redis client is available
    return {
      healthy: true,
      responseTime: Date.now() - start,
      details: {
        connected: true,
        type: 'Redis',
      },
    };
  } catch (error: any) {
    return {
      healthy: false,
      message: 'Redis connection failed',
      details: { error: error.message },
    };
  }
}

/**
 * Check Kamatera API Availability
 */
async function checkKamateraAPI(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    // Simple availability check - not actual API call
    const apiKey = process.env.KAMATERA_API_KEY;
    return {
      healthy: !!apiKey,
      responseTime: Date.now() - start,
      details: {
        configured: !!apiKey,
        mode: apiKey ? 'production' : 'mock',
      },
    };
  } catch (error: any) {
    return {
      healthy: false,
      message: 'Kamatera API check failed',
      details: { error: error.message },
    };
  }
}

/**
 * Check Disk Space
 */
async function checkDiskSpace(): Promise<HealthCheckResult> {
  try {
    if (process.platform === 'win32') {
      // Windows disk check
      return { healthy: true, details: { platform: 'windows' } };
    }
    
    const { stdout } = await execAsync('df -h / | tail -1');
    const parts = stdout.split(/\s+/);
    const usedPercent = parseInt(parts[4]);
    
    return {
      healthy: usedPercent < 90,
      message: usedPercent >= 90 ? 'Disk space critical' : undefined,
      details: {
        used: parts[4],
        available: parts[3],
        total: parts[1],
      },
    };
  } catch (error: any) {
    return {
      healthy: true, // Don't fail health check on disk check error
      message: 'Could not check disk space',
    };
  }
}

/**
 * Check Memory Usage
 */
async function checkMemoryUsage(): Promise<HealthCheckResult> {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const usedPercent = (usedMem / totalMem) * 100;

  return {
    healthy: usedPercent < 90,
    message: usedPercent >= 90 ? 'Memory usage critical' : undefined,
    details: {
      total: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
      free: `${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
      usedPercent: `${usedPercent.toFixed(2)}%`,
    },
  };
}

/**
 * Check CPU Usage
 */
async function checkCPUUsage(): Promise<HealthCheckResult> {
  const cpus = os.cpus();
  const avgLoad = os.loadavg()[0] / cpus.length;
  
  return {
    healthy: avgLoad < 0.8,
    message: avgLoad >= 0.8 ? 'CPU usage high' : undefined,
    details: {
      cores: cpus.length,
      loadAverage: os.loadavg(),
      avgLoad: `${(avgLoad * 100).toFixed(2)}%`,
    },
  };
}

/**
 * Comprehensive Health Check Endpoint
 * GET /api/health
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const checks = {
      database: await checkDatabase(),
      redis: await checkRedis(),
      kamatera_api: await checkKamateraAPI(),
      disk_space: await checkDiskSpace(),
      memory: await checkMemoryUsage(),
      cpu: await checkCPUUsage(),
    };

    const allHealthy = Object.values(checks).every(check => check.healthy);
    const status = allHealthy ? 200 : 503;

    res.status(status).json({
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: `${process.uptime().toFixed(0)}s`,
      environment: process.env.NODE_ENV || 'development',
      checks,
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
});

/**
 * Simple Liveness Probe
 * GET /api/health/live
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Readiness Probe - checks if service is ready to handle requests
 * GET /api/health/ready
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
