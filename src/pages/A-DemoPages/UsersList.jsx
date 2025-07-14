import { useState, useEffect } from "react";
import UseFetch from "../../services/get";
import Card from "../../components/Cards/Cards";
import Loading from "../../components/Loading/Loading";
import { Pencil, Trash } from "lucide-react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { data, loading, errorMg } = UseFetch(
    "https://gebeta-delivery1.onrender.com/api/v1/users",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  useEffect(() => {
    if (Array.isArray(data?.data?.users)) {
      setUsers(data.data.users);
    }
  }, [data]);

  // 🧠 Helper function to format date as DD-MM-YYYY
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="">
      {errorMg && <p className="text-red-500">{errorMg}</p>}
      {loading ? (
        <Loading />
      ) : (
        users.map((user) => (
          <div className=" hover:-translate-y-1 transition-all duration-300 hover:shadow-inner">
          <Card key={user._id}>
            <div className="flex  items-center justify-between space-x-2 min-w-[400px] ">
              <div className="flex flex-col self-start items-center w-[150px]">
                <img
                  className={`${
                    user.profilePicture ? "" : "bg-gray"
                  } w-[70px] h-[70px] flex justify-center items-center shadow-lg rounded-full`}
                  src={user.profilePicture}
                  alt=""
                />
                <h2 className="text-md font-semibold text-center">
                  {user.firstName || "Unnamed"} {user.lastName || "Unnamed"}
                </h2>
                <p className="text-[10px]">{user.phone || "N/A"}</p>
                <p className=" text-[10px]">{user.email || "N/A"}</p>
              </div>
                <p className="text-xs"><span className="font-semibold text-[10px]">Enrolled on</span> <br/> {formatDate(user.createdAt)}</p>
              <div className="flex flex-col text-xs text-center gap-2">
                {/* <p><span className="font-semibold text-[10px]">Email</span> <br/>{user.email || "N/A"}</p>
                <p><span className="font-semibold text-[10px]">Phone</span><br/>{user.phone || "N/A"}</p> */}
                <div className="flex gap-4 justify-end pr-5">
                      <button className=" bg-blue-200 rounded-full w-[26px] h-[26px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300">
                        <Pencil strokeWidth={1} size={18} />
                      </button>
                      <button className=" bg-red-200 rounded-full w-[26px] h-[26px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300">
                        <Trash strokeWidth={1} size={18} />
                      </button>
                    </div> 
              </div>
            </div>
            <div>
            
            </div>
          </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default UsersList;
