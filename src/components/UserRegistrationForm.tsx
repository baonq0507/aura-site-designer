import React, { useState } from 'react';
import { useUserRegistration } from '@/hooks/useUserRegistration';
import type { CreateUserData } from '@/types/auth';

/**
 * Component form đăng ký user với email được generate tự động
 */
export const UserRegistrationForm: React.FC = () => {
  const { registerUser, generateEmail, isLoading, error, success, reset } = useUserRegistration();
  
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    phoneNumber: '',
    password: '',
    fundPassword: '',
    invitationCode: ''
  });

  const [generatedEmail, setGeneratedEmail] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateEmail = async () => {
    if (!formData.username) {
      alert('Vui lòng nhập username trước');
      return;
    }

    const email = await generateEmail(formData.username);
    if (email) {
      setGeneratedEmail(email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!generatedEmail) {
      alert('Vui lòng generate email trước khi đăng ký');
      return;
    }

    const result = await registerUser(formData);
    if (result) {
      console.log('Đăng ký thành công:', result);
      // Reset form sau khi đăng ký thành công
      setFormData({
        username: '',
        phoneNumber: '',
        password: '',
        fundPassword: '',
        invitationCode: ''
      });
      setGeneratedEmail('');
    }
  };

  const handleReset = () => {
    reset();
    setFormData({
      username: '',
      phoneNumber: '',
      password: '',
      fundPassword: '',
      invitationCode: ''
    });
    setGeneratedEmail('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Đăng Ký Tài Khoản
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Đăng ký thành công!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0123456789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu quỹ *
          </label>
          <input
            type="password"
            name="fundPassword"
            value={formData.fundPassword}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu quỹ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã giới thiệu *
          </label>
          <input
            type="text"
            name="invitationCode"
            value={formData.invitationCode}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mã giới thiệu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email được generate
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={generatedEmail}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Email sẽ được tạo tự động"
            />
            <button
              type="button"
              onClick={handleGenerateEmail}
              disabled={!formData.username || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !generatedEmail}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
