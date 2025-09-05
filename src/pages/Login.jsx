import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validateRequired } from "../utils/validators";
import { AuthAPI } from "../api/index";
import FormInput from "../common/FormInput";
import ToastNotification from "../common/ToastNotification";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validateRequired(formData.password, "Password"),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await AuthAPI.loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        toast.error(response.error);
      } else if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        localStorage.setItem('company_id', response.user.company_id);
        toast.success('Login successful!', {
          onClose: () => navigate('/dashboard')
        });
      } else {
        toast.error('Failed to login');
      }
    } catch (error) {
      console.error("Login error:", error);;
      toast.error(error.error_type || "Login failed");
      setSubmitError(error.error_message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastNotification />
      
      <div className="max-w-md mx-auto w-full bg-white overflow-hidden p-6 rounded-lg">
        <div className="mb-6 text-center">
          <h1 className="font-bebasNeue tracking-wider text-3xl font-bold text-gray-800">
            Welcome back
          </h1>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <FormInput
            type="email"
            label="Email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johndoe@email.com"
            error={errors.email}
            required
          />

          <FormInput
            type={showPassword ? "text" : "password"}
            label="Password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="•••••••"
            error={errors.password}
            required
            icon={
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="text-gray-500" /> : <Eye className="text-gray-500" />}
              </button>
            }
          />

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
            disabled={isSubmitting}
            className={`w-full bg-[#01a370] hover:bg-[#018a60] text-white py-3 rounded-lg font-medium transition duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          {submitError && (
            <p className="text-red-500 text-sm mt-3 text-center">{submitError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;