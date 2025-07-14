import { useState } from "react";
import EmployeeList from "./EmployList";
import UserList from "./UsersList";
import ManagerList from "./ManagersList";
import Card from "../../components/Cards/Cards";
import { Pencil, Trash, Contact, UserRoundPen, Plus, X } from "lucide-react";
import AddUserForm from "../../components/UserForms/AddUserForm";
import PopupCard from "../../components/Cards/PopupCard";
const AllList = () => {
  const demoManagerList = [
    {
      name: "Manager 1",
      email: "manager1@gmail.com",
      phone: "1234567890",
      address: "123 Street, Addis Ababa, Ethiopia",
      branch: "Bole Branch",
      role: "General Manager",
      dateOfBirth: "1985-05-20",
      gender: "Male",
      hiredDate: "2022-01-10",
      salary: "$1500",
    },
    {
      name: "Manager 2",
      email: "manager2@gmail.com",
      phone: "0987654321",
      address: "456 Road, Bahir Dar, Ethiopia",
      branch: "Bahir Dar Branch",
      role: "Operations Manager",
      dateOfBirth: "1990-03-14",
      gender: "Female",
      hiredDate: "2021-11-03",
      salary: "$1400",
    },
    {
      name: "Manager 3",
      email: "manager3@gmail.com",
      phone: "1112223333",
      address: "789 Avenue, Mekelle, Ethiopia",
      branch: "Mekelle Branch",
      role: "Delivery Manager",
      dateOfBirth: "1988-08-10",
      gender: "Male",
      hiredDate: "2021-05-15",
      salary: "$1300",
    },
    {
      name: "Manager 4",
      email: "manager4@gmail.com",
      phone: "5556667777",
      address: "102 Street, Hawassa, Ethiopia",
      branch: "Hawassa Branch",
      role: "Assistant Manager",
      dateOfBirth: "1992-12-01",
      gender: "Female",
      hiredDate: "2023-02-20",
      salary: "$1100",
    },
    {
      name: "Manager 5",
      email: "manager5@gmail.com",
      phone: "4445556666",
      address: "56 Road, Dire Dawa, Ethiopia",
      branch: "Dire Dawa Branch",
      role: "Shift Supervisor",
      dateOfBirth: "1995-09-30",
      gender: "Male",
      hiredDate: "2023-06-12",
      salary: "$1050",
    },
    {
      name: "Manager 6",
      email: "manager6@gmail.com",
      phone: "9998887777",
      address: "90 Street, Jimma, Ethiopia",
      branch: "Jimma Branch",
      role: "Inventory Manager",
      dateOfBirth: "1991-01-18",
      gender: "Female",
      hiredDate: "2022-08-01",
      salary: "$1200",
    },
  ];

  const [show, setShow] = useState(0);
  const [list, setList] = useState("Managers");
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <div className="p-8 flex gap-2 items-center justify-center  h-[85vh]  font-noto">
        <Card>
          <div className="w-[450px] ">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">{list}</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center text-xs border rounded-xl px-1 border-blue-200 hover:scale-105 transition-all duration-300 active:scale-95 active:rotate-3 bg-blue-50"
              >
                <span className="rounded-full mr-1 w-[20px] h-[20px] flex items-center justify-center bg-blue-100">
                  <Plus strokeWidth={1} />
                </span>
                add {list}
              </button>
            </div>
            <div className="flex justify-between mt-4 mb-6">
              <div className="flex flex-wrap gap-3">
                <button
                  className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary border border-gray ${
                    list === "Managers" ? "translate-y-2" : ""
                  } transition-all duration-300`}
                  onClick={() => setList("Managers")}
                >
                  Managers
                </button>
                <button
                  className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary border border-gray ${
                    list === "Users" ? "translate-y-2" : ""
                  } transition-all duration-300`}
                  onClick={() => setList("Users")}
                >
                  Users
                </button>
                <button
                  className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary border border-gray ${
                    list === "Employee" ? "translate-y-2" : ""
                  } transition-all duration-300`}
                  onClick={() => setList("Employee")}
                >
                  Employees
                </button>
                <button
                  className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary border border-gray ${
                    list === "Demonstration" ? "translate-y-2" : ""
                  } transition-all duration-300`}
                  onClick={() => setList("Demonstration")}
                >
                  Demo
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2 max-h-[430px] overflow-y-auto scrollbar-hide pt-2">
              {list === "Managers" ? (
                <ManagerList />
              ) : list === "Users" ? (
                <UserList />
              ) : list === "Employee" ? (
                <EmployeeList />
              ) : list === "Demonstration" ? (
                demoManagerList.map((manager, index) => (
                  <div
                    className="border border-gray shadow rounded-lg p-3 flex justify-between items-center space-y-4 hover:shadow-inner hover:-translate-y-1 transition-all duration-300"
                    key={index}
                    onClick={() => setShow(index)}
                  >
                    <div className="text-center">
                      <div className=" flex self-center justify-self-center ">
                        <div className="p-2 rounded-full bg-primary flex items-center justify-center justify-self-center">
                          <Contact strokeWidth={1.5} size={30} color="white" />
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold">{manager.name}</h2>
                      <p className="text-xs "> {manager.role}</p>
                      <p className="text-xs"> {manager.branch}</p>
                    </div>
                    <p className="text-xs flex flex-col items-center">
                      Enrolled on
                      <span className="text-placeholderText text-[10px] ">
                        {manager.hiredDate}
                      </span>
                    </p>
                    <div className="flex gap-3">
                      <button className=" bg-blue-200 rounded-full w-[30px] h-[30px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300">
                        <Pencil strokeWidth={1} size={20} />
                      </button>
                      <button className=" bg-red-200 rounded-full w-[30px] h-[30px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300">
                        <Trash strokeWidth={1} size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div>
        </Card>
        <div className="w-[60%] h-[400px] flex self-center justify-center rounded-lg border border-gray bg-cardBackground">
          {demoManagerList.map((item, index) => (
            <div key={index} className="motion-preset-blur-right ">
              {show === index ? (
                <div className="grid grid-cols-2 motion-preset-slide-right  ">
                  <div className="p-2 flex flex-col  items-center m-5 h-full">
                    <div className="p-2 rounded-2xl bg-placeholderText flex items-center justify-center justify-self-center m-5">
                      <UserRoundPen
                        strokeWidth={1.5}
                        size={200}
                        color="white"
                      />
                    </div>
                    <h2 className="text-xl font-semibold">Name: {item.name}</h2>
                  </div>
                  <div className="p-2 items-start mt-7 m-5">
                    <h1 className="text-xl  font-semibold ">
                      Personal Information
                    </h1>
                    <div className="p-2 flex flex-col text-xs items-start border-b border-gray">
                      <p>
                        <span className="font-semibold text-sm">Role:</span>{" "}
                        {item.role}
                      </p>
                      <p>
                        <span className="font-semibold text-sm">Branch:</span>{" "}
                        {item.branch}
                      </p>
                      <p>
                        <span className="font-semibold text-sm">
                          Hired Date:
                        </span>{" "}
                        {item.hiredDate}
                      </p>
                      <p>
                        <span className="font-semibold text-sm">Salary:</span>{" "}
                        {item.salary}
                      </p>
                    </div>
                    <div className="p-2 flex flex-col text-xs items-start border-b border-gray">
                      <p>
                        <span className="font-semibold text-sm">Email:</span>{" "}
                        {item.email}
                      </p>
                      <p>
                        <span className="font-semibold text-sm">Phone:</span>{" "}
                        {item.phone}
                      </p>
                      <p>
                        <span className="font-semibold text-sm">Address:</span>{" "}
                        {item.address}
                      </p>
                    </div>

                    <div className="p-2 flex flex-col text-xs items-start ">
                      <p>
                        <span className="font-semibold text-sm">
                          Date of Birth:
                        </span>{" "}
                        {item.dateOfBirth}
                      </p>
                      <p>
                        <span className="font-semibold text-sm">Gender:</span>{" "}
                        {item.gender}
                      </p>
                    </div>

                    <div className="flex gap-10 justify-end ">
                      <button className=" bg-blue-200 rounded-full w-[40px] h-[40px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300">
                        <Pencil strokeWidth={1} size={30} />
                      </button>
                      <button className=" bg-red-200 rounded-full w-[40px] h-[40px] flex items-center justify-center hover:translate-y-1 transition-transform hover:shadow-lg duration-300">
                        <Trash strokeWidth={1} size={30} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
      {showAdd && (
        <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-black/50 z-50 flex items-center justify-center font-noto ">
          <div className="w-[30%] h-[65%] bg-white transition-all ease-out rounded-lg p-8 motion-scale-in-[0.13] motion-translate-x-in-[-36%] motion-translate-y-in-[-10%] motion-opacity-in-[0%] motion-rotate-in-[7deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate">
            <div className="flex justify-between border-b pb-2 border-gray">
              <h1 className="text-xl font-semibold">Add {list}</h1>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-full hover:bg-red-50 "
              >
                <X strokeWidth={2} size={30} color="red" />
              </button>
            </div>
            <div className="p-2">
              <AddUserForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllList;
