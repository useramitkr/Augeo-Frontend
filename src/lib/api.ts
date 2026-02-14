import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('augeo_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('augeo_token');
        localStorage.removeItem('augeo_user');
        if (!window.location.pathname.startsWith('/auth/')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.put(`/auth/reset-password/${token}`, { password }),
};

// Auction API
export const auctionAPI = {
  getAll: (params?: any) => api.get('/auctions', { params }),
  getFeatured: () => api.get('/auctions/featured'),
  getBySlug: (slug: string) => api.get(`/auctions/${slug}`),
  getByCategory: (categorySlug: string, params?: any) => api.get(`/auctions/category/${categorySlug}`, { params }),
};

// Lot API
export const lotAPI = {
  getByAuction: (auctionId: string, params?: any) => api.get(`/lots/auction/${auctionId}`, { params }),
  getById: (id: string) => api.get(`/lots/${id}`),
  getBidHistory: (lotId: string) => api.get(`/lots/${lotId}/bids`),
  askQuestion: (lotId: string, question: string) => api.post(`/lots/${lotId}/questions`, { question }),
};

// Bid API
export const bidAPI = {
  placeBid: (data: { lotId: string; amount: number; maxAutoBid?: number }) => api.post('/bids', data),
  getMyBids: (params?: any) => api.get('/bids/my-bids', { params }),
  getActiveBids: () => api.get('/bids/active'),
  setupAutoBid: (lotId: string, maxAmount: number) => api.post('/bids/auto-bid', { lotId, maxAmount }),
};

// Order API
export const orderAPI = {
  getMyOrders: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  getInvoice: (id: string) => api.get(`/orders/${id}/invoice`),
};

// Notification API
export const notificationAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Watchlist API
export const watchlistAPI = {
  getAll: () => api.get('/watchlist'),
  add: (data: { auctionId?: string; lotId?: string }) => api.post('/watchlist', data),
  remove: (id: string) => api.delete(`/watchlist/${id}`),
  check: (auctionId: string) => api.get(`/watchlist/check/${auctionId}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

// Page API
export const pageAPI = {
  getBySlug: (slug: string) => api.get(`/pages/${slug}`),
};

// Search API
export const searchAPI = {
  search: (params: any) => api.get('/search', { params }),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (orderId: string) => api.post('/payments/create-intent', { orderId }),
  confirmPayment: (orderId: string, paymentIntentId: string) => api.post('/payments/confirm', { orderId, paymentIntentId }),
};

// User API
export const userAPI = {
  updateProfile: (data: any) => api.put('/users/profile', data),
  updateAvatar: (formData: FormData) => api.put('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  addAddress: (data: any) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: any) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
  uploadKYC: (formData: FormData) => api.post('/users/kyc', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  submitSupportTicket: (data: any) => api.post('/users/support', data),
};

// Client API
export const clientAPI = {
  getDashboard: () => api.get('/client/dashboard'),
  // Auctions
  getAuctions: (params?: any) => api.get('/client/auctions', { params }),
  getAuction: (id: string) => api.get(`/client/auctions/${id}`),
  createAuction: (data: any) => api.post('/client/auctions', data),
  updateAuction: (id: string, data: any) => api.put(`/client/auctions/${id}`, data),
  publishAuction: (id: string) => api.put(`/client/auctions/${id}/publish`),
  unpublishAuction: (id: string) => api.put(`/client/auctions/${id}/unpublish`),
  // Lots
  getLots: (auctionId: string, params?: any) => api.get(`/client/auctions/${auctionId}/lots`, { params }),
  createLot: (auctionId: string, data: any) => api.post(`/client/auctions/${auctionId}/lots`, data),
  updateLot: (lotId: string, data: any) => api.put(`/client/lots/${lotId}`, data),
  deleteLot: (lotId: string) => api.delete(`/client/lots/${lotId}`),
  uploadLotImages: (lotId: string, formData: FormData) => api.post(`/client/lots/${lotId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  // Orders
  getOrders: (params?: any) => api.get('/client/orders', { params }),
  updateOrderStatus: (id: string, data: any) => api.put(`/client/orders/${id}`, data),
  // Reports
  getReports: (params?: any) => api.get('/client/reports', { params }),
  // Settings
  updateProfile: (data: any) => api.put('/client/profile', data),
  updateBankDetails: (data: any) => api.put('/client/bank-details', data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  // Users
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  suspendUser: (id: string, reason: string) => api.put(`/admin/users/${id}/suspend`, { reason }),
  activateUser: (id: string) => api.put(`/admin/users/${id}/activate`),
  // Clients
  getPendingClients: () => api.get('/admin/clients/pending'),
  approveClient: (id: string) => api.put(`/admin/clients/${id}/approve`),
  rejectClient: (id: string, reason: string) => api.put(`/admin/clients/${id}/reject`, { reason }),
  // Auctions
  getAuctions: (params?: any) => api.get('/admin/auctions', { params }),
  updateAuction: (id: string, data: any) => api.put(`/admin/auctions/${id}`, data),
  cancelAuction: (id: string, reason: string) => api.put(`/admin/auctions/${id}/cancel`, { reason }),
  suspendAuction: (id: string, reason: string) => api.put(`/admin/auctions/${id}/suspend`, { reason }),
  // Orders & Financial
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  processRefund: (orderId: string, amount: number) => api.post(`/admin/orders/${orderId}/refund`, { amount }),
  approvePayout: (orderId: string) => api.put(`/admin/orders/${orderId}/approve-payout`),
  // KYC
  getPendingKYC: () => api.get('/admin/kyc/pending'),
  approveKYC: (userId: string) => api.put(`/admin/kyc/${userId}/approve`),
  rejectKYC: (userId: string, reason: string) => api.put(`/admin/kyc/${userId}/reject`, { reason }),
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data: any) => api.post('/admin/categories', data),
  updateCategory: (id: string, data: any) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  // Pages
  getPages: () => api.get('/admin/pages'),
  createPage: (data: any) => api.post('/admin/pages', data),
  updatePage: (id: string, data: any) => api.put(`/admin/pages/${id}`, data),
  deletePage: (id: string) => api.delete(`/admin/pages/${id}`),
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
  // Reports
  getReports: (params?: any) => api.get('/admin/reports', { params }),
  // Activity Logs
  getActivityLogs: (params?: any) => api.get('/admin/activity-logs', { params }),
};

export default api;
