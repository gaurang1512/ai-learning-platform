import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-400 font-medium">
          &copy; 2024 IntelliPath AI. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
