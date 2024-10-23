import { describe, expect } from 'vitest';
import verifiedPassword from '../../src/services/verifiedPassword';

    describe('verifiedPassword', () => {
    test('should return true for valid passwords', () => {
        expect(verifiedPassword('Password1!')).toBe(true);
        expect(verifiedPassword('Abcdefg@123')).toBe(true);
    });

    test('should return false for passwords with less than 8 characters', () => {
        expect(verifiedPassword('Pass1!')).toBe(false);
    });

    test('should return false for passwords without uppercase letters', () => {
        expect(verifiedPassword('password1!')).toBe(false);
    });

    test('should return false for passwords without special characters', () => {
        expect(verifiedPassword('Password123')).toBe(false);
    });
});
