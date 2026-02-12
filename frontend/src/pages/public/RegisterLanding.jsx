import { Link } from "react-router-dom";

const RegisterLanding = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Register as a Teacher</h2>
          <p className="text-sm text-gray-600 mb-4">
            Create courses, manage students, and access teacher-only tools.
          </p>
          <Link
            to="/register/teacher"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            title="Teacher accounts can publish content and manage classrooms"
          >
            Continue
          </Link>
        </div>
        <div className="rounded-lg border p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Register as a Student</h2>
          <p className="text-sm text-gray-600 mb-4">
            Join classes, track progress, and access student resources.
          </p>
          <Link
            to="/register/student"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            title="Student accounts enroll in classes and view assignments"
          >
            Continue
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterLanding;

