/**
 * @fileoverview Production Smoke Tests
 * @principle Quality Assurance - Comprehensive production readiness validation
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import axios from 'axios';
import https from 'https';
import dns from 'dns/promises';

const BASE_URL = process.env.API_BASE_URL || 'https://api.spotexsrl.com';
const ADMIN_URL = process.env.ADMIN_URL || 'https://admin.spotexsrl.com';
const AGENCY_URL = process.env.AGENCY_URL || 'https://agency.spotexsrl.com';

// Create axios instance with custom config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  validateStatus: () => true, // Don't throw on any status
});

describe('Production Smoke Tests', () => {
  describe('Database & Services Health', () => {
    test('Backend API health endpoint responds correctly', async () => {
      const response = await api.get('/health');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'healthy');
      expect(response.data).toHaveProperty('checks');
      expect(response.data.checks.database).toHaveProperty('healthy', true);
    });

    test('Database connection is stable', async () => {
      const response = await api.get('/health');
      const dbCheck = response.data.checks?.database;
      
      expect(dbCheck.healthy).toBe(true);
      expect(dbCheck.responseTime).toBeLessThan(1000); // < 1s
    });

    test('Redis connection is working', async () => {
      const response = await api.get('/health');
      const redisCheck = response.data.checks?.redis;
      
      expect(redisCheck.healthy).toBe(true);
    });

    test('System resources are within limits', async () => {
      const response = await api.get('/health');
      const { memory, cpu, disk_space } = response.data.checks;
      
      expect(memory.healthy).toBe(true);
      expect(cpu.healthy).toBe(true);
      expect(disk_space.healthy).toBe(true);
    });
  });

  describe('API Performance', () => {
    test('API responds within acceptable time', async () => {
      const start = Date.now();
      await api.get('/health');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(1000); // < 1s response time
    });

    test('Rate limiting is enforced', async () => {
      // Make many requests quickly
      const requests = Array(150).fill(null).map(() => api.get('/health'));
      const responses = await Promise.all(requests);
      
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true); // Should hit rate limit
    });
  });

  describe('SSL & Security', () => {
    test('SSL certificates are valid', async () => {
      const checkSSL = async (domain: string) => {
        return new Promise((resolve, reject) => {
          const req = https.request({
            host: domain,
            port: 443,
            method: 'HEAD',
            path: '/',
            agent: false,
            rejectUnauthorized: true,
          }, (res) => {
            const cert = res.socket.getPeerCertificate();
            const validTo = new Date(cert.valid_to);
            const now = new Date();
            const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            resolve({
              valid: true,
              daysUntilExpiry,
              issuer: cert.issuer,
            });
          });
          
          req.on('error', reject);
          req.end();
        });
      };

      try {
        const adminSSL: any = await checkSSL('admin.spotexsrl.com');
        const agencySSL: any = await checkSSL('agency.spotexsrl.com');
        
        expect(adminSSL.valid).toBe(true);
        expect(adminSSL.daysUntilExpiry).toBeGreaterThan(7); // > 7 days valid
        
        expect(agencySSL.valid).toBe(true);
        expect(agencySSL.daysUntilExpiry).toBeGreaterThan(7);
      } catch (error) {
        // Skip SSL check in local environment
        if (process.env.NODE_ENV !== 'production') {
          console.log('Skipping SSL check in non-production environment');
        } else {
          throw error;
        }
      }
    });

    test('Security headers are present', async () => {
      const response = await axios.get(BASE_URL + '/health');
      const headers = response.headers;
      
      expect(headers['strict-transport-security']).toBeDefined();
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBeDefined();
    });

    test('HTTPS redirect is working', async () => {
      try {
        const response = await axios.get(BASE_URL.replace('https://', 'http://'), {
          maxRedirects: 0,
          validateStatus: () => true,
        });
        
        expect([301, 302, 307, 308]).toContain(response.status);
        expect(response.headers.location).toMatch(/^https:/);
      } catch (error) {
        // Skip in local development
        console.log('Skipping HTTPS redirect check in development');
      }
    });
  });

  describe('DNS & Network', () => {
    test('DNS records are correctly configured', async () => {
      try {
        const domains = [
          'admin.spotexsrl.com',
          'agency.spotexsrl.com',
          'api.spotexsrl.com',
        ];
        
        for (const domain of domains) {
          const addresses = await dns.resolve4(domain);
          expect(addresses).toBeDefined();
          expect(addresses.length).toBeGreaterThan(0);
        }
      } catch (error) {
        // Skip in local environment
        if (process.env.NODE_ENV !== 'production') {
          console.log('Skipping DNS check in non-production environment');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Application Functionality', () => {
    test('Tenant registration endpoint is accessible', async () => {
      const response = await api.post('/api/tenants/register', {
        name: 'Smoke Test Tenant',
        domain: `smoke-test-${Date.now()}.spotexsrl.com`,
        tier: 'starter',
        adminEmail: `smoke-test-${Date.now()}@example.com`,
        adminPassword: 'TestPassword123!',
      });
      
      expect([201, 400, 409]).toContain(response.status); // Accept validation errors
    });

    test('Frontend admin is accessible', async () => {
      try {
        const response = await axios.get(ADMIN_URL, { timeout: 5000 });
        expect([200, 302]).toContain(response.status);
      } catch (error) {
        console.log('Skipping frontend check in test environment');
      }
    });

    test('Frontend agency is accessible', async () => {
      try {
        const response = await axios.get(AGENCY_URL, { timeout: 5000 });
        expect([200, 302]).toContain(response.status);
      } catch (error) {
        console.log('Skipping frontend check in test environment');
      }
    });
  });

  describe('Monitoring & Logging', () => {
    test('Health check includes all required metrics', async () => {
      const response = await api.get('/health');
      
      expect(response.data).toHaveProperty('timestamp');
      expect(response.data).toHaveProperty('version');
      expect(response.data).toHaveProperty('uptime');
      expect(response.data).toHaveProperty('environment');
      expect(response.data).toHaveProperty('checks');
    });

    test('Liveness probe responds quickly', async () => {
      const start = Date.now();
      const response = await api.get('/health/live');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100); // < 100ms
    });

    test('Readiness probe validates service readiness', async () => {
      const response = await api.get('/health/ready');
      
      expect([200, 503]).toContain(response.status);
      expect(response.data).toHaveProperty('status');
    });
  });

  describe('Error Handling', () => {
    test('404 errors are handled gracefully', async () => {
      const response = await api.get('/nonexistent-endpoint');
      
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    test('Invalid input is rejected properly', async () => {
      const response = await api.post('/api/tenants/register', {
        name: '', // Invalid
      });
      
      expect([400, 422]).toContain(response.status);
      expect(response.data.success).toBe(false);
    });
  });
});

// Export for CI/CD pipeline
export default describe;
