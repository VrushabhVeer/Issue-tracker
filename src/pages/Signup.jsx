import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullname: "",
      email: "",
      password: "",
      role: "",
    };

    // Fullname validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Fullname is required";
      valid = false;
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = "Fullname must be at least 3 characters";
      valid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
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
      console.log("formdata---------", formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto w-full bg-white overflow-hidden p-6 rounded-lg">
        <div className="mb-6 text-center">
          <h1 className="font-bebasNeue tracking-wider text-3xl font-bold text-gray-800">
            Create your account
          </h1>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 form-field-appear">
            <label htmlFor="fullname" className="font-medium">
              Fullname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full py-2 px-4 border ${
                errors.fullname ? "border-red-500" : "border-gray-300"
              } rounded-lg mt-1`}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mb-3">{errors.fullname}</p>
            )}
          </div>

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
              className={`w-full py-2 px-4 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg mt-1`}
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

          <div className="mb-3 form-field-appear">
            <label htmlFor="role" className="font-medium">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full py-2 px-4 border ${
                errors.role ? "border-red-500" : "border-gray-300"
              } rounded-lg mb-1`}
            >
              <option value="">Select Role</option>
              <option value="developer">Developer</option>
              <option value="organization">Organization</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mb-3">{errors.role}</p>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-6">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="text-blue-600 font-medium hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-blue-600 font-medium hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <button
            type="submit"
            className="form-field-appear w-full bg-[#01a370] hover:bg-[#018a60] text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
