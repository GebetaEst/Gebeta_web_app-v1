import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {NavigationProvider} from "./contexts/NavigationContext";
import {UserProfileProvider} from "./contexts/UserProfileContext";
import { UserIdProvider } from "./contexts/userIdContext"; 
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NavigationProvider>
      <UserProfileProvider>
        <UserIdProvider>
        <App />
        </UserIdProvider>
      </UserProfileProvider>
    </NavigationProvider>
  </StrictMode>
);
