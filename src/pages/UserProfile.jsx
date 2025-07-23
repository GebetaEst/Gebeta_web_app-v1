import { X } from "lucide-react";
import { useUserProfile } from "../contexts/UserProfileContext";
import ProfileEditForm from "../components/UserForms/M-MyProfilEditForm";
const UserProfile = () => {
  const { setUserProfile } = useUserProfile();
  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-black/50 z-50 flex items-center justify-center font-noto ">
      <div className="w-[55%] h-[70%] bg-white transition-all ease-out rounded-lg p-8 motion-scale-in-[0.5] motion-translate-x-in-[63%] motion-translate-y-in-[-54%] motion-opacity-in-[0%] motion-rotate-in-[6deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate">
        <div className="flex justify-between self-start items-center">
          <h1 className=" text-2xl font-bold">Profile</h1>
          <button
            className="text-white p-1 rounded-full border-gray hover:bg-red-50"
            onClick={() => {
              setUserProfile(false);
            }}
          >
            <X strokeWidth={2} size={30} color="red" />
          </button>
        </div>
        <div className="pb-5">
          <ProfileEditForm />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
