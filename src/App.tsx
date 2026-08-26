import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Pivot from "./pages/Pivot";

function App() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#09090b",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pivot" element={<Pivot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;