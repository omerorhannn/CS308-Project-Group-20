import { describe, it, expect } from 'vitest';
import { loginUser, registerUser, fetchProducts, fetchProductById } from '../services/api';

describe('API Service — loginUser', () => {
  it('should return success with valid credentials', async () => {
    const result = await loginUser('test@example.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBeDefined();
  });

  it('should fail with empty email', async () => {
    const result = await loginUser('', 'password123');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should fail with empty password', async () => {
    const result = await loginUser('test@example.com', '');
    expect(result.success).toBe(false);
  });
});

describe('API Service — registerUser', () => {
  it('should register with valid data', async () => {
    const result = await registerUser({
      firstName: 'John', lastName: 'Doe',
      email: 'john@example.com', password: 'password123',
    });
    expect(result.success).toBe(true);
    expect(result.user.name).toBe('John Doe');
  });

  it('should fail with missing fields', async () => {
    const result = await registerUser({ email: 'test@example.com', password: 'pass' });
    expect(result.success).toBe(false);
  });

  it('should fail with short password', async () => {
    const result = await registerUser({
      firstName: 'John', lastName: 'Doe',
      email: 'john@example.com', password: '123',
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain('8 characters');
  });
});

describe('API Service — fetchProducts', () => {
  it('should return products array', async () => {
    const result = await fetchProducts();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.products)).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);
  });
});

describe('API Service — fetchProductById', () => {
  it('should find existing product', async () => {
    const result = await fetchProductById(1);
    expect(result.success).toBe(true);
    expect(result.product.id).toBe(1);
  });

  it('should fail for non-existing product', async () => {
    const result = await fetchProductById(9999);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
