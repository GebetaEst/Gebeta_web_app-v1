import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import motorcycleIconImg from "../../assets/images/motorcycle-192x192.png";
import verifiedIcon from "../../assets/images/blueCar.png";
import bicycleIcon from "../../assets/images/motorcycle-192x192.png";

import { io } from "socket.io-client";


// Default marker fix (Leaflet default icons)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Vehicle type icons (fixed sizing + correct URLs)
const createVehicleIcon = (url, size = 36) =>
  new L.Icon({
    iconUrl: url,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    shadowUrl: markerShadow,
    shadowSize: [40, 40],
  });

const carIcon = createVehicleIcon("https://cdn-icons-png.flaticon.com/512/744/744465.png", 38);
const bikeIcon = createVehicleIcon(bicycleIcon, 34);
const motorcycleIcon = createVehicleIcon(motorcycleIconImg, 36);
const verifiedDeliveryIcon = createVehicleIcon(verifiedIcon, 40);
const defaultDeliveryIcon = carIcon;

// Socket connection
const createSocketConnection = (token) => {
  const URL = "https://gebeta-delivery1.onrender.com";
  return io(URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
    timeout: 40000,
  });
};

const DeliveryGuys = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [mapCenter, setMapCenter] = useState([8.9900123, 38.7539948]); // Default center (Addis)
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = localStorage.getItem("token");

  // WebSocket connection for real-time delivery location updates
  useEffect(() => {
    const newSocket = createSocketConnection(token);
    setSocket(newSocket);

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("deliveryLocationUpdate", ({ userId, location }) => {
      setDeliveryPersons((prev) => {
        const existing = prev.find((p) => p.userId === userId);
        if (existing) {
          return prev.map((p) =>
            p.userId === userId ? { ...p, location, lastUpdate: Date.now() } : p
          );
        }
        return [...prev, { userId, location, lastUpdate: Date.now() }];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token]);


  const getDeliveryIcon = (method) => {
    const m = method?.toLowerCase();
    switch (m) {
      case "car":
        return carIcon;
      case "bike":
      case "bicycle":
        return bikeIcon;
      case "motor":
      case "motorcycle":
        return motorcycleIcon;
      case "walk":
      case "walking":
        return walkingIcon;
      case "verified":
        return verifiedDeliveryIcon;
      default:
        return defaultDeliveryIcon;
    }
  };

  // Prevents zoom reset every update
  const MapUpdater = () => {
    const map = useMap();
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
      if (deliveryPersons.length > 0 && !hasInitialized) {
        const bounds = L.latLngBounds([]);
        deliveryPersons.forEach((p, i) => {
          const coords = p.location?.latitude
            ? [parseFloat(p.location.latitude), parseFloat(p.location.longitude)]
            : getDemoCoordinates(i);
          bounds.extend(coords);
        });
        // map.fitBounds(bounds, { padding: [50, 50] });
        setHasInitialized(true);
      }
    }, [deliveryPersons, map, hasInitialized]);
    return null;
  };

  const filteredDeliveryPersons = deliveryPersons.filter((p) => {
    const userName = p.location?.userName || p.name || "";
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const downloadDeliveryHistory = (user) =>
    alert(`Downloading delivery history for ${user.location?.userName || "Unknown"}...`);

  return (
    <div className="h-[calc(100vh-65px)] w-full bg-[#f9f5f0] p-2 overflow-auto">
      <div className="mb-4 pl-10">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Delivery Personnel Map</h1>
        <p className="text-sm text-gray-600">View all delivery personnel on the map</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-150px)]">
        {/* MAP SECTION */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-white rounded-lg shadow-lg p-3 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Delivery Personnel Locations</h2>
            <div className="flex-1 rounded-lg overflow-hidden min-h-0">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {filteredDeliveryPersons.map((person, i) => {
                  const coords = person.location?.latitude
                    ? [parseFloat(person.location.latitude), parseFloat(person.location.longitude)]
                    : getDemoCoordinates(i);

                  return (
                    <Marker
                      key={person.userId || i}
                      position={coords}
                      icon={getDeliveryIcon(person.location?.userDeliveryMethod)}
                    >
                      <Popup>
                        <div className="min-w-[120px]">
                          <h3 className="font-semibold text-base mb-1">
                            {person.location?.userName || `Delivery ${i + 1}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            📞 {person.location?.userPhone || "No phone"}
                          </p>
                          <p className="text-sm text-blue-600">
                            🚗 {person.location?.userDeliveryMethod || "Unknown"}
                          </p>
                          {/* {person.lastUpdate && (
                            <p className="text-xs text-gray-500">
                              🕒 {new Date(person.lastUpdate).toLocaleTimeString()}
                            </p>
                          )} */}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                <MapUpdater />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-1 h-full">
          <div className="relative bg-white rounded-lg shadow-lg p-2 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Delivery Personnel List</h2>

            <input
              type="text"
              placeholder="Search by user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-3/4 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 m-2 text-sm"
            />

            <div className="flex-1 space-y-2 overflow-y-auto min-h-0 max-h-96">
              {filteredDeliveryPersons.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {searchTerm ? "No results found" : "No delivery personnel found"}
                </p>
              ) : (
                filteredDeliveryPersons.map((p, i) => {
                  const name = p.location?.userName || `Delivery ${i + 1}`;
                  const phone = p.location?.userPhone || "No phone";
                  const method = p.location?.userDeliveryMethod || "Unknown";
                  return (
                    <div key={p.userId || i} className="border rounded-lg p-2 hover:bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm truncate">{name}</h3>
                          <p className="text-xs text-gray-500 truncate">{phone}</p>
                          <p className="text-xs text-blue-600 truncate">{method}</p>
                          {p.lastUpdate && (
                            <p className="text-xs text-gray-400">
                              Last update: {new Date(p.lastUpdate).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => downloadDeliveryHistory(p)}
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition"
                        >
                          History
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-2 pt-2 border-t text-sm text-gray-600">
              Total: {filteredDeliveryPersons.length}
              {isConnected ? (
                <p className="text-xs text-green-600 mt-1">🟢 Real-time updates active</p>
              ) : (
                <p className="text-xs text-red-600 mt-1">🔴 Connection lost</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryGuys;
