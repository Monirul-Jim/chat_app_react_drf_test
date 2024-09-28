import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
// import { store } from "./redux/feature/store.ts";
import { persistor, store } from "./redux/feature/store.ts";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
      <ToastContainer />
    </Provider>
  </StrictMode>
);
