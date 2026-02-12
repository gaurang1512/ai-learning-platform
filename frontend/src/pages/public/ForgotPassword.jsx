import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../services/apiInterceptor";
import "../../index.css";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/v1/forgot-password`, {
        email,
      });
      toast.success(data.message);
      localStorage.setItem("email", email);
      navigate("/verifyotp");
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred",
      );
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            Forgot Your Password?
          </h1>
          <p className="leading-relaxed mt-4">
            Enter your email address below and we will send you a One Time
            Password (OTP) to reset your password.
          </p>
        </div>
        <form
          className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
          onSubmit={submitHandler}
        >
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Forgot Password
          </h2>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            disabled={btnLoading}
          >
            {btnLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
