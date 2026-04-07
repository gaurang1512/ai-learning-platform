import Login from "./pages/public/Login";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VerifyOtp from "./pages/public/VerifyOtp";
import { AppData } from "./context/AppContext";
import Loading from "./Loading";
import RegisterLanding from "./pages/public/RegisterLanding";
import RegisterTeacher from "./pages/public/RegisterTeacher";
import RegisterStudent from "./pages/public/RegisterStudent";
import Verify from "./pages/public/Verify";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import AppLayout from "./AppLayout";
import DashBoard from "./pages/private/DashBoard";
import ProgressPage from "./pages/private/ProgressPage";
import QuizPage from "./pages/private/QuizPage";
// navigation pages
import Landing from "./pages/private/Landing";
import LearningPathGenerator from "./pages/private/LearningPathGenerator";
import MyLearningPathshs from "./pages/private/MyLearningPaths";
import MyLearningPaths from "./pages/private/MyLearningPaths";
import SingleLearningPath from "./pages/private/SingleLearningPath";
import TopicDetail from "./pages/private/TopicDetails";

const App = () => {
  const { isAuth, loading } = AppData();

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Entry redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/app" : "/login"} replace />}
        />

        {/* Auth routes */}
        <Route path="/login" element={isAuth ? <AppLayout /> : <Login />} />

        <Route
          path="/register"
          element={isAuth ? <AppLayout /> : <RegisterLanding />}
        />
        <Route
          path="/register/teacher"
          element={isAuth ? <AppLayout /> : <RegisterTeacher />}
        />
        <Route
          path="/register/student"
          element={isAuth ? <AppLayout /> : <RegisterStudent />}
        />

        <Route path="/token/:token" element={<Verify />} />
        <Route
          path="/verifyotp"
          element={isAuth ? <AppLayout /> : <VerifyOtp />}
        />
        <Route
          path="/forgot-password"
          element={isAuth ? <AppLayout /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={isAuth ? <AppLayout /> : <ResetPassword />}
        />

        {/* 🔥 MAIN NAVIGATION AREA */}
        <Route path="/app" element={isAuth ? <AppLayout /> : <Login />}>
          <Route index element={<Landing />} />
          <Route
            path="/app/learning-path"
            element={<LearningPathGenerator />}
          />
          <Route path="/app/my-paths" element={<MyLearningPaths />}></Route>
          <Route path="/app/my-paths" element={<MyLearningPathshs />} />
          <Route
            path="/app/my-learning-path/:id"
            element={<SingleLearningPath />}
          />
          <Route
            path="/app/generate/:learningPathId/:topicName"
            element={<TopicDetail />}
          />
          <Route
            path="/app/quiz/:learningPathId/:topicName"
            element={<QuizPage />}
          />
          <Route path="/app/dashboard" element={<DashBoard />} />
          <Route path="/app/progress" element={<ProgressPage />} />
        </Route>
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
