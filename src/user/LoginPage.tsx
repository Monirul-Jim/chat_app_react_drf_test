// import { useState } from "react";
// import { useLoginMutation } from "../redux/api/authApi";
// import { useDispatch } from "react-redux";
// import { setUser } from "../redux/feature/authSlice";

// import verifyToken from "../redux/api/verifyToken";
// const LoginPage = () => {
//   const dispatch = useDispatch();
//   const [login] = useLoginMutation();
//   // const [formData, setFormData] = useState({ email: "", password: "" });
//   const [formData, setFormData] = useState({
//     email: "mohosin@gmail.com",
//     password: "123456789mo",
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     // Clear error for the field being edited
//     setErrors({
//       ...errors,
//       [e.target.name]: [],
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await login(formData).unwrap();

//       const user = verifyToken(response.access);
//       dispatch(setUser({ user: user, token: response.access }));
//       console.log(response);
//       alert("User logged in successfully");
//     } catch (error: any) {
//       console.error("Login error:", error);
//       if (error.data) {
//         setErrors(error.data);
//       } else {
//         alert("Login failed");
//       }
//     }
//   };

//   return (
//     <div>
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium text-gray-600">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium text-gray-600">
//             Password
//           </label>
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="inline-flex items-center">
//             <input
//               type="checkbox"
//               checked={showPassword}
//               onChange={() => setShowPassword(!showPassword)}
//               className="form-checkbox"
//             />
//             <span className="ml-2 text-sm">Show Password</span>
//           </label>
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
//         >
//           Login
//         </button>
//       </form>
//       <a href="/">Home</a>
//     </div>
//   );
// };

// export default LoginPage;

import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthProvider/AuthContext";

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "mohosin@gmail.com",
    password: "123456789mo",
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/user/login/", {
        // Note the trailing slash
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures the refresh token is set in cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Set access token in localStorage
        console.log("User logged in successfully", data);
        setUser({
          username: data.username,
          email: data.email,
        });
        localStorage.setItem("accessToken", data.access);
        toast.success("User logged in successfully!");
      } else {
        // Handle API errors (e.g., wrong email/password)
        setErrors({ form: [data.error || "Invalid login credentials."] });
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error during login:", error);
      setErrors({ form: ["An unexpected error occurred. Please try again."] });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Display form-level errors */}
        {errors.form && (
          <div className="text-red-500 text-sm mb-4">
            {errors.form.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

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
              onChange={() => setShowPassword(!showPassword)}
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
      <a href="/">Home</a>
    </div>
  );
};

export default LoginPage;
