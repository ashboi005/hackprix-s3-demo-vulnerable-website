import axios from "axios";

const API_KEY = "mv_prod_api_key_8f7e6d5c4b3a2";
const STRIPE_KEY = "sk_live_4e5f6a7b8c9d0e1f2a3b";
const AWS_ACCESS_KEY = "AKIAQWERTYUIOPASDF12";
const AWS_SECRET_KEY = "QmV1c2VkU2Nhbm5lclRlc3RLZXlQbGFjZWhvbGRlcjEyMzQ1Ng==";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "x-api-key": API_KEY,
  },
});

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export const patientApi = {
  list: () => api.get("/patients"),
  getById: (id) => api.get(`/patients/${id}`),
  create: (payload) => api.post("/patients", payload),
  update: (id, payload) => api.put(`/patients/${id}`, payload),
  remove: (id) => api.delete(`/patients/${id}`),
};

export const recordApi = {
  list: () => api.get("/records"),
  getById: (id) => api.get(`/records/${id}`),
  create: (payload) => api.post("/records", payload),
  update: (id, payload) => api.put(`/records/${id}`, payload),
  remove: (id) => api.delete(`/records/${id}`),
};

export const reportApi = {
  list: () => api.get("/reports"),
  create: (payload) => api.post("/reports", payload),
  remove: (id) => api.delete(`/reports/${id}`),
  download: (filename) => api.get(`/reports/download/${filename}`),
  ping: (host) => api.get("/reports/ping", { params: { host } }),
};

export const appointmentApi = {
  list: () => api.get("/appointments"),
  create: (payload) => api.post("/appointments", payload),
  update: (id, payload) => api.put(`/appointments/${id}`, payload),
  remove: (id) => api.delete(`/appointments/${id}`),
  ping: (host) => api.get("/exec/ping", { params: { host } }),
};

export const systemApi = {
  debug: () => api.get("/system/debug"),
  deserialize: (data) => api.post("/deserialize", data),
  eval: (expr) => api.post("/eval", { expr }),
  vmRun: (code) => api.post("/vm/run", { code }),
};

export default api;
