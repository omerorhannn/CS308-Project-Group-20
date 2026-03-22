/**
 * API Service Layer
 *
 * Bu dosya backend entegrasyonu icin hazir bir katmandir.
 * Simdilik mock (sahte) veri dondurur.
 *
 * Backend hazirlandi:
 * 1. BASE_URL'i gercek API adresine degistirin
 * 2. Mock response'lari kaldirip gercek fetch/axios call'lari yazin
 * 3. Token yonetimini ekleyin
 */

const BASE_URL = '/api'; // Backend hazir oldugunda degistirilecek

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ===================== AUTH =====================

export async function loginUser(email, password) {
  await delay(600);
  // TODO: Replace with real API call
  // const res = await fetch(`${BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // });
  // return res.json();

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }
  return {
    success: true,
    user: { id: 1, name: 'Test User', email },
    token: 'mock-jwt-token',
  };
}

export async function registerUser(data) {
  await delay(800);
  // TODO: Replace with real API call
  // const res = await fetch(`${BASE_URL}/auth/register`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return res.json();

  if (!data.email || !data.password || !data.firstName || !data.lastName) {
    return { success: false, error: 'All required fields must be filled.' };
  }
  if (data.password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }
  return {
    success: true,
    user: { id: 2, name: `${data.firstName} ${data.lastName}`, email: data.email },
    token: 'mock-jwt-token',
  };
}

// ===================== PRODUCTS =====================

export async function fetchProducts() {
  await delay(300);
  // TODO: Replace with real API call
  // const res = await fetch(`${BASE_URL}/products`);
  // return res.json();

  const products = (await import('../data/products.js')).default;
  return { success: true, products };
}

export async function fetchProductById(id) {
  await delay(200);
  // TODO: Replace with real API call
  const products = (await import('../data/products.js')).default;
  const product = products.find((p) => p.id === id);
  if (!product) return { success: false, error: 'Product not found.' };
  return { success: true, product };
}

// ===================== CART =====================

export async function addToCartAPI(productId, quantity = 1) {
  await delay(200);
  // TODO: Replace with real API call
  return { success: true, message: 'Product added to cart.' };
}

export async function removeFromCartAPI(productId) {
  await delay(200);
  // TODO: Replace with real API call
  return { success: true, message: 'Product removed from cart.' };
}

// ===================== WISHLIST =====================

export async function toggleWishlistAPI(productId) {
  await delay(200);
  // TODO: Replace with real API call
  return { success: true };
}
