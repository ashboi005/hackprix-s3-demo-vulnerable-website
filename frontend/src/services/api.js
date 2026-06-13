import axios from "axios";

// INTENTIONAL VULNERABILITY FOR DEMO
const HARDCODED_API_KEY = "mv_prod_api_key_8f7e6d5c4b3a2";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "x-api-key": HARDCODED_API_KEY,
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
};

export const appointmentApi = {
  list: () => api.get("/appointments"),
  create: (payload) => api.post("/appointments", payload),
  update: (id, payload) => api.put(`/appointments/${id}`, payload),
  remove: (id) => api.delete(`/appointments/${id}`),
};

export default api;
