import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const DynamicSelectField = ({
  name,
  label,
  options,
  required,
  formData,
  handleChange,
  errors,
  labelClass,
  inputClass,
  errorClass,
  ...rest
}) => {
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [error, setError] = useState(null);
  const { afterLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchOptions = async () => {
      if (typeof options === "function") {
        try {
          const fetchedOptions = await options();
          setDynamicOptions(fetchedOptions);
        } catch (err) {
          if (err.message === "Unauthorized") {
            afterLogout();
            navigate(`/login?next=${location.pathname}`);
          } else {
            setError(err.message);
          }
        }
      } else if (Array.isArray(options)) {
        setDynamicOptions(options);
      }
    };

    fetchOptions();
  }, [options]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 rounded-sm border border-stroke dark:border-strokedark">
        Error: {error}
      </div>
    );
  }

  return (
    <div key={name} className="mb-4">
      <label className={labelClass}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className={inputClass}
        required={required}
        {...rest}
      >
        <option value="" disabled>
          Select an option
        </option>
        {dynamicOptions?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <div className={errorClass}>{errors[name]}</div>}
    </div>
  );
};

export default DynamicSelectField;
