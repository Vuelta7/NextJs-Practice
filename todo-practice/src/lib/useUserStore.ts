import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  userId: number | null;
  username: string;
  setUsername: (name: string) => void;
  setUserId: (id: number) => void;
  clearUser: () => void;
};


export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      username: "",
      setUsername: (name) => set({ username: name }),
      setUserId: (id) => set({ userId: id }),
      clearUser: () => set({ userId: null, username: "" }),
    }),
    {
      name: "user-storage", // localStorage key
    }
  )
);

