import Light from "../icons/sun.png"; // adjust the path as needed
import dark from "../icons/moon.png"; // adjust the path as needed
import "../App.css";
function Header() {
  const icon = document.getElementById("icon");
  function toggleColor() {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
      icon.src = { dark };
    } else {
      icon.src = { Light };
    }
  }
  return (
    <header className="header">
      <h1>Header</h1>
      <button>
        <img src={dark} alt="darklight" onClick={toggleColor} />
      </button>
    </header>
  );
}
export default Header;
