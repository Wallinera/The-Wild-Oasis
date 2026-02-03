import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./globals.css";
import App from "./App.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ui/ErrorFallback.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      onReset={() => window.location.replace("/")}
      FallbackComponent={ErrorFallBack}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
