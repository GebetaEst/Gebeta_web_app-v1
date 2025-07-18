import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UseStore from "../../Store/UseStore";
import {Loading , InlineLoadingDots} from "../Loading/Loading";
const LoginForm = () => {
  
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMg, setErrorMg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const {setUser } = UseStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!phone || !password) {
      setErrorMg("All fields are required");
      return;
    }else{
      setErrorMg(""); // Clear previous errors

    }
    
    
    try {
      setLoading(true);
      const res = await fetch(
        "https://gebeta-delivery1.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, password }), 
        }
      );
      console.log(res)
      const data = await res.json();
      
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
        setUser(data.data.user); 
      
      localStorage.setItem("token", data.token);
      // navigate("/adminDashboard");
      // console.log(data.data.user._id)

      console.log(data)
      if(data.data.user.role === "Manager"){
        navigate("/managerDashboard");
      }else if(data.data.user.role === "Admin"){
        navigate("/adminDashboard");
      }
      
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMg("Something went wrong. Please try again. try again later");
    }finally{
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-cardBackground p-8 rounded-lg shadow-lg w-[370px] flex flex-col justify-self-center items-center mt-[20px] border border-gray font-noto"
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <p className="text-[13px] text-gray-500 text-center">Welcome back!</p>
      
      <div className="w-full space-y-1">
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => {
            const sanitizedPhone =
            e.target.value.startsWith("0")
              ? e.target.value.slice(1)
              : e.target.value;
            setPhone(sanitizedPhone)}}
          placeholder="912345678"
          required
          className="bg-white border-[0.5px] border-gray p-2 rounded-md w-full text-black"
        />
      </div>

      <div className="w-full space-y-1">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="bg-white border-[0.5px] border-gray p-2 rounded-md w-full text-black"
        />
      </div>
      
      <Link
        to="/forgot-password"
        className="flex -translate-x-5 -translate-y-3 self-end hover:underline hover:text-black text-[13px] text-gray-500"
      >
        Forgot Password?
      </Link>

      {errorMg && <p className="text-red-500 text-sm">{errorMg}</p>}

      <button
        type="submit"
        className={`bg-white flex items-center justify-center transform duration-200 text-gray-800 font-bold py-2 px-4 rounded-md w-[100px] hover:bg-black hover:text-white border-[0.5px] border-gray ${loading ? "cursor-not-allowed opacity-50 hover:bg-white" : ""}`}
      >
        {loading ? <InlineLoadingDots/> : "Log In"}
      </button>
      {/* {loading && <Loading/>} */}
      
      <p className="text-[13px] text-gray-800 flex self-end">
        {/* Don't have an account? &nbsp;
        <Link
          to="/signup"
          className="underline font-semibold hover:font-bold"
        >
          Sign Up
        </Link> */}
      </p>
    </form>
  );
};

export default LoginForm;