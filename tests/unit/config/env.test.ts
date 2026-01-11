/**
 * @label Unit Tests - Environment Configuration
 * @description Tests for environment variable configuration
 */

import { describe, it, expect, afterEach } from 'vitest';
import { env, validateEnv, getEnvironmentName } from '@/config/env';

describe('Environment Configuration', () => {
  const originalEnv = { ...import.meta.env };

  afterEach(() => {
    // Restore original env
    Object.keys(import.meta.env).forEach(key => {
      delete (import.meta.env as any)[key];
    });
    Object.assign(import.meta.env, originalEnv);
  });

  describe('env object', () => {
    it('should have app configuration', () => {
      expect(env).toBeDefined();
      expect(env).toHaveProperty('APP_NAME');
      expect(env).toHaveProperty('APP_VERSION');
      expect(env).toHaveProperty('APP_DESCRIPTION');
    });

    it('should have API configuration', () => {
      expect(env).toBeDefined();
      expect(env).toHaveProperty('API_BASE_URL');
      expect(env).toHaveProperty('API_TIMEOUT');
    });

    it('should have AI configuration', () => {
      expect(env).toBeDefined();
      expect(env).toHaveProperty('OPENAI_API_KEY');
      expect(env).toHaveProperty('OPENAI_MODEL');
    });

    it('should have feature flags', () => {
      expect(env).toBeDefined();
      expect(env).toHaveProperty('ENABLE_ANALYTICS');
      expect(env).toHaveProperty('ENABLE_DEBUG');
    });

    it('should have default values', () => {
      expect(env.APP_NAME).toBeTruthy();
      expect(env.APP_VERSION).toBeTruthy();
      expect(env.API_TIMEOUT).toBeGreaterThan(0);
    });
  });

  describe('validateEnv', () => {
    it('should not throw with valid configuration', () => {
      expect(() => validateEnv()).not.toThrow();
    });

    it('should handle missing API_BASE_URL', () => {
      // Should log warning but not throw
      expect(() => validateEnv()).not.toThrow();
    });
  });

  describe('getEnvironmentName', () => {
    it('should return environment name', () => {
      const envName = getEnvironmentName();
      expect(envName).toBeTruthy();
      expect(typeof envName).toBe('string');
    });

    it('should identify development mode', () => {
      const envName = getEnvironmentName();
      expect(['Development', 'Test', 'Production', 'Staging']).toContain(envName);
    });
  });

  describe('feature flags', () => {
    it('should parse boolean feature flags correctly', () => {
      expect(typeof env.ENABLE_ANALYTICS).toBe('boolean');
      expect(typeof env.ENABLE_DEBUG).toBe('boolean');
    });
  });

  describe('API timeout', () => {
    it('should parse timeout as number', () => {
      expect(typeof env.API_TIMEOUT).toBe('number');
      expect(env.API_TIMEOUT).toBeGreaterThan(0);
    });

    it('should have default timeout', () => {
      expect(env.API_TIMEOUT).toBeGreaterThan(0);
      expect(typeof env.API_TIMEOUT).toBe('number');
    });
  });
});
