import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../user/LoginPage";
import RegistrationPage from "../user/RegistrationPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegistrationPage />,
  },
]);
export default router;
