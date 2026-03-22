import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';

const wrapper = ({ children }) => (
  <ToastProvider>
    <CartProvider>{children}</CartProvider>
  </ToastProvider>
);

const mockProduct = {
  id: 1, brand: 'Test', name: 'Test Product', price: 100,
  priceDisplay: '$100', stock: 10, img: '', stars: [1,1,1,1,0],
  rating: 4, reviews: 50, reviewsDisplay: '50', tags: [],
  category: 'test', description: 'Test', badge: '', badgeType: '',
  oldPrice: null, oldPriceDisplay: '',
};

const mockProduct2 = { ...mockProduct, id: 2, name: 'Product 2', price: 200, priceDisplay: '$200' };

describe('CartContext', () => {
  it('should start with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it('should add a product to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(mockProduct); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartTotal).toBe(100);
  });

  it('should increase quantity when adding same product twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.addToCart(mockProduct); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.cartCount).toBe(2);
    expect(result.current.cartTotal).toBe(200);
  });

  it('should handle multiple different products', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.addToCart(mockProduct2); });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.cartCount).toBe(2);
    expect(result.current.cartTotal).toBe(300);
  });

  it('should remove a product from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.addToCart(mockProduct2); });
    act(() => { result.current.removeFromCart(1); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(2);
  });

  it('should update quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.updateQuantity(1, 5); });
    expect(result.current.cartCount).toBe(5);
    expect(result.current.cartTotal).toBe(500);
  });

  it('should remove item when quantity set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.updateQuantity(1, 0); });
    expect(result.current.items).toHaveLength(0);
  });

  it('should clear all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.addToCart(mockProduct2); });
    act(() => { result.current.clearCart(); });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
  });

  it('should report isInCart correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.isInCart(1)).toBe(false);
    act(() => { result.current.addToCart(mockProduct); });
    expect(result.current.isInCart(1)).toBe(true);
    expect(result.current.isInCart(999)).toBe(false);
  });
});
