import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/apiInterceptor";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus("Invalid verification link.");
        toast.error("Invalid verification link.");
        return;
      }

      try {
        const { data } = await api.get(`/api/v1/verify-email/${token}`);
        setVerificationStatus(data.message || "Verification successful!");
        toast.success(data.message || "Account verified successfully!");
        navigate("/login");
      } catch (error) {
        setVerificationStatus(
          error.response?.data?.message || "Verification failed.",
        );
        toast.error(
          error.response?.data?.message || "Failed to verify account.",
        );
        navigate("/register");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500 opacity-5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-5 w-full max-w-sm text-center">

        {/* Spinning loader icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-400 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Account Verification</h1>
        <p className="text-slate-400 text-sm leading-relaxed">{verificationStatus}</p>
      </div>
    </div>
  );
};

export default Verify;