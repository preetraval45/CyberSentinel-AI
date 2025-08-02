import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should register new user successfully', async ({ page }) => {
    await page.click('text=Login');
    await page.click('text=Create account');
    
    await page.fill('input[type="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL('/dashboard');
  });

  test('should login existing user', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPass123!');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('text=Login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should validate password strength on registration', async ({ page }) => {
    await page.click('text=Login');
    await page.click('text=Create account');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should prevent XSS in login form', async ({ page }) => {
    await page.click('text=Login');
    
    const maliciousInput = '<script>alert("xss")</script>test@example.com';
    await page.fill('input[type="email"]', maliciousInput);
    
    const emailValue = await page.inputValue('input[type="email"]');
    expect(emailValue).not.toContain('<script>');
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/login');
  });

  test('should access admin dashboard with admin credentials', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');
    
    // Navigate to admin dashboard
    await page.goto('/admin');
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('should deny admin access to regular user', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'UserPass123!');
    await page.click('button[type="submit"]');
    
    // Try to access admin dashboard
    await page.goto('/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });
});

test.describe('Security Headers', () => {
  test('should have proper security headers', async ({ page }) => {
    const response = await page.goto('/');
    
    const headers = response?.headers();
    expect(headers?.['x-frame-options']).toBe('DENY');
    expect(headers?.['x-content-type-options']).toBe('nosniff');
    expect(headers?.['x-xss-protection']).toBe('1; mode=block');
    expect(headers?.['content-security-policy']).toContain("default-src 'self'");
  });

  test('should enforce HTTPS in production', async ({ page }) => {
    // This would be tested in a production environment
    const response = await page.goto('/');
    const headers = response?.headers();
    
    if (process.env.NODE_ENV === 'production') {
      expect(headers?.['strict-transport-security']).toContain('max-age=31536000');
    }
  });
});