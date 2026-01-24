export const API_BASE = 'http://localhost:5007/api';

export const ENDPOINTS = {
  LOGIN: '/user/login',
  REGISTER: '/user/create',
  ANALYTICS: '/statics/display-health',
  PAYMENTS: '/payment-due/payment-due',
  SINGLE_PAYMENT: (id) => `/payment-due/payment-due/${id}`,
};