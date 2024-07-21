import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { UserContext } from "../store/context";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { login, setLogin,setPremiumUser } = useContext(UserContext);
  const [loginStatus, setLoginStatus] = useState(false);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const navigate = useNavigate();

  const loginHandler = (data) => {
    
    // console.log("Data in login handler ",data);
    setLogin(true);
    localStorage.setItem("userToken", `${data.token}`);
    localStorage.setItem("premium",`${data.premium}`);
    setPremiumUser(data.premium)
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current?.value || "";

    if (!loginStatus && password !== confirmPassword) {
      console.log("Please enter the correct password in both input boxes");
      return;
    }

    try {
      const endpoint = loginStatus
        ? `http://localhost:3002/user/login`
        : `http://localhost:3002/user/signup`;
      // console.log("Inside the try catch block ");
      const response = await axios.post(endpoint, { name, email, password });
      console.log('Response in signup page',response);
      loginHandler(response.data); 
      navigate("/userExpense");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      navigate("/");
    }
  };

  const switchAuthModeHandler = () => {
    setLoginStatus((prevState) => !prevState);
    // console.log("Login status inside switch:", loginStatus);
  };
  // console.log("Login status now outside switch", loginStatus);

  return (
    <div className="bg-gradient-to-tl from-amber-200 to-indigo-700 min-h-screen flex items-center justify-center p-8">
      <div className="bg-white bg-opacity-10 shadow-2xl rounded-3xl p-7 w-full max-w-md">
        <form onSubmit={submitHandler}>
          <p className="font-black font-serif text-2xl mb-4">
            {loginStatus ? "Login to your account" : "Create your account"}
          </p>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-lg font-medium">
              Email
            </label>
            <input
              className="bg-slate-200 rounded-md w-full h-9 p-2"
              type="email"
              id="email"
              required
              ref={emailRef}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-lg font-medium">
              Name
            </label>
            <input
              className="bg-slate-200 rounded-md w-full h-9 p-2"
              type="text"
              id="name"
              required
              ref={nameRef}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-medium"
            >
              Password
            </label>
            <input
              className="bg-slate-200 rounded-md w-full h-9 p-2"
              type="password"
              id="password"
              required
              ref={passwordRef}
            />
          </div>
          {!loginStatus && (
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-lg font-medium"
              >
                Confirm Password
              </label>
              <input
                className="bg-slate-200 rounded-md w-full h-9 p-2"
                type="password"
                id="confirmPassword"
                required
                ref={confirmPasswordRef}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-medium text-sm px-5 py-2.5 mb-4"
          >
            {loginStatus ? "Login" : "Create my account"}
          </button>
          {loginStatus && (
            <a
              className="block text-center text-blue-800 hover:text-amber-200 mb-4"
              href="/forgetPassword"
            >
              Forget Password
            </a>
          )}
          <div className="flex items-center justify-between py-5">
            <hr className="w-full bg-gray-400" />
            <p className="text-base font-medium leading-4 px-2.5 text-gray-400">
              OR
            </p>
            <hr className="w-full bg-gray-400" />
          </div>
          {loginStatus ? (
            <p className="text-center">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchAuthModeHandler()}
                className="text-blue-700 underline"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p className="text-center">
              Login with an existing account{" "}
              <button
                type="button"
                onClick={() => switchAuthModeHandler()}
                className="text-blue-700 underline"
              >
                Login
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
