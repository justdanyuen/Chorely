import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // Import your styles
import "./tokens.css";

// Ensure root element exists before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element with ID 'root' not found. Make sure it exists in index.html.");
}else {
    ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
}
