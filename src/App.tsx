import { Outlet } from "react-router-dom";
import Home from "./home/Home";
// import { useAppSelector } from "./redux/feature/hooks";

function App() {
  // const user = useAppSelector((state) => state.auth.user);
  // console.log(user, "this is user");
  return (
    // <div className="h-screen flex">
    <div>
      <Outlet />
      <Home />
    </div>
  );
}

export default App;
