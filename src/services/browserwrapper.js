export const  safeLocalStorage = {
  getItem: (key) => typeof window !== "undefined" ? localStorage.getItem(key) : null,
  setItem: (key, value) => { if (typeof window !== "undefined") localStorage.setItem(key, value) },
  clear: () => { if (typeof window !== "undefined") localStorage.clear() }
};
