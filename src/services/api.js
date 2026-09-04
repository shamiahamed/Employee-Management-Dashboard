import axios from "axios";

const BASE_URL = "http://localhost:4000";

const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth: json-server has no real auth, so we validate against /users
// and mint a fake JWT-shaped token client-side. This mirrors how the
// UI would behave against a real JWT backend without needing one.
function makeFakeJWT(payload) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  const signature = btoa("mock-signature");
  return `${header}.${body}.${signature}`;
}

export async function loginRequest(email, password) {
  const res = await api.get("/users", { params: { email } });
  const user = res.data[0];
  if (!user || user.password !== password) {
    const err = new Error("Invalid email or password");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  const token = makeFakeJWT({ sub: user.id, email: user.email, name: user.name });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export const getEmployees = () => api.get("/employees");
export const createEmployee = (data) => api.post("/employees", data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export default api;
