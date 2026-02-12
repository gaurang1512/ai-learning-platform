import React, { useRef } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
function Sidebar() {
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const subMenuRef = useRef(null); // Add a ref for the submenu
  const toggleSubBtnRef = useRef(null);

  function toggleSideBar() {
    if (sidebarRef.current && toggleBtnRef.current) {
      sidebarRef.current.classList.toggle("close");
      toggleBtnRef.current.classList.toggle("rotate");
      // When closing sidebar, also close submenu if open
      if (sidebarRef.current.classList.contains("close")) {
        if (
          subMenuRef.current &&
          subMenuRef.current.classList.contains("show")
        ) {
          subMenuRef.current.classList.remove("show");
          toggleSubBtnRef.current.classList.toggle("rotate");
        }
      }
    }
  }

  function toogleSubMenu(e) {
    const next = e.currentTarget.nextElementSibling;
    if (next) {
      next.classList.toggle("show");
    }
    if (sidebarRef.current.classList.contains("close")) {
      sidebarRef.current.classList.toggle("close");
      toggleSubBtnRef.current.classList.toggle("rotate");
    }
  }

  return (
    <nav className="Sidebar" ref={sidebarRef} id="Sidebar">
      <ul>
        {/* LOGO + TOGGLE */}
        <li>
          <span className="logo">Logo</span>

          <button onClick={toggleSideBar} id="toggle-btn" ref={toggleBtnRef}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="m313-480 155 156q11 11 11.5 27.5T468-268q-11 11-28 11t-28-11L228-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T468-692q11 11 11 28t-11 28L313-480Z" />
            </svg>
          </button>
        </li>

        {/* LANDING / HOME */}
        <li>
          <div className="sidebarbuttons" aria-label="Home page">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Z" />
            </svg>

            <span>
              <NavLink to="/app" end>
                Landing
              </NavLink>
            </span>
          </div>
        </li>

        {/* LEARNING PATH */}
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640Z" />
          </svg>

          <span>
            <NavLink to="/app/learning-path" end>
              Learning Path{" "}
            </NavLink>
          </span>
        </li>
        {/*ALL LEARNING PATH */}
        <li>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640Z" />
          </svg>

          <span>
            <NavLink to="/app/my-paths" end>
              My Learning Path{" "}
            </NavLink>
          </span>
        </li>
      </ul>
    </nav>
  );
}
export default Sidebar;
