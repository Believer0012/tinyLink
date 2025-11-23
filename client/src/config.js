export const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://tinylink-production-6a8f.up.railway.app";
