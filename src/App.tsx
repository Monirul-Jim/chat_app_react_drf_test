import { Outlet } from "react-router-dom";
import Home from "./home/Home";

function App() {
  return (
    <div>
      <Outlet />
      <Home />
    </div>
  );
}

export default App;
