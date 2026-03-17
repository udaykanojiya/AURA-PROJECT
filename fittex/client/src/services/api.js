import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://aura-project-j0kh.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // IMPORTANT: sends session cookies
});

export default api;

// Auth APIs
export const sendOTP = async (email) => {
  const response = await api.post('/auth/send-otp', { email });
  return response.data;
};

export const verifyOTP = async (email, otp) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

// Admin APIs
export const adminLogin = async (username, password) => {
  const response = await api.post('/auth/admin-login', { username, password });
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getRegistrations = async (status = 'pending') => {
  const response = await api.get(`/admin/registrations?status=${status}`);
  return response.data;
};

export const approveRegistration = async (id) => {
  const response = await api.post(`/admin/registrations/${id}/approve`);
  return response.data;
};

export const rejectRegistration = async (id, reason) => {
  const response = await api.post(`/admin/registrations/${id}/reject`, { reason });
  return response.data;
};

export const getMembers = async () => {
  const response = await api.get('/admin/members');
  return response.data;
};

// ─── MEMBER APIs ─────────────────────────────────────────────────────────────

export const memberLogin = async (email) => {
  const response = await api.post('/member/login', { email });
  return response.data;
};

export const getMemberDashboard = async () => {
  const response = await api.get('/member/dashboard');
  return response.data;
};

export const getMemberProfile = async () => {
  const response = await api.get('/member/profile');
  return response.data;
};

export const getMemberAttendance = async () => {
  const response = await api.get('/member/attendance');
  return response.data;
};

export const getMemberWorkoutPlan = async () => {
  const response = await api.get('/member/workout-plan');
  return response.data;
};

export const getMemberInvoices = async () => {
  const response = await api.get('/member/invoices');
  return response.data;
};

export const getMemberQRCode = async () => {
  const response = await api.get('/member/qr-code');
  return response.data;
};

export const memberLogout = async () => {
  const response = await api.post('/member/logout');
  return response.data;
};

export const memberCheckIn = async (qrData, memberLocation) => {
  const response = await api.post('/member/check-in', {
    qrData,
    memberLocation,
    timestamp: new Date().toISOString()
  });
  return response.data;
};

