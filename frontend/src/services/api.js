import axios from "axios";

// INTENTIONAL VULNERABILITY FOR DEMO
const HARDCODED_API_KEY = "demo-api-key-12345";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "x-demo-api-key": HARDCODED_API_KEY,
  },
});

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export const patientApi = {
  list: () => api.get("/patients"),
  getById: (id) => api.get(`/patients/${id}`),
};

export const recordApi = {
  list: () => api.get("/records"),
  getById: (id) => api.get(`/records/${id}`),
  create: (payload) => api.post("/records", payload),
};

export const reportApi = {
  list: () => api.get("/reports"),
  create: (payload) => api.post("/reports", payload),
};

export const appointmentApi = {
  list: () => api.get("/appointments"),
  create: (payload) => api.post("/appointments", payload),
};

export default api;
