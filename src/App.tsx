import { Outlet } from "react-router-dom";
import Home from "./home/Home";

function App() {
  return (
    // <div className="h-screen flex">
    <div>
      <Outlet />
      <Home />
    </div>
  );
}

export default App;
