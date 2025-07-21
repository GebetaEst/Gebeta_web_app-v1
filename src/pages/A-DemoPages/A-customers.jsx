import { useEffect, useState } from "react";
import UseFetch from "../../services/get";

const ACustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [search, setSearch] = useState("");
//   const [managerId, setManagerId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("https://gebeta-delivery1.onrender.com/api/v1/restaurants", {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        });
        

        const data = await res.json();
        console.log(data)
        if (data.status === "success") {
          setCustomers(data.data.restaurants);
        //   data.data.restaurants.map((cust) => {
        //     setManagerId([...managerId, cust.managerId]);
        //   })
        } else {
          throw new Error("Failed to load restaurants");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    };


    

    fetchCustomers();
  }, []);
  
    
  

//   useEffect(()=>{
//     const fetchManager = async () => {
//       try {
//         const res = await fetch(`https://gebeta-delivery1.onrender.com/api/v1/users/${managerId}`, {
//           headers: {
//             Authorization:
//               `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
        
//         const data = await res.json();
//         // console.log(data)
//         if (data.status === "success") {
//           setManagerId(data.data.users);
//         } else {
//           throw new Error("Failed to load users");
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       }
//     };
//     fetchManager();
//   },[expandedCustomer])

  const filteredCustomers = Array.isArray(customers)
  ? customers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  : [];

  const toggleExpand = (id) => {
    setExpandedCustomer((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 min-h-screen bg-[#f4f1e9] font-sans">
      <h1 className="text-3xl font-bold text-[#4b382a] mb-4">Restaurants (Customers)</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search restaurants..."
        className="mb-4 p-2 w-full sm:w-1/2 border border-[#bfa66a] rounded-md"
      />

      {error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <table className="w-full bg-white rounded-md overflow-hidden shadow-md">
          <thead className="bg-[#e0cda9] text-[#4b382a]">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Restaurant Name</th>
              <th className="p-3 text-left">Cuisine</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust, index) => (
              <>
                <tr
                  key={cust._id}
                  className="border-b hover:bg-[#f9f4ea] cursor-pointer"
                  onClick={() => toggleExpand(cust._id)}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{cust.name}</td>
                  <td className="p-3">{cust.cuisineTypes?.join(", ")}</td>
                  <td className="p-3">{cust.location?.address}</td>
                  <td className="p-3">{cust.isOpenNow ? "Open" : "Closed"}</td>
                </tr>

                {expandedCustomer === cust._id && (
                  <tr className="bg-[#f6efe0] text-sm">
                    <td colSpan="5" className="p-4">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <p>
                          <span className="font-semibold">Description:</span> {cust.shortDescription}
                        </p>
                        <p>
                          <span className="font-semibold">Rating:</span> {cust.ratingAverage} ({cust.ratingQuantity} votes)
                        </p>
                        <p>
                          <span className="font-semibold">Delivery Radius:</span> {cust.deliveryRadiusMeters} meters
                        </p>
                        <p>
                          <span className="font-semibold">License:</span> {cust.license}
                        </p>
                        <p>
                          {/* <span className="font-semibold">Manager Name:</span> {manager.firstName} {manager.lastName} */}
                        </p>
                        <p>
                          <span className="font-semibold">Manager id:</span> {cust.managerId}
                        </p>
                        <p>
                          <span className="font-semibold">Open Hours:</span> {cust.openHours}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ACustomers;
