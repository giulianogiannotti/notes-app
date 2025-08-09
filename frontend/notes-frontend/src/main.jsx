import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-clunti7tla45mb7q.us.auth0.com"
      clientId="lJaIo2V2G3hbtA59EKFgBzCv477Ers03"
      authorizationParams={{
        audience: "https://note.com",
        scope: "read:notes write:notes",
      }}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
