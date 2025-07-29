import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      restaurant: null,

      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),

      setRestaurant: (restaurantData) => set({ restaurant: restaurantData }),
      clearRestaurant: () => set({ restaurant: null }),
    }),
    {
      name: "user-data", // key in sessionStorage
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

export default useUserStore;
