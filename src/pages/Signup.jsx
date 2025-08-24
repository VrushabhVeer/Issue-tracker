import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateRequired } from "../utils/validators";
import { AuthAPI } from "../api/index";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import ToastNotification from "../common/ToastNotification";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_id: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    company_id: "",
    role: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: validateRequired(formData.name, "Name"),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      company_id: validateRequired(formData.company_id, "Company code"),
      role: validateRequired(formData.role, "Role"),
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
      const response = await AuthAPI.registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company_code: formData.company_id,
        role: formData.role,
      });
      console.log(response);
      if (response.error) {
        toast.error(response.error);
      } else if (response.user) {
        toast.success('Registration successful!', {
          onClose: () => navigate('/login')
        });
      } else {
        toast.error('Failed to Register');
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.error_type || "Registration failed. Please try again.");
      setSubmitError(error.error_message || "Registration failed");
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
            Create your account
          </h1>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
            required
          />

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

          <FormInput
            label="Company Code"
            id="company_id"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            placeholder="Company code"
            error={errors.company_id}
            required
          />

          <FormSelect
            label="Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            required
            options={[
              { value: "", label: "Select Role" },
              { value: "developer", label: "Developer" },
              { value: "tester", label: "Tester" },
              { value: "manager", label: "Manager" },
              { value: "admin", label: "Admin" },
            ]}
          />

          <p className="text-sm text-gray-600 mb-6">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 font-medium hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 font-medium hover:underline">
              Privacy Policy
            </Link>.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#01a370] hover:bg-[#018a60] text-white py-3 rounded-lg font-medium transition duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "+Creating Account..." : "Create Account"}
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