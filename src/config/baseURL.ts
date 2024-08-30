// config.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://futurefocus-bn.onrender.com";

// const BACKEND_URLS = {
//   login: `${API_BASE_URL}/auth/login`,
//   register: `${API_BASE_URL}/auth/register`,
//   getUser: `${API_BASE_URL}/users/me`,
//   // Add more URLs as needed
// };

export default API_BASE_URL;
