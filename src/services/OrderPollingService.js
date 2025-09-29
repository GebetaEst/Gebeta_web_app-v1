// src/services/OrderPollingService.js
import axios from "axios";
import useUserStore from "../Store/UseStore";
import bellSound from "../assets/N-Bell.mp3";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

// The singleton class for handling API and WebSocket logic
class OrderPollingService {
  constructor() {
    this.interval = null;
    this.isRunning = false;
    this.baseURL = "https://gebeta-delivery1.onrender.com/api/v1/orders/restaurant";
    this.lastFetchTime = 0;
    this.minFetchInterval = 3000;
    this.socket = null;
    this.onNewOrderCallback = null; // Callback for React component
    this.connectWebSocket();
  }

  // Set the callback function from the React hook
  setNewOrderCallback(callback) {
    this.onNewOrderCallback = callback;
  }

  connectWebSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    const token = localStorage.getItem("token");
    const store = JSON.parse(sessionStorage.getItem("user-data"));
    const restaurantId = store?.state?.restaurant?._id;

    if (!token || !restaurantId) {
      console.error("❌ Cannot connect to WebSocket: Missing token or restaurantId");
      return;
    }

    const socketURL = "https://gebeta-delivery1.onrender.com";
    this.socket = io(socketURL, {
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to socket:", this.socket.id);
    });

    this.socket.on("newOrder", (orderData) => {
      console.log("🔔 New order received via socket:", orderData);
      // Trigger the callback in the React hook
      if (this.onNewOrderCallback) {
        this.onNewOrderCallback();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });
  }

  getAPI_URL() {
    const store = JSON.parse(sessionStorage.getItem("user-data"));
    const restaurantId = store?.state?.restaurant?._id;
    if (!restaurantId) {
      console.error("❌ No restaurantId found in sessionStorage");
      return null;
    }
    return `${this.baseURL}/${restaurantId}/orders`;
  }

  async fetchOrders() {
    const now = Date.now();
    if (now - this.lastFetchTime < this.minFetchInterval) {
      return;
    }
    this.lastFetchTime = now;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found in localStorage");
        this.stopPolling();
        return;
      }
      const apiURL = this.getAPI_URL();
      if (!apiURL) {
        return;
      }

      // Set loading state in Zustand store
      const store = useUserStore.getState();
      store.setOrdersLoading?.(true);
      store.setOrdersError?.(null);

      const res = await axios.get(apiURL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res)

      const orders = res.data.data || [];
      const sorted = this.sortOrders(orders);
      
      // Store orders in Zustand store
      store.setOrders?.(sorted);
      store.setOrdersLoading?.(false);
      
      // Handle new order notification if there are orders
      if (orders.length > 0) {
        this.handleNewOrder(sorted[0]);
      }
    } catch (error) {
      console.error(
        "❌ OrderPollingService error:",
        error.response ? error.response.data : error.message
      );
      const store = useUserStore.getState();
      store.setOrdersLoading?.(false);
      store.setOrdersError?.("Failed to fetch orders");
      store.addNotification?.({
        id: Date.now().toString(),
        type: "error",
        title: "Connection Error",
        message:
          error.response?.status === 401
            ? "Authentication failed. Please log in again."
            : "Failed to get orders. Please check your connection.",
        timestamp: Date.now(),
      });
    }
  }

  handleNewOrder(orderData) {
    const store = useUserStore.getState();
    const latestFetchedId = orderData?.orderId || orderData?._id;
    const currentLatestId = store.latestOrderId;
    if (latestFetchedId && latestFetchedId !== currentLatestId) {
      store.setNewOrderAlert?.(true);
      store.setLatestOrderId?.(latestFetchedId);
      store.addNotification?.({
        id: Date.now().toString(),
        type: "info",
        title: "New Order Received",
        message: `Order #${orderData?.orderCode || latestFetchedId} has been placed`,
        timestamp: Date.now(),
      });
      this.playNotificationSound();
      setTimeout(() => {
        const currentStore = useUserStore.getState();
        currentStore.setNewOrderAlert?.(false);
      }, 5000);
    }
  }

  sortOrders(orders) {
    const statusPriority = { pending: 1, preparing: 2, cooked: 3, delivering: 5 };
    return [...orders].sort((a, b) => {
      const priorityA = statusPriority[a.orderStatus?.toLowerCase()] || 99;
      const priorityB = statusPriority[b.orderStatus?.toLowerCase()] || 99;
      return priorityA - priorityB;
    });
  }

  playNotificationSound() {
    try {
      const audio = new Audio(bellSound);
      audio.volume = 0.5;
      audio.play().catch((err) =>
        console.warn("⚠️ Failed to play notification sound:", err)
      );
    } catch (error) {
      console.warn("⚠️ Error playing audio:", error);
    }
  }

  async checkNow() {
    await this.fetchOrders();
  }

  // Method to manually trigger order fetching
  async refreshOrders() {
    console.log("🔄 Manually refreshing orders...");
    await this.fetchOrders();
  }
}

// Create a singleton instance
const orderPollingService = new OrderPollingService();

// Custom hook to integrate the service with a React component
export const useOrderFetcher = () => {
  // We use useRef to prevent the fetch from triggering on every render
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Set up a callback in the service to trigger a fetch when a new order is received
    const fetchOnNewOrder = () => {
      orderPollingService.fetchOrders();
    };
    orderPollingService.setNewOrderCallback(fetchOnNewOrder);

    // Initial fetch on component mount
    if (isInitialMount.current) {
      orderPollingService.fetchOrders();
      isInitialMount.current = false;
    }

    // Cleanup: Remove the callback when the component unmounts
    return () => {
      orderPollingService.setNewOrderCallback(null);
    };
  }, []);

  // Return refresh function for manual triggering
  return {
    refreshOrders: () => orderPollingService.refreshOrders(),
  };
};

export default orderPollingService;