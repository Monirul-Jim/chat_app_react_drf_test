import { useState } from "react";
import { useLoginMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/feature/authSlice";
import { toast } from "react-toastify";
import verifyToken from "../redux/api/verifyToken";
import {
  useForm,
  FieldValues,
  SubmitHandler,
  FieldError,
} from "react-hook-form";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "mohosin@gmail.com",
      password: "123456789mo",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await login(data).unwrap();
      const user = verifyToken(response.access);
      dispatch(
        setUser({
          user: {
            ...user,
            username: response.username,
            email: response.email,
          },
          token: response.access,
        })
      );
      // console.log(response, "login");
      // dispatch(setUser({ user: user, token: response.access }));
      toast.success("User logged in successfully!");
    } catch (error: any) {
      console.log(error);

      toast.error("Login Failed");
    }
  };

  return (
    <div>
      <a href="/">Home</a>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {(errors.email as FieldError).message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {(errors.password as FieldError).message}
            </span>
          )}
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
    </div>
  );
};

export default LoginPage;
