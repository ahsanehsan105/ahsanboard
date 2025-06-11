// Environment configuration
const config = {
  // API URL with fallbacks for different environments
  apiUrl:
    // For Create React App
    (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
    // For Vite
    import.meta.env?.VITE_API_URL ||
    // Default fallback
    "http://localhost:5000",

  // Other configuration variables can be added here
  isDevelopment:
    (typeof process !== "undefined" && process.env?.NODE_ENV === "development") || import.meta.env?.DEV || true,
}

export default config
