import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Pinch-Zoom verhindern
document.addEventListener(
  "gesturestart",
  (e) => e.preventDefault(),
  { passive: false }
);

document.addEventListener(
  "gesturechange",
  (e) => e.preventDefault(),
  { passive: false }
);

document.addEventListener(
  "gestureend",
  (e) => e.preventDefault(),
  { passive: false }
);

// Zwei-Finger-Zoom verhindern
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Doppeltippen zum Zoomen verhindern
let lastTouchEnd = 0;

document.addEventListener(
  "touchend",
  (e) => {
    const now = Date.now();

    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }

    lastTouchEnd = now;
  },
  { passive: false }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);