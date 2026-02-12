import api from "../../services/apiInterceptor";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AppData } from "../../context/AppContext";

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
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {content && <div className="bg-green-100 p-4 rounded">{content}</div>}
      <Link to="/" className="mt-4 text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
};

export default DashBoard;
