import { useNavigation } from "../contexts/NavigationContext";
import { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import { useUserProfile } from "../contexts/UserProfileContext";
import bellSound from '../assets/N-Bell.mp3';
import ProtectedRoute from "../components/ProtectedRoute";
import { Bell } from 'lucide-react';
const TopDash = () => {
  const { activeNav, setActiveNav } = useNavigation();
  const [Title, setTitle] = useState(null);
  const { userProfile , setUserProfile } = useUserProfile();
  useEffect(() => {
    setTitle(activeNav);
  }, [activeNav]);

  const storedUser = JSON.parse(sessionStorage.getItem("user-data")).state.user;
  // console.log(storedUser.role);
  return (
    <>
      <div className="pl-12 flex items-center justify-between bg-[#e0cda9] h-[70px] w-[100%] px-28 border-b-2 border-[#e0cd99]">
        <p className="text-3xl font-bold ">{Title}</p>
        <div className="flex items-center gap-6 pt-1 justify-center">
          <div>
            <button
              className="rounded-lg p-3 hover:bg-yellow-50 border"
              onClick={() => {
                const audio = new Audio(bellSound);
                audio.play();
              }}
            >
              <Bell/>
            </button>
          </div>
          <div
            onClick={() => {
              setUserProfile(true);
            }}
            className="flex hover:border items-center gap-2 motion-preset-slide-left motion-duration-1500  cursor-pointer hover:shadow-lg p-1 rounded-full transition-all duration-300 hover:scale-105 active:-rotate-3"
          >
            <div className="p-5 w-[50px] h-[50px] flex items-center justify-center font-semibold text-white text-lg rounded-full bg-[#e02960] ">
          <p>{storedUser?.firstName[0]}</p>
            </div>
            <p className="text-lg font-semibold">{storedUser?.firstName}</p>
          </div>
        </div>
      </div>
      {userProfile  && <UserProfile />}
{/* && storedUser?.role === "Manager"  */}
    </>
  );
};

export default TopDash;
