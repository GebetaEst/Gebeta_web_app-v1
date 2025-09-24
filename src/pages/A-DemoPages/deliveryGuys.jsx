import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import verifiedIcon from '../../assets/images/blueCar.png';

// Default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom delivery person icon (motor vehicle)
const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
  shadowUrl: markerShadow,
  shadowSize: [30, 30]
});

const verifiedDeliveryIcon = new L.Icon({
  iconUrl: verifiedIcon,
  iconSize: [33, 33],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
  shadowUrl: markerShadow,
  shadowSize: [30, 30]
});

// Fix leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DeliveryGuys = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMg, setErrorMg] = useState(null);
  const [refreshUsers, setRefreshUsers] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [mapCenter, setMapCenter] = useState([8.9394, 38.8204]); // Default center (Addis Ababa)
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMg(null);

    try {
      const response = await fetch(
        "https://gebeta-delivery1.onrender.com/api/v1/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setErrorMg(error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log(users)

  useEffect(() => {
    if (Array.isArray(data?.data?.users)) {
      const deliveryUsers = data.data.users.filter((user) => user.role === "Delivery_Person");
      setUsers(deliveryUsers);

      // Update map center to include all users (with real and demo coordinates)
      if (deliveryUsers.length > 0) {
        let totalLat = 0;
        let totalLng = 0;
        let coordCount = 0;

        deliveryUsers.forEach((user, index) => {
          if (user.location && user.location.latitude && user.location.longitude) {
            totalLat += parseFloat(user.location.latitude);
            totalLng += parseFloat(user.location.longitude);
            coordCount++;
          } else {
            const demoCoords = getDemoCoordinates(index);
            totalLat += demoCoords[0];
            totalLng += demoCoords[1];
            coordCount++;
          }
        });

        if (coordCount > 0) {
          setMapCenter([totalLat / coordCount, totalLng / coordCount]);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    fetchUsers();
  }, [refreshUsers, refetch]);

  // Generate demo coordinates for users without coordinates (for demonstration)
  const getDemoCoordinates = (index) => {
    const baseLat = 8.9394;
    const baseLng = 38.8204;
    const offset = index * 0.01; // Small offset for each user
    return [baseLat + offset, baseLng + offset];
  };

  // Map updater component to handle map updates
  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (users.length > 0) {
        // Include all users (with real and demo coordinates) for bounds
        const bounds = L.latLngBounds([]);
        users.forEach((user, index) => {
          if (user.location && user.location.latitude && user.location.longitude) {
            bounds.extend([parseFloat(user.location.latitude), parseFloat(user.location.longitude)]);
          } else {
            const demoCoords = getDemoCoordinates(index);
            bounds.extend(demoCoords);
          }
        });
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [users, map]);
    return null;
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const fullName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.name || user.username || '';
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const downloadDeliveryHistory = (user) => {
    alert(`Downloading delivery history for ${user.firstName || user.name || user.username}... (API call placeholder)`);
    // In a real application, you would call an API endpoint to fetch the history
    // For example: fetch(`/api/delivery-history/${user._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
  };


  return (
    <div className="h-[calc(100vh-65px)] w-full bg-[#f9f5f0] p-2 overflow-auto">
      
      <div className="mb-4 pl-10">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Delivery Personnel Map</h1>
        <p className="text-sm text-gray-600">View all delivery personnel locations on the map</p>
      </div>

      {loading && (
        <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded text-sm">
          Loading delivery personnel...
        </div>
      )}

      {errorMg && (
        <div className="mb-2 p-2 bg-red-50 text-red-800 rounded text-sm">
          Error: {errorMg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-150px)]">
        {/* Map Section */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-white rounded-lg shadow-lg p-3 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Delivery Personnel Locations</h2>
            <div className="flex-1 rounded-lg overflow-hidden min-h-0">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Display delivery users on map */}
                {filteredUsers.map((user, index) => {
                  let coords;
                  let isDemoLocation = false;

                  if (user.location && user.location.latitude && user.location.longitude) {
                    coords = [parseFloat(user.location.latitude), parseFloat(user.location.longitude)];
                  } else {
                    coords = getDemoCoordinates(index);
                    isDemoLocation = true;
                  }

                  return (
                    <Marker
                      key={user._id || user.id || index}
                      position={coords}
                      icon={user.isPhoneVerified ? verifiedDeliveryIcon : deliveryIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.username || `Delivery Person ${index + 1}`}</h3>
                          <p className="text-sm text-gray-600">{user.phone || 'No phone'}</p>
                          {user.isPhoneVerified ? (
                            <p className="text-xs text-green-600">Verified</p>
                          ) : (
                            <p className="text-xs text-red-600">Not verified</p>
                          )}
                          {isDemoLocation ? (
                            <p className="text-xs text-orange-600">Demo location</p>
                          ) : (
                            <p className="text-xs text-green-600">Real location</p>
                          )}
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

        {/* Users List Section */}
        <div className="lg:col-span-1 h-full">
          <div className="relative bg-white rounded-lg shadow-lg p-2 h- flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Delivery Personnel List</h2>
            <div className="  flex-1 space-y-2 overflow-y-auto min-h-0 max-h-96 mt-5">
              <input
                type="text"
                placeholder="Search delivery personnel by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-3/4 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 m-2 text-sm absolute top-8 left-0 "
              />
              {filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {searchTerm ? 'No delivery personnel found matching your search' : 'No delivery personnel found'}
                </p>
              ) : (
                filteredUsers.map((user, index) => (
                  <div key={user._id || user.id || index} className="border rounded-lg p-2 hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.firstName ? user.firstName.charAt(0).toUpperCase() :
                            user.name ? user.name.charAt(0).toUpperCase() :
                              user.username ? user.username.charAt(0).toUpperCase() :
                                'D'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.username || `Delivery Person ${index + 1}`}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{user.phone || 'No phone'}</p>
                        {/* <p className="text-xs text-blue-600">{user.role}</p> */}
                      </div>
                      <button
                        onClick={() => downloadDeliveryHistory(user)}
                        className="flex-shrink-0 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center space-x-1"
                        title="Download delivery history"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>History</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-2 pt-2 border-t flex-shrink-0">
              <p className="text-sm text-gray-600">
                Total: {filteredUsers.length} delivery personnel
                {searchTerm && ` (filtered from ${users.length})`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryGuys;
