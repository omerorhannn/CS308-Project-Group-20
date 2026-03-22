import { describe, it, expect } from 'vitest';
import products from '../data/products';

describe('Products data integrity', () => {
  it('should have products defined', () => {
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
  });

  it('every product should have required fields', () => {
    const requiredFields = ['id', 'brand', 'name', 'description', 'category', 'img', 'rating', 'reviews', 'price', 'priceDisplay', 'stars', 'stock', 'tags'];
    products.forEach((product) => {
      requiredFields.forEach((field) => {
        expect(product).toHaveProperty(field);
      });
    });
  });

  it('every product should have unique id', () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('price should be a positive number', () => {
    products.forEach((p) => {
      expect(p.price).toBeGreaterThan(0);
      expect(typeof p.price).toBe('number');
    });
  });

  it('stock should be a non-negative integer', () => {
    products.forEach((p) => {
      expect(p.stock).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(p.stock)).toBe(true);
    });
  });

  it('rating should be between 0 and 5', () => {
    products.forEach((p) => {
      expect(p.rating).toBeGreaterThanOrEqual(0);
      expect(p.rating).toBeLessThanOrEqual(5);
    });
  });

  it('stars array should have exactly 5 elements', () => {
    products.forEach((p) => {
      expect(p.stars).toHaveLength(5);
      p.stars.forEach((s) => {
        expect([0, 0.5, 1]).toContain(s);
      });
    });
  });

  it('tags should only contain valid tag values', () => {
    const validTags = ['best-seller', 'new', 'sale'];
    products.forEach((p) => {
      p.tags.forEach((tag) => {
        expect(validTags).toContain(tag);
      });
    });
  });

  it('products with sale badge should have oldPrice', () => {
    products.filter((p) => p.tags.includes('sale')).forEach((p) => {
      expect(p.oldPrice).toBeGreaterThan(p.price);
    });
  });
});
