
import { createContext, useContext, useState } from "react";

const UserIdContext = createContext();

export const UserIdProvider = ({ children }) => {
  const [getId, setGetId] = useState("");

  return (
    <UserIdContext.Provider value={{ getId, setGetId }}>
      {children}
    </UserIdContext.Provider>
  );
};

export const useUserId = () => useContext(UserIdContext);
