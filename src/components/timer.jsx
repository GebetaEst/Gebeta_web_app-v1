import { useState, useEffect } from "react";

const TimerToggle = () => {
  const [status, setStatus] = useState("CLOSED");

  // Safely parse sessionStorage
  const storedData = sessionStorage.getItem("user-data");
  let data = null;
  try {
    data = storedData ? JSON.parse(storedData) : null;
  } catch (err) {
    console.error("Invalid JSON in sessionStorage", err);
  }

  const role = data?.state?.user?.role;
  const restaurantId = data?.state?.restaurant?._id;
  const input = data?.state?.restaurant?.openHours || null;

  // Default values in case input is missing
  let openingDate = null;
  let closingDate = null;

  if (input) {
    const [openingTime, closingTime] = input.split(" - ");

    function parseTime(timeStr) {
      const today = new Date();
      return new Date(`${today.toDateString()} ${timeStr}`);
    }

    openingDate = parseTime(openingTime);
    closingDate = parseTime(closingTime);
  }

  function isShopOpen(openingDate, closingDate) {
    if (!openingDate || !closingDate) return false;
    const now = new Date();
    if (closingDate < openingDate) {
      return now >= openingDate || now <= closingDate; // overnight
    }
    return now >= openingDate && now <= closingDate;
  }

  // Update status every second
  useEffect(() => {
    if (!openingDate || !closingDate) return;

    function updateDisplay() {
      const shopStatus = isShopOpen(openingDate, closingDate)
        ? "OPEN"
        : "CLOSED";
      setStatus(shopStatus);
    }

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);
    return () => clearInterval(interval);
  }, [openingDate, closingDate]);

  // Update backend whenever status changes
  useEffect(() => {
    if (!restaurantId) return;

    async function updateOpeningStatus() {
      try {
        const res = await fetch(
          `https://gebeta-delivery1.onrender.com/api/v1/restaurants/${restaurantId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              isOpenNow: status === "OPEN",
            }),
          }
        );

        if (!res.ok) {
          console.error("Failed to update restaurant status");
        } else {
          console.log("Restaurant status updated:", status);
        }
      } catch (error) {
        console.error("Error updating restaurant status:", error);
      }
    }

    updateOpeningStatus();
  }, [status, restaurantId]);

  // Render conditions AFTER hooks
  if (role === "Manager" && !input) {
    return <p className="text-xs">Please set opening hours</p>;
  }

  if (!input) {
    return <p className="text-xs">No opening hours available</p>;
  }

  return (
    <p
      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
        status === "OPEN" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
      }`}
    >
      {status}
    </p>
  );
};

export default TimerToggle;
