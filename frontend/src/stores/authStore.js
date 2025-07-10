import { create } from "zustand";

function safeParseAuth() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch (e) {
    // Données invalides, on reset
    localStorage.removeItem("auth");
    return null;
  }
}

const useAuthStore = create((set) => ({
  auth: safeParseAuth(),
  setAuth: (auth) => {
    set({ auth });
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  },
  clearAuth: () => {
    set({ auth: null });
    localStorage.removeItem("auth");
  },
  user: null,
}));

export default useAuthStore;
