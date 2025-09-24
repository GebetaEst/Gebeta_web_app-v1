import { useState, useEffect } from "react";
import UseFetch from "../../services/get";
import Card from "../../components/Cards/Cards";
import { Loading , InlineLoadingDots} from "../../components/Loading/Loading";
import { Pencil, Trash, Search, RefreshCcw } from "lucide-react";
import ShowById from "./showById";
import { useUserId } from "../../contexts/userIdContext";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { getId, setGetId, refreshUsers } = useUserId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMg, setErrorMg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refetch, setRefetch] = useState(false);

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

  useEffect(() => {
    if (Array.isArray(data?.data?.users)) {
      setUsers(data.data.users);
    }
  }, [data]);

  useEffect(() => {
    fetchUsers();
  }, [refreshUsers, refetch]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const userId = user._id ? user._id.toLowerCase() : '';
    return fullName.includes(searchTerm.toLowerCase()) || userId.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="">
      <input
        type="text"
        placeholder={`Search by name...`}
        style={{ backgroundImage: 'url("https://img.icons8.com/ios/24/000000/search--v1.png")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" border px-2 py-1 mb-4 rounded-lg  shadow-sm w- max-w-md sticky top-0 z-50"
      />
      <button
              className="bg-[#e0cda9] p-2 rounded transition-all duration-500 mx-6  sticky top-0 z-40"
              onClick={() => {
                setRefetch(!refetch);
              }}
            >
              <span
                className={` flex justify-center items-center  ${
                  loading && "animate-spin transition duration-1500"
                }`}
              >
                <RefreshCcw size={24} color="#4b382a" />
              </span>
            </button>
            

      {errorMg && <p className="text-red-500">{errorMg}</p>}
      {loading ? (
        <Loading />
      ) : (
        filteredUsers?.map((user) => (
          <div
            key={user._id}
            className="  transition-all duration-300"
            onClick={() => {
              setGetId(user._id);
            }}
          >
            <div className=" w-fit p-4 bg-white border  rounded-lg font-noto m-2 shadow-lg hover:bg-gray-50 ">
              <div className="flex items-center justify-between min-w-[400px] px-5 pl-2">
                  
                  <div className="flex justify-center items-center ">

                    <img
                      className={`mx- ${
                        user.profilePicture ? "" : "bg-gray"
                      } w-[70px] h-[70px] flex justify-center items-center shadow-lg rounded-full`}
                      src={user.profilePicture}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col w-[150px]">
                    <h2 className="text-md font-semibold ">
                      {user.firstName || "Unnamed"} {user.lastName || "Unnamed"}
                    </h2>
                    <p className="text-[10px] pl-1">{user.phone || "N/A"}</p>
                    <p className="text-[10px] pl-1">{user.email || "N/A"}</p>

                  </div>
                <div className="flex flex-col items-start justify-end ">
                <p className="text-xs">
                  <span className="font-semibold text-[10px]">Enrolled on</span>{" "}
                  <br /> {formatDate(user.createdAt)}
                </p>
                <p className={`text-[12px] font- mt-3 ${user.role === "Admin" ? "bg-red-100" : user.role === "Customer" ? "bg-blue-100" : user.role === "Manager" ? "bg-green-100" : "bg-yellow-100"} rounded-full px-2 py-1 flex justify-center items-center`}>{user.role === "Delivery_Person" ? "Delivery" : `${user.role}`}</p>
                  </div>

                
              </div>
            </div>
          </div>
        ))
      )}
      
    </div>
  );
};

export default UsersList;
