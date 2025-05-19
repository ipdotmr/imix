import api from './api';
import { User } from '../types';

const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    tenantId: 'tenant1',
    role: 'admin'
  },
  {
    id: '2',
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    tenantId: 'tenant1',
    role: 'manager'
  },
  {
    id: '3',
    email: 'agent@example.com',
    firstName: 'Agent',
    lastName: 'User',
    tenantId: 'tenant1',
    role: 'agent'
  }
];

export const login = async (email: string, password: string) => {
  const mockUser = mockUsers.find(user => user.email === email);
  
  if (mockUser && password === 'password123') {
    const mockToken = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      access_token: mockToken,
      user: mockUser
    };
  }
  
  try {
    const response = await api.post('/api/users/token', {
      username: email,
      password,
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    }
  } catch (error) {
    console.error('Login error:', error);
  }
  
  throw new Error('Authentication failed');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = async (): Promise<User> => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
