import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../src/app/login/page';
import Register from '../src/app/register/page';
import AdminDashboard from '../src/app/admin/page';
import { AuthProvider } from './path/to/AuthProvider'; // Adjust the import path as needed

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Authentication Components', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Login Component', () => {
    it('renders login form', () => {
      render(
        <AuthProvider>
          <Login />
        </AuthProvider>
      );
      expect(screen.getByText('Sign in to CyberSentinel AI')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('validates email input', async () => {
      render(
        <AuthProvider>
          <Login />
        </AuthProvider>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('sanitizes input values', async () => {
      render(
        <AuthProvider>
          <Login />
        </AuthProvider>
      );
      const emailInput = screen.getByLabelText(/email/i);
      
      fireEvent.change(emailInput, { target: { value: '<script>alert("xss")</script>test@example.com' } });
      
      expect(emailInput.value).not.toContain('<script>');
    });

    it('handles successful login', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'fake-token',
          refresh_token: 'fake-refresh-token',
          token_type: 'bearer'
        })
      });

      render(
        <AuthProvider>
          <Login />
        </AuthProvider>
      );
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'TestPass123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'TestPass123!'
          })
        }));
      });
    });
  });

  describe('Register Component', () => {
    it('renders registration form', () => {
      render(
        <AuthProvider>
          <Register />
        </AuthProvider>
      );
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('validates password strength', async () => {
      render(
        <AuthProvider>
          <Register />
        </AuthProvider>
      );
      const passwordInput = screen.getByLabelText(/^password/i);
      
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('validates password confirmation', async () => {
      render(
        <AuthProvider>
          <Register />
        </AuthProvider>
      );
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      fireEvent.change(passwordInput, { target: { value: 'TestPass123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });
});

describe('Admin Dashboard Component', () => {
  beforeEach(() => {
    // Mock localStorage for token
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'fake-admin-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        user_performance: {
          total_users: 100,
          active_users: 85,
          completion_rate: 75.5,
          average_score: 82.3
        },
        attack_success: {
          phishing_success_rate: 15.2,
          malicious_url_success_rate: 8.7,
          password_compromise_rate: 23.1
        },
        risk_scoring: {
          high_risk: 12,
          medium_risk: 28,
          low_risk: 45,
          total_assessed: 85
        },
        compliance: {
          gdpr: { passed: 65, total: 85, rate: 76.5 },
          hipaa: { passed: 58, total: 70, rate: 82.9 }
        }
      })
    });
  });

  it('renders admin dashboard with analytics', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('displays risk distribution', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Risk Distribution')).toBeInTheDocument();
      expect(screen.getByText('High Risk')).toBeInTheDocument();
      expect(screen.getByText('Medium Risk')).toBeInTheDocument();
      expect(screen.getByText('Low Risk')).toBeInTheDocument();
    });
  });

  it('handles export compliance report', async () => {
    // Mock URL.createObjectURL and document.createElement
    global.URL.createObjectURL = jest.fn(() => 'fake-url');
    const mockAnchor = {
      href: '',
      download: '',
      click: jest.fn()
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);

    render(<AdminDashboard />);
    
    await waitFor(() => {
      const exportButton = screen.getByText('Export Compliance Report');
      fireEvent.click(exportButton);
    });

    expect(fetch).toHaveBeenCalledWith('/api/admin/reports/compliance', expect.objectContaining({
      headers: { 'Authorization': 'Bearer fake-admin-token' }
    }));
  });
});