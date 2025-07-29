import { UserRoundPen, Pencil, Trash } from "lucide-react";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useUserId } from "../../contexts/userIdContext";
import UseFetch from "../../services/get";
import Card from "../../components/Cards/Cards";
import {Loading , InlineLoadingDots} from "../../components/Loading/Loading";
import { Contact , X} from "lucide-react";
import EditUser from "../../components/UserForms/Edit-user";
import PopupCard from "../../components/Cards/PopupCard";
const ShowById = () => {
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [message , setMessage] = useState('Select a user');
  const { getId, setGetId } = useUserId();

  const { data, loading, errorMg } = UseFetch(
    `https://gebeta-delivery1.onrender.com/api/v1/users/${getId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  console.log(data);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return; // ❌ Cancel deletion if user selects "No"
  
    try {
      await fetch(`https://gebeta-delivery1.onrender.com/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

  
      setGetId('');
      setRefreshUsers((prev) => !prev);
      setMessage('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  

  return (
    <>
      <div className="w-[600px] h-[400px] flex items-center justify-center bg-white shadow-lg  rounded-xl border border-gray ">
        {loading ? (
          <Loading />
        ) : getId ?(
          <div className="space-x-28 flex justify-around items-center motion-scale-in-[0.72] motion-translate-x-in-[-22%] motion-translate-y-in-[-3%] ">
                <div className="flex flex-col self-start justify-self-start justify-center items-center gap-4 border-r h-[350px]  border-gray p-4">
                    <img
                        className={` ${data?.data?.user?.profilePicture ? "rounded-full shadow-lg w-[150px] h-[150px]" : "p-2 rounded-md border"}  m-2 `}
                        src={data?.data?.user?.profilePicture }
                        alt=" No profile picture"
                    />
                    <h2 className="text-lg font-semibold text-primary">
                        {data?.data?.user?.firstName} {data?.data?.user?.lastName}
                    </h2>
                </div>

            <div className="flex flex-col  ">
                <div className="flex flex-col gap-4 -translate-x-10">
                    <p className="text-gray-600 font-semibold"> Email: <span className="text- font-normal">{data?.data?.user?.email}</span></p>
                    <p className="text-gray-600 font-semibold"> Phone: <span className="text- font-normal">{data?.data?.user?.phone}</span></p>
                    <p className="text-gray-600 font-semibold"> Role: <span className="text- font-normal">{data?.data?.user?.role}</span></p>
                    <p className="text-gray-600 font-semibold"> Created At: <span className="text-primary font-normal">{formatDate(data?.data?.user?.createdAt)}</span></p>
                    <p className="text-gray-600 font-semibold"> ID: <span className="text- font-normal">{data?.data?.user?._id}</span></p>
                </div>
                <div className="flex gap-3 self-end pr-5 translate-y-20">
                    <button className=" bg-blue-200 rounded-full w-[40px] h-[40px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300" onClick={() =>setShowEditForm(true)}>
                        <Pencil strokeWidth={1} size={20} />
                    </button>
                    <button className=" bg-red-200 rounded-full w-[40px] h-[40px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300" onClick={() => deleteUser(getId)}>
                        <Trash strokeWidth={1} size={20} />
                    </button>
                </div>
            </div>
          </div>
        ) : <div>
            <p>{message}</p>
            </div>}
      </div>
      {showEditForm ? (
        <PopupCard>
            <div className=" space-x-2 flex justify-end">
                <button className=" hover:bg-red-100 rounded-full w-[40px] h-[40px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300" onClick={() => setShowEditForm(false)}>
                    <X strokeWidth={1.5} size={30} color="red"/>
                </button>
                
            </div>
          <EditUser /> 
        </PopupCard>) : null}
    </>
  );
};

export default ShowById;
