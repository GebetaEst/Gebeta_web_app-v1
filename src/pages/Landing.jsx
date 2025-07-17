import { Link } from "react-router-dom";
import { ArrowDownToDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[url('/src/assets/images/landing.jpg')] bg-cover bg-center h-screen font-noto transform-all duration-1000 ease-out overflow-x-hidden">
        <div className="flex justify-between items-center px-14 py-8 pr-28">
          <div className="  p-3 font-bold rounded-lg w-fit text-4xl  text-white motion-scale-in-[0.66] motion-translate-x-in-[-200%] motion-translate-y-in-[-4%] motion-rotate-in-[-63deg] border">
            <h1 className="w-fit">
            Gbeታ
            </h1>
          </div>
          <div className="flex gap-14 h-fit">
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-white text-black font-semibold p-2 hover:bg-black hover:text-white transform duration-200 rounded-lg w-[100px] border-gray shadow-inner "
            >
              Login
            </button>
            {/* <button
              onClick={() => {
                navigate("/signup");
              }}
              className="bg-black text-white font-semibold p-2 hover:bg-white hover:text-black transform duration-200 rounded-lg w-[100px]  "
            >
              Signup
            </button> */}
          </div>
        </div>
        <div className="flex justify-start items-center h-[50%] motion-scale-in-[0.77] motion-translate-x-in-[30%] motion-translate-y-in-[0%] motion-rotate-in-[15deg] motion-duration-1500">
          <h1 className="text-8xl font-bold text-white ml-16 mx-6 w-fit">
            Craving? <br />
            Tap. Eat. Repeat.
          </h1>
        </div>
        <div className="flex flex-col items-start justify-center pl-28 text-white font-bold">
          <div>
            <p className="text-lg font-semibold ">
              Looking For Trending Restaurants?
            </p>
            <div className="flex gap-4 ">
              <input
                className="p-2 rounded-lg border border-gray"
                type="location"
                placeholder="Restaurants Name"
              />
              <button className="bg-primary text-white font-semibold p-2 hover:bg-white hover:text-black transform duration-200 rounded-lg w-[100px] border-gray shadow-inner ">
                Search!
              </button>
            </div>
          </div>
        </div>

        <Link>
          <ArrowDownToDot
            color="white"
            size={70}
            className="flex self-center justify-self-center motion-preset-oscillate motion-duration-1000"
          />
        </Link>
      </div>
    </>
  );
};

export default Landing;
