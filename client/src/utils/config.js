const config = {
  apiUrl:
    (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
    import.meta.env?.VITE_API_URL ||
    "http://localhost:5000",

  isDevelopment:
    (typeof process !== "undefined" && process.env?.NODE_ENV === "development") || import.meta.env?.DEV || true,
}

export default config
