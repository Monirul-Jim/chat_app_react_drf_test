import { Outlet } from "react-router-dom";
import Home from "./home/Home";

function App() {
  // const user = useAppSelector((state) => state.auth.user);
  // console.log(user);
  return (
    // <div className="h-screen flex">
    <div>
      <Outlet />
      <Home />
    </div>
  );
}

export default App;
