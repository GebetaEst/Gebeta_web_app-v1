import { useEffect, useState } from "react";
// import axios from "axios";
import Card from "../../components/Cards/Cards";
import UseHttp from "../../services/UseHttp";
import {Loading , InlineLoadingDots} from "../../components/Loading/Loading";
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const { get, loading, error } = UseHttp();

  //   const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      const data = await get("/users" , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (data) {
        setEmployees(data.filter(emp => emp.role === "employee"));
      }
    };
    fetchManagers();
  }, []);

  return (
    <div className="max-w-[500px]  p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {error && <p className="text-red-500">{error}</p>}
      {employees.length > 0
        ? employees.map((emp) => (
            <Card key={emp.id}>
              <h2 className="text-xl font-semibold">{emp.name}</h2>
              <p>Email: {emp.email}</p>
              <p>Phone: {emp.phone}</p>
            </Card>
          ))
        : loading && <Loading/>}

    </div>
  );
};

export default EmployeeList;
