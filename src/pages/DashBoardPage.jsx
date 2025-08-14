import Chart from "../components/Chart/Chart";
import { useEffect , useState } from "react";
import InfoCards from "./M-DemoPages/InfoCards";
import RecentOrdersTB from "./M-DemoPages/RecentOrdersTB";
import useUserStore  from "../Store/UseStore";


const DashBoardPage = () => {

  const { setRestaurant } = useUserStore();
  const [resData , setResData] = useState([]);

  useEffect(() => {
    const demoId = "687f8356ba35b7d99e36f647"
    const fetchRestaurants = async () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user-data"))?.state?.user;
    const role = storedUser.role;
    // console.log(role)
      try {
        // ${storedUser._id}
        const res = await fetch(
          `https://gebeta-delivery1.onrender.com/api/v1/restaurants/by-manager/${demoId}`,
          {
            headers: {
              // Using a placeholder token for demonstration as localStorage is not ideal in some environments
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        const data = await res.json();
        if (res.ok && data.status === "success") {
          // console.log(data.data.restaurants[0])
          setResData(data.data.restaurants || []);
          setRestaurant(data.data.restaurants[0]); 
        } else {
          throw new Error(data.message || "Failed to load restaurants.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    // if(role === "Manager"){
    //   fetchRestaurants();
    // }
    setRestaurant(resData);
    // console.log(resData)

    fetchRestaurants();
  } ,[]);
  return (
    <>
      <div className="w-[100%] h-fit pb-[15px] p-2 pl-12 flex flex-col justify-center bg-[#f4f1e9]">
        <InfoCards />
        <div className="flex justify-around items-center mt-2 bg-[#f4f1e9]">
          <Chart />
          <RecentOrdersTB />
        </div>
      </div>
    </>
  );
};

export default DashBoardPage;
