import Home from "../public/Home";
import "../../App.css";

const Landing = () => {
  return (
    <main className="home-container">
      <Home></Home>
      <h2>Home Page</h2>
      <div className="home-content">
        <p>
          This application is created withoght react router and is a simple
          example of how to structure a React application without using routing.
        </p>

        <p>
          It demonstrates how to create a basic layout with a header, main
          content area and footer, while keeping the code organized and
          maintainable.
        </p>
      </div>
    </main>
  );
};
function tp() {
  return <h1>This is home page</h1>;
}
export default Landing;
