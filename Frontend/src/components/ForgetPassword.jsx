import React, { useContext, useRef, useState } from "react";
import Loader from "./Loader";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../store/context";

export default function ForgetPassword() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const { forgetPassword } = useContext(UserContext);
  const navigate = useNavigate();

  const { requestId } = useParams();
  const [toggle, setToggle] = useState(!!requestId); // Initialize toggle as a boolean

  const forgetPasswordFun = async (email, password) => {
    const obj = {
      email: email,
      password: password,
      requestId: requestId || null,
    };
    // console.log("Obj ", obj);
    await forgetPassword(obj);
    setLoader(false);

    navigate("/");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value || null;
    let password = null;

    if (toggle) {
      password = passwordRef.current.value || null;
    } else {
      alert("Password reset link sent to your email, check ASAP");
    }

    setLoader(true);
    await forgetPasswordFun(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl from-orange-300 to-lime-900 p-4">
      <div className="bg-white bg-opacity-10 shadow-2xl rounded-3xl p-8 w-full max-w-md mx-auto">
        <form onSubmit={submitHandler}>
          <p className="font-black font-serif text-2xl text-center mb-6">
            Password Reset
          </p>

          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1 hover:font-serif hover:text-lg"
          >
            Email
          </label>
          <input
            className="w-full mb-5 p-2.5 border rounded-md shadow-[inset_-12px_-8px_40px_#46464620] focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            id="email"
            required
            ref={emailRef}
          />

          {toggle && (
            <>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 hover:font-serif hover:text-lg"
              >
                Password
              </label>
              <input
                className="w-full mb-6 p-2.5 border rounded-md shadow-[inset_-12px_-8px_40px_#46464620] focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="password"
                required
                ref={passwordRef}
              />
              <button
                disabled={loader}
                type="submit"
                className={`w-full py-2.5 text-white bg-blue-700 rounded-full shadow-lg transition duration-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                  loader ? "cursor-not-allowed" : ""
                }`}
              >
                Reset Password
              </button>
            </>
          )}

          {!toggle && (
            <button
              disabled={loader}
              type="submit"
              className={`w-full py-2.5 text-white bg-blue-700 rounded-full shadow-lg transition duration-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                loader ? "cursor-not-allowed" : ""
              }`}
            >
              Send Reset Password Link
            </button>
          )}

          {loader && <Loader />}
        </form>
      </div>
    </div>
  );
}
