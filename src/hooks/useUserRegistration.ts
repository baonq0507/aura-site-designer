import { useState } from 'react';
import { createUserWithGeneratedEmail, generateUniqueEmail } from '@/utils/authUtils';
import type { CreateUserData, CreateUserResponse } from '@/types/auth';

/**
 * Hook để quản lý việc đăng ký user với email được generate tự động
 */
export const useUserRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Tạo tài khoản mới với email được generate tự động
   */
  const registerUser = async (userData: CreateUserData): Promise<CreateUserResponse | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Tạo tài khoản
      const result = await createUserWithGeneratedEmail(userData);
      
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo tài khoản';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate email duy nhất cho username
   */
  const generateEmail = async (username: string): Promise<string | null> => {
    try {
      const email = await generateUniqueEmail(username);
      return email;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tạo email';
      setError(errorMessage);
      return null;
    }
  };

  /**
   * Reset trạng thái
   */
  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    registerUser,
    generateEmail,
    isLoading,
    error,
    success,
    reset
  };
};
