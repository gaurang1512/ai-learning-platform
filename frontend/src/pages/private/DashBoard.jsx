import api from "../../services/apiInterceptor";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AppData } from "../../context/AppContext";
import { User, Mail, Shield, Calendar, BookOpen, Clock } from "lucide-react";

const DashBoard = () => {
  const [content, setContent] = useState("");
  const { user } = AppData();

  async function fetchAdminData() {
    try {
      const endpoint =
        user?.role === "teacher"
          ? "/api/v1/teacher/dashboard"
          : "/api/v1/student/dashboard";
      const { data } = await api.get(endpoint, {
        withCredentials: true,
      });
      setContent(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch admin data",
      );
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, [user?.role]);

  return (
    <div className=" w-full bg-gradient from-blue-50 via-white to-indigo-50 px-4 py-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            User Dashboard
          </h1>
          <p className="text-gray-500 text-base font-medium leading-relaxed max-w-lg">
            Welcome back! Here is your profile information and learning summary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-white rounded-3xl shadow-lg shadow-blue-100/50 border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-200">
            <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 text-blue-600">
              <User size={48} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              {user?.name}
            </h2>
            <span
              className={`mt-3 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                user?.role === "teacher"
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              {user?.role}
            </span>
            <div className="flex flex-col gap-2 mt-6 w-full">
              <div className="flex items-center justify-center gap-2 text-gray-500 bg-gray-50 py-2.5 px-4 rounded-xl border border-gray-200">
                <Mail size={15} className="text-blue-500 shrink-0" />
                <span className="text-sm font-semibold truncate max-w-180px">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Info Details */}
          <div className="md:col-span-2 flex flex-col gap-5">
            {/* Account Details Card */}
            <div className="bg-white rounded-3xl shadow-lg shadow-blue-100/50 border border-gray-100 p-7 hover:shadow-xl transition-shadow duration-200 flex flex-col gap-5">
              <h3 className="text-lg font-extrabold flex items-center gap-2 text-gray-900 tracking-tight">
                <Shield size={20} className="text-blue-600" />
                Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    User ID
                  </p>
                  <p className="text-sm font-mono text-gray-700 font-bold truncate">
                    {user?._id || user?.id}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-700 font-bold flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Status Banner */}
            <div className="bg-blue-600 rounded-3xl shadow-lg shadow-blue-200 p-7 text-white relative overflow-hidden group">
              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-extrabold flex items-center gap-2 tracking-tight">
                    <BookOpen size={20} />
                    Learning Status
                  </h3>
                  <p className="text-blue-100 text-sm font-medium leading-relaxed">
                    {content || "Loading session information..."}
                  </p>
                </div>
                <Link
                  to="/app/my-paths"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm shadow-md w-fit"
                >
                  View My Learning Paths
                </Link>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Clock size={140} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
