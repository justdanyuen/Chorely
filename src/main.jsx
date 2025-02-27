import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // Import your styles
import "./tokens.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
