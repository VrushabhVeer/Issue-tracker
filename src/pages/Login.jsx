import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("formadtata---", formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto w-full bg-white overflow-hidden p-6 rounded-lg">
        <div className="mb-6 text-center">
          <h1 className="font-bebasNeue tracking-wider text-3xl font-bold text-gray-800">
            Welcome back
          </h1>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 form-field-appear">
            <label htmlFor="email" className="font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@email.com"
              className={`w-full py-2 px-4 border mt-1 ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg mb-1`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-3">{errors.email}</p>
            )}
          </div>

          <div className="mb-4 form-field-appear relative">
            <label htmlFor="password" className="font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="• • • • • • •"
                className={`w-full py-2 px-4 pr-10 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg mt-1`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-500" />
                ) : (
                  <Eye className="text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mb-3">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="form-field-appear w-full bg-[#01a370] hover:bg-[#018a60] text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
