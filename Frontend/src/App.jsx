import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./store/context";
import Navbar from "./components/Navbar";
import SignupPage from "./components/SignupPage";
import { useContext } from "react";
import ForgetPassword from "./components/ForgetPassword";

function App() {
  const { login } = useContext(UserContext);
  return (
    <BrowserRouter>
      <Routes>
        {login ? (
          <>
            <Route path="/" element={<Navigate to="/userExpense" />} />
            <Route path="/userExpense" element={<Navbar />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SignupPage />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/forgetPassword/:requestId" element={<ForgetPassword />} />

          </>
        )}
        <Route path="*" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
