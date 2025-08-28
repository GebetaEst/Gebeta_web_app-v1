import axios from 'axios';
import useUserStore from '../Store/UseStore';
import bellSound from '../assets/N-Bell.mp3';

class OrderPollingService {
  constructor() {
    this.interval = null;
    this.isRunning = false;
    this.baseURL = "https://gebeta-delivery1.onrender.com/api/v1/orders/restaurant";
    this.lastFetchTime = 0;
    this.minFetchInterval = 3000; // Minimum 3 seconds between requests
  }

  getAPI_URL() {
    const store = JSON.parse(sessionStorage.getItem("user-data"));
    const restaurantId = store?.state?.restaurant?._id;
    
    if (!restaurantId) {
      return null;
    }
    
    return `${this.baseURL}/${restaurantId}/orders`;
  }

  startPolling() {
    if (this.isRunning) return;
    
    // Check if we have a valid API URL before starting
    if (!this.getAPI_URL()) {
      return;
    }
    
    this.isRunning = true;
    
    // Initial fetch
    this.fetchOrders();
    
    // Start polling every 10 seconds (increased from 5 to reduce load)
    this.interval = setInterval(() => {
      this.fetchOrders();
    }, 10000);
  }

  stopPolling() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
  }

  async fetchOrders() {
    // Throttle requests to prevent excessive API calls
    const now = Date.now();
    if (now - this.lastFetchTime < this.minFetchInterval) {
      return;
    }
    this.lastFetchTime = now;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        this.stopPolling();
        return;
      }

      const apiURL = this.getAPI_URL();
      if (!apiURL) {
        return;
      }

      const res = await axios.get(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = res.data.data;
      
      if (orders && orders.length > 0) {
        const sorted = this.sortOrders(orders);
        const latestFetchedId = sorted[0]?.orderId;
        
        // Get current state from store
        const store = useUserStore.getState();
        const currentLatestId = store.latestOrderId;

        if (latestFetchedId && latestFetchedId !== currentLatestId) {
          // New order detected!
          store.setNewOrderAlert(true);
          store.setLatestOrderId(latestFetchedId);
          
          // Add notification to store - ensure addNotification exists
          if (typeof store.addNotification === 'function') {
            store.addNotification({
              id: Date.now().toString(),
              type: 'info',
              title: 'New Order Received',
              message: `Order #${sorted[0]?.orderCode || latestFetchedId} has been placed`,
              timestamp: Date.now(),
            });
          }

          // Play sound
          this.playNotificationSound();
          
          // Auto-hide alert after 5 seconds
          setTimeout(() => {
            const currentStore = useUserStore.getState();
            if (currentStore.setNewOrderAlert) {
              currentStore.setNewOrderAlert(false);
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error('OrderPollingService error:', error);
      
      // Add error notification - ensure addNotification exists
      const store = useUserStore.getState();
      if (typeof store.addNotification === 'function') {
        store.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to fetch orders. Please check your connection.',
          timestamp: Date.now(),
        });
      }
    }
  }

  sortOrders(ordersToSort) {
    const statusPriority = {
      pending: 1,
      preparing: 2,
      cooked: 3,
      delivering: 5,
    };

    return [...ordersToSort].sort((a, b) => {
      const statusA = a.orderStatus?.toLowerCase() || "";
      const statusB = b.orderStatus?.toLowerCase() || "";
      const priorityA = statusPriority[statusA] || 99;
      const priorityB = statusPriority[statusB] || 99;
      return priorityA - priorityB;
    });
  }

  playNotificationSound() {
    try {
      const audio = new Audio(bellSound);
      audio.volume = 0.5; // Set volume to 50%
      
      // Request audio permission if needed
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Notification sound played successfully');
          })
          .catch(error => {
            console.warn('Failed to play notification sound:', error);
          });
      }
    } catch (error) {
      console.warn('Error creating or playing audio:', error);
    }
  }

  // Method to manually check for new orders
  async checkNow() {
    await this.fetchOrders();
  }
}

// Create singleton instance
const orderPollingService = new OrderPollingService();

export default orderPollingService;
