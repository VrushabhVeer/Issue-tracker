const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  error,
  required = false,
  options,
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full py-2 px-4 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-lg mt-1`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormSelect;