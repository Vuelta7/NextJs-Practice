import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  userId: number | null;
  username: string;
  token: string | null;
  setUser: (id: number, name: string) => void;
  setUserId: (id: number) => void;
  setUsername: (name: string) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      username: "",
      token: null,
      setUser: (id, name) => set({ userId: id, username: name }),
      setUserId: (id) => set({ userId: id }),
      setUsername: (name) => set({ username: name }),
      setToken: (token) => set({ token }),
      clearUser: () => set({ userId: null, username: "", token: null }),
    }),
    {
      name: "user-storage", // localStorage key
    }
  )
);
