import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      restaurant: null,
      
      // Notification state
      notifications: [],
      newOrderAlert: false,
      latestOrderId: null,

      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),

      setRestaurant: (restaurantData) => set({ restaurant: restaurantData }),
      clearRestaurant: () => set({ restaurant: null }),

      // Notification actions
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now(), timestamp: new Date() }]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      setNewOrderAlert: (alert) => set({ newOrderAlert: alert }),
      setLatestOrderId: (id) => set({ latestOrderId: id }),
      
      // Auto-remove old notifications (keep only last 10)
      cleanupNotifications: () => set((state) => ({
        notifications: state.notifications.slice(-10)
      })),
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
