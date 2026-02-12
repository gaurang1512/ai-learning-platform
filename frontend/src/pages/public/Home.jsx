import { Link, useNavigate } from "react-router-dom";
import { AppData } from "../../context/AppContext";

function Home() {
  const { logoutUser, isAuth } = AppData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto mt-40">
      Home Page
      <h1>Welcome to the Home Page</h1>
      <button
        className="w-20 bg-red-500 text-white p-2 rounded-md"
        onClick={handleLogout}
      >
        Logout
      </button>
      {isAuth && (
        <Link
          to="/dashboard"
          className="w-20 bg-purple-500 text-white p-2 rounded-md"
        >
          Dashboard
        </Link>
      )}
    </div>
  );
}

export default Home;
