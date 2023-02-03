import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <AnimatePresence initial={false}>
      <Routes key={location.pathname}>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : <Login />}
        />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
