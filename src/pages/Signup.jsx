import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../apiCalls/UserApis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_id:"",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    company_id:"",
    role: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      company_id:"",
      role: "",
    };

    // name validation
    if (!formData.name.trim()) {
      newErrors.name = "name is required";
      valid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "name must be at least 3 characters";
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

    // conpany validation
    if (!formData.company_id.trim()) {
      newErrors.company_id = "company_id is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          company_code: formData.company_id,
          role: formData.role,
        };

        const response = await registerUser(userData);
        console.log(response);
        
        if (response.error) {
          // Show error toast
          toast.error(response.error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        else if(response.user){
          toast.success('Registration successful!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => navigate('/login')
          });
        } else {
          // Show success toast
          toast.error('Failed to Register', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // Optionally redirect after successful registration
          // navigate('/login');
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.message || "Registration failed. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
     <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
            <label htmlFor="name" className="font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full py-2 px-4 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg mt-1`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mb-3">{errors.name}</p>
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

          <div className="mb-4 form-field-appear">
            <label htmlFor="company_id" className="font-medium">
              Company Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company_id"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              placeholder="company_id code"
              className={`w-full py-2 px-4 border ${
                errors.company_id ? "border-red-500" : "border-gray-300"
              } rounded-lg mt-1`}
            />
            {errors.company_id && (
              <p className="text-red-500 text-sm mb-3">{errors.company_id}</p>
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
              <option value="tester">Tester</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
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

          {/* <button
            type="submit"
            className="form-field-appear w-full bg-[#01a370] hover:bg-[#018a60] text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Create Account
          </button> */}
          <button
  type="submit"
  disabled={isSubmitting}
  className={`form-field-appear w-full bg-[#01a370] hover:bg-[#018a60] text-white py-3 rounded-lg font-medium transition duration-200 ${
    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {isSubmitting ? "Creating Account..." : "Create Account"}
</button>

{submitError && (
  <p className="text-red-500 text-sm mt-3 text-center">{submitError}</p>
)}
        </form>
      </div>
    </div>
  );
};

export default Signup;
