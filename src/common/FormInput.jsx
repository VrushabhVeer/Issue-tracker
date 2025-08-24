const FormInput = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon,
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full py-2 px-4 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg mt-1`}
      />
      {icon}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormInput;