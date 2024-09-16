import { useState } from "react";
import { useLoginMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/feature/authSlice";

import verifyToken from "../redux/api/verifyToken";
const LoginPage = () => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for the field being edited
    setErrors({
      ...errors,
      [e.target.name]: [],
    });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await login(formData).unwrap();
  //     console.log(response);
  //     alert("User logged in successfully");
  //     if (response.token) {
  //       localStorage.setItem("authToken", response.token);
  //     }
  //   } catch (error: any) {
  //     console.error("Login error:", error);
  //     if (error.data) {
  //       setErrors(error.data);
  //     } else {
  //       alert("Login failed");
  //     }
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();

      const user = verifyToken(response.access);
      // Dispatch user information to the Redux store
      dispatch(setUser({ user: user, token: response.access }));

      alert("User logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.data) {
        setErrors(error.data);
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} // Toggle showPassword state
            className="form-checkbox"
          />
          <span className="ml-2 text-sm">Show Password</span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
      >
        Login
      </button>
    </form>
  );
};

export default LoginPage;
