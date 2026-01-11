/**
 * @label Unit Tests - API Service
 * @description Tests for API client and service layer
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { apiService } from '@/services/api.service';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await apiService.get('/test');

      expect(mockedAxios.get).toHaveBeenCalledWith('/test', { params: undefined });
      expect(result).toEqual(mockData);
    });

    it('should handle GET request with params', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      const params = { page: 1, limit: 10 };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await apiService.get('/test', params);

      expect(mockedAxios.get).toHaveBeenCalledWith('/test', { params });
      expect(result).toEqual(mockData);
    });

    it('should handle GET request errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);

      await expect(apiService.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockResponse = { success: true, id: 123 };
      const requestData = { name: 'Test', value: 'Data' };
      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await apiService.post('/test', requestData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/test', requestData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle POST request with empty data', async () => {
      const mockResponse = { success: true };
      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await apiService.post('/test', {});

      expect(mockedAxios.post).toHaveBeenCalledWith('/test', {});
      expect(result).toEqual(mockResponse);
    });

    it('should handle POST request errors', async () => {
      const error = new Error('Bad request');
      mockedAxios.post.mockRejectedValue(error);

      await expect(apiService.post('/test', {})).rejects.toThrow('Bad request');
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockResponse = { success: true, updated: true };
      const updateData = { id: 1, name: 'Updated' };
      mockedAxios.put.mockResolvedValue({ data: mockResponse });

      const result = await apiService.put('/test/1', updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith('/test/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { success: true, deleted: true };
      mockedAxios.delete.mockResolvedValue({ data: mockResponse });

      const result = await apiService.delete('/test/1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/test/1');
      expect(result).toEqual(mockResponse);
    });
  });
});
