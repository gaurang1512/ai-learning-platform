import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/apiInterceptor";
import { AppData } from "../../context/AppContext";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const navigate = useNavigate();

  const { setIsAuth, setUser, refetchUser } = AppData();

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await api.post(`/api/v1/verify-reset-otp`, {
        email: localStorage.getItem("email"),
        otp,
      });

      toast.success(data.message);
      localStorage.removeItem("email");
      navigate("/reset-password", { state: { resetToken: data.resetToken } });
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred",
      );
    } finally {
      setBtnLoading(false);
    }
  };

  function resendOtp() {
    setBtnLoading(true);
  }

  return (
    <section
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500 opacity-5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Header above card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 mb-4">
            <svg
              className="w-7 h-7 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Verify OTP
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={submitHandler} className="space-y-5">
            <h2 className="text-lg font-semibold text-white">
              Verify using OTP
            </h2>

            {/* OTP input */}
            <div className="space-y-1.5">
              <label
                htmlFor="otp"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-widest"
              >
                OTP
              </label>
              <input
                type="number"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Submit button */}
            <button
              disabled={btnLoading}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl px-4 py-3 text-sm transition-all duration-200 shadow-lg shadow-amber-400/20 active:scale-[0.98]"
            >
              {btnLoading ? "Submitting..." : "Submit"}
            </button>

            {/* Go to login */}
            <Link
              to="/login"
              className="block text-center text-sm text-slate-500 hover:text-amber-400 transition-colors duration-150"
            >
              Go to Login page
            </Link>

            {/* Resend OTP */}
            <button
              disabled={btnLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-xl px-4 py-3 text-sm border border-slate-700 transition-all duration-200 active:scale-[0.98]"
            >
              {btnLoading ? "Resending..." : "Resend OTP"}
            </button>
          </form>
        </div>

        {/* Spam note */}
        <p className="text-center text-slate-600 text-xs mt-5">
          Didn't receive the code? Check your spam folder.
        </p>
      </div>
    </section>
  );
}

export default VerifyOtp;
