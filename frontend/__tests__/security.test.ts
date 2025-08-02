import { 
  sanitizeInput, 
  validateEmail, 
  validatePassword, 
  escapeHtml, 
  isValidUrl,
  secureStorage 
} from '../utils/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('javascript:alert("xss")')).toBe(':alert("xss")');
      expect(sanitizeInput('onclick="alert(1)"')).toBe('="alert(1)"');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(123 as any)).toBe('123');
      expect(sanitizeInput(null as any)).toBe('null');
    });

    it('should limit input length', () => {
      const longInput = 'a'.repeat(2000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should reject overly long emails', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('TestPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'weak',           // Too short
        'testpass123!',   // No uppercase
        'TESTPASS123!',   // No lowercase
        'TestPass!',      // No number
        'TestPass123'     // No special char
      ];

      weakPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      // Mock document.createElement
      const mockDiv = {
        textContent: '',
        innerHTML: ''
      };
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockDiv as any);
      
      mockDiv.innerHTML = '&lt;script&gt;alert("xss")&lt;/script&gt;';
      const result = escapeHtml('<script>alert("xss")</script>');
      expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
    });
  });

  describe('secureStorage', () => {
    beforeEach(() => {
      // Mock sessionStorage
      const mockStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
      };
      Object.defineProperty(window, 'sessionStorage', {
        value: mockStorage,
        writable: true
      });
    });

    it('should store items securely', () => {
      secureStorage.setItem('test', 'value');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('test', 'value');
    });

    it('should retrieve items securely', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue('value');
      const result = secureStorage.getItem('test');
      expect(result).toBe('value');
      expect(sessionStorage.getItem).toHaveBeenCalledWith('test');
    });

    it('should handle storage errors gracefully', () => {
      (sessionStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      secureStorage.setItem('test', 'value');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});