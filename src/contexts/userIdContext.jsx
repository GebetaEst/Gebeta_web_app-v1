
import { createContext, useContext, useState } from "react";

const UserIdContext = createContext();

export const UserIdProvider = ({ children }) => {
  const [getId, setGetId] = useState("");
  const [refreshUsers, setRefreshUsers] = useState(false);

  return (
    <UserIdContext.Provider value={{ getId, setGetId , refreshUsers, setRefreshUsers}}>
      {children}
    </UserIdContext.Provider>
  );
};

export const useUserId = () => useContext(UserIdContext);
