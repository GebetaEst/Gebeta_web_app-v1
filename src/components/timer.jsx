import { useState, useEffect, useRef } from "react";

const TimerToggle = () => {
  const [status, setStatus] = useState("CLOSED");
  const lastStatusRef = useRef(null);
  const didMountRef = useRef(false); // track if component has already mounted

  // Parse sessionStorage
  const storedData = sessionStorage?.getItem("user-data");
  let data = null;
  try {
    data = storedData ? JSON.parse(storedData) : null;
  } catch (err) {
    console.error("Invalid JSON in sessionStorage", err);
  }

  const role = data?.state?.user?.role;
  const restaurantId = data?.state?.restaurant?._id;
  const input = data?.state?.restaurant?.openHours || null;

  // Parse "hh:mm AM - hh:mm PM" into Date objects
  function parseTimeToDate(timeStr) {
    const now = new Date();
    const [time, period] = timeStr.trim().split(/\s+/);
    let [hours, minutes] = time.split(":").map(Number);
    if (!minutes) minutes = 0;

    if (period.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    } else if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    const d = new Date(now);
    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  function isShopOpen(openHours) {
    if (!openHours) return false;

    const [openStr, closeStr] = openHours.split(" - ");
    const openTime = parseTimeToDate(openStr);
    let closeTime = parseTimeToDate(closeStr);

    const now = new Date();

    // Handle overnight (e.g. 8PM - 2AM)
    if (closeTime <= openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }

    return now >= openTime && now <= closeTime;
  }

  // Update status every 2 minutes
  useEffect(() => {
    if (!input) return;

    function updateDisplay() {
      const shopStatus = isShopOpen(input) ? "OPEN" : "CLOSED";
      setStatus(shopStatus);
    }

    updateDisplay();
    const interval = setInterval(updateDisplay, 120000);
    return () => clearInterval(interval);
  }, [input]);

  // Update backend only after initial status check
  // useEffect(() => {
  //   if (!restaurantId || !input) return;

  //   // skip the first render (before status is settled)
  //   if (!didMountRef.current) {
  //     didMountRef.current = true;
  //     return;
  //   }

  //   if (lastStatusRef.current === status) return; // no duplicate calls
  //   lastStatusRef.current = status;

  //   async function updateOpeningStatus() {
  //     try {
  //       const res = await fetch(
  //         `https://gebeta-delivery1.onrender.com/api/v1/restaurants/${restaurantId}`,
  //         {
  //           method: "PATCH",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //           body: JSON.stringify({
  //             isOpenNow: status === "OPEN",
  //           }),
  //         }
  //       );

  //       if (!res.ok) {
  //         console.error("Failed to update restaurant status");
  //       } else {
  //         console.log("Restaurant status updated:", status);
  //       }
  //     } catch (error) {
  //       console.error("Error updating restaurant status:", error);
  //     }
  //   }

  //   updateOpeningStatus();
  // }, [status, restaurantId, input]);

  // Render
  if (role === "Manager" && !input) {
    return <p className="text-xs">Please set opening hours</p>;
  }

  if (!input) {
    return <p className="text-xs">No opening hours available</p>;
  }

  return (
    <p
      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
        status === "OPEN"
          ? "bg-green-200 text-green-800"
          : "bg-red-200 text-red-800"
      }`}
    >
      {status}
    </p>
  );
};

export default TimerToggle;
