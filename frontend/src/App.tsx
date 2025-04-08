import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useAuthContex } from "./context/AuthContext";

function App() {
  const { authUser, setAuthUser, isLoading } = useAuthContex;

  if(isLoading) return null // optimize for a skeleton maybe

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/"
          element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
