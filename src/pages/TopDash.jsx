import { useNavigation } from "../contexts/NavigationContext";
import { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import { useUserProfile } from "../contexts/UserProfileContext";
import ProtectedRoute from "../components/ProtectedRoute";

const TopDash = () => {
  const { activeNav, setActiveNav } = useNavigation();
  const [Title, setTitle] = useState(null);
  const [showScreen, setShowScreen] = useState(false);
  const { userProfile , setUserProfile } = useUserProfile();
  useEffect(() => {
    setTitle(activeNav);
  }, [activeNav]);

  const storedUser = JSON.parse(sessionStorage.getItem("user-data")).state.user;
  // console.log(storedUser.role);
  return (
    <>
      <div className="pl-12 flex items-center justify-between bg-white h-[70px] w-[100%] px-28">
        <p className="text-3xl font-bold ">{Title}</p>
        <div
          onClick={() => {
            setShowScreen(true);
            setUserProfile(true);
          }}
          className="flex items-center gap-2 motion-preset-slide-left motion-duration-1500  cursor-pointer hover:shadow-lg p-2 rounded-full transition-all duration-300 hover:scale-105 active:-rotate-3"
        >
          <div className="p-5 w-[50px] h-[50px] flex items-center justify-center font-semibold text-white text-lg rounded-full bg-[#e02960] ">
        U
          </div>
          <p className="text-lg font-semibold">User Name</p>
        </div>
        <ProtectedRoute allowedRoles={["Manager"]}></ProtectedRoute>
      </div>
      {userProfile && storedUser?.role === "Manager" && <UserProfile />}


    </>
  );
};

export default TopDash;
