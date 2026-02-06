import { useState } from "react";
import { Eye, EyeOff, Building2, UserPlus, Copy, CheckCircle2 } from "lucide-react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateRequired } from "../utils/validators";
import { AuthAPI, CompanyApis } from "../api/index";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import ToastNotification from "../common/ToastNotification";
import Modal from "../common/Modal";

const Signup = () => {
  const [activeTab, setActiveTab] = useState("signup"); // 'signup' or 'company'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_id: "",
    role: "",
  });

  const [companyFormData, setCompanyFormData] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    company_id: "",
    role: "",
  });

  const [companyErrors, setCompanyErrors] = useState({
    name: "",
    email: "",
  });

  const validateUserForm = () => {
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

  const validateCompanyForm = () => {
    const newErrors = {
      name: validateRequired(companyFormData.name, "Company Name"),
      email: validateEmail(companyFormData.email),
    };

    setCompanyErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!validateCompanyForm()) return;

    setIsSubmitting(true);
    try {
      const response = await CompanyApis.createCompany(companyFormData);
      // The backend returns the company object directly, not wrapped in { success: true }
      if (response && response.company_code) {
        setGeneratedCode(response.company_code);
        setShowCodeModal(true);
        setCompanyFormData({ name: "", email: "" }); // Clear the company form
        setCompanyErrors({ name: "", email: "" }); // Clear errors
        toast.success("Company registered successfully!");
      } else {
        toast.error("Failed to retrieve company code");
      }
    } catch (error) {
      console.error("Company creation error:", error);
      toast.error(error.message?.error_message || "Failed to create company");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (!validateUserForm()) return;

    setIsSubmitting(true);
    try {
      const response = await AuthAPI.registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company_code: formData.company_id,
        role: formData.role,
      });

      if (response && response.success) {
        toast.success('Registration successful!', {
          onClose: () => navigate('/login')
        });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.error_type || "Registration failed. Please try again.");
      setSubmitError(error.error_message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.info("Code copied to clipboard!");
  };

  const closeCodeModal = () => {
    setShowCodeModal(false);
    setFormData(prev => ({ ...prev, company_id: generatedCode }));
    setActiveTab("signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastNotification />

      <div className="max-w-md mx-auto w-full bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Tab Toggle */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 flex items-center justify-center py-4 text-sm font-semibold transition-colors ${activeTab === "signup"
              ? "text-[#01a370] bg-[#01a370]/5 border-b-2 border-[#01a370]"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Join Company
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`flex-1 flex items-center justify-center py-4 text-sm font-semibold transition-colors ${activeTab === "company"
              ? "text-[#01a370] bg-[#01a370]/5 border-b-2 border-[#01a370]"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Add Company
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="font-bebasNeue tracking-wider text-4xl font-bold text-gray-800 mb-2">
              {activeTab === "signup" ? "Create your account" : "Register Company"}
            </h1>
            <p className="text-gray-500 text-sm">
              {activeTab === "signup"
                ? "Join your team and start tracking issues"
                : "Register your organization to get started"}
            </p>
          </div>

          {activeTab === "signup" ? (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <FormInput
                label="Full Name"
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
                label="Email Address"
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
                placeholder="••••••••"
                error={errors.password}
                required
                icon={
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="text-gray-400 h-5 w-5" /> : <Eye className="text-gray-400 h-5 w-5" />}
                  </button>
                }
              />

              <FormInput
                label="Company Code"
                id="company_id"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                error={errors.company_id}
                required
                helperText="Ask your admin for the code or register a new company"
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
                  { value: "manager", label: "Project Manager" },
                  { value: "admin", label: "Administrator" },
                ]}
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#01a370] hover:bg-[#018a60] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-[#01a370]/20 transition-all duration-200 active:scale-95 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? "Creating Account..." : "Join & Sign Up"}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-[#01a370] font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleCompanySubmit} className="space-y-6">
              <FormInput
                label="Company Name"
                id="comp-name"
                name="name"
                value={companyFormData.name}
                onChange={handleCompanyChange}
                placeholder="Acme Corp"
                error={companyErrors.name}
                required
              />

              <FormInput
                type="email"
                label="Company Email"
                id="comp-email"
                name="email"
                value={companyFormData.email}
                onChange={handleCompanyChange}
                placeholder="hr@acmecorp.com"
                error={companyErrors.email}
                required
              />

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Note:</strong> Registering a company will generate a unique <strong>Company Code</strong>. You must share this code with your team members so they can create accounts under your organization.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 active:scale-95 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? "Registering..." : "Create Organization"}
                </button>
              </div>
            </form>
          )}

          {submitError && (
            <p className="text-red-500 text-sm mt-4 text-center p-3 bg-red-50 rounded-lg">{submitError}</p>
          )}
        </div>
      </div>

      {/* Success Modal for Company Code */}
      <Modal
        isOpen={showCodeModal}
        onClose={closeCodeModal}
        title="Company Registered!"
        size="small"
      >
        <div className="text-center py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-10 w-10 text-[#01a370]" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Action Required</h3>
          <p className="text-gray-600 text-sm mb-6 px-4">
            Please note down your unique <strong>Company Code</strong>. This is required for creating user accounts under your company.
          </p>

          <div className="relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-8 mx-4">
            <span className="text-4xl font-mono font-black tracking-[0.2em] text-[#01a370]">
              {generatedCode}
            </span>
            <button
              onClick={copyToClipboard}
              className="absolute -top-3 -right-3 bg-white border border-gray-200 p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              title="Copy Code"
            >
              <Copy className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <button
            onClick={closeCodeModal}
            className="w-full bg-[#01a370] text-white py-3 rounded-xl font-bold hover:bg-[#018a60] transition-colors"
          >
            I've Noted It Down
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Signup;