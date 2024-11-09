import React, { useState, useEffect } from "react";
import DynamicSelectField from "./DynamicSelectField";

const DynamicForm = ({
  fields,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [prettyJson, setPrettyJson] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Format any JSON fields on initial load
      formatJsonFields(initialData);
    } else {
      // Initialize with default values
      const defaultData = fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.defaultValue || getDefaultValueByType(field.type),
        }),
        {}
      );
      setFormData(defaultData);
      formatJsonFields(defaultData);
    }
  }, [initialData, fields]);

  const formatJsonFields = (data) => {
    const formattedJson = {};
    fields.forEach((field) => {
      if (field.type === "json" && data[field.name]) {
        try {
          const parsed =
            typeof data[field.name] === "string"
              ? JSON.parse(data[field.name])
              : data[field.name];
          formattedJson[field.name] = JSON.stringify(parsed, null, 2);
        } catch (e) {
          formattedJson[field.name] = data[field.name];
        }
      }
    });
    setPrettyJson(formattedJson);
  };

  const getDefaultValueByType = (type) => {
    switch (type) {
      case "number":
        return 0;
      case "checkbox":
        return false;
      case "select":
        return "";
      case "json":
        return "{}";
      default:
        return "";
    }
  };

  const validateField = (field, value) => {
    const { name, validationRules, type } = field;
    if (!validationRules) return "";

    // JSON-specific validation
    if (type === "json") {
      // Skip validation if value is empty and not required
      if (!value && !validationRules.required) return "";

      // If value is a string, try to parse it
      if (typeof value === "string") {
        try {
          const parsedValue = JSON.parse(value);
          // Ensure the parsed value is an object/dictionary
          if (
            !parsedValue ||
            typeof parsedValue !== "object" ||
            Array.isArray(parsedValue)
          ) {
            return `${field.label} must be a valid JSON object`;
          }
        } catch (e) {
          return `Invalid JSON format for ${field.label}: ${e.message}`;
        }
      } else if (typeof value === "object" && !Array.isArray(value)) {
        // If it's already an object (but not an array), it's valid
        return "";
      } else {
        return `${field.label} must be a valid JSON object`;
      }
    }

    if (validationRules.min !== undefined && value < validationRules.min) {
      return `The value for ${field.label} cannot be less than ${validationRules.min}`;
    }
    if (validationRules.max !== undefined && value > validationRules.max) {
      return `The value for ${field.label} cannot be greater than ${validationRules.max}`;
    }

    if (validationRules.pattern) {
      const regex = new RegExp(validationRules.pattern);
      if (!regex.test(value)) {
        return validationRules.message || `Invalid format for ${field.label}`;
      }
    }

    if (validationRules.required && !value) {
      return `${field.label} is required`;
    }

    if (validationRules.custom) {
      const customError = validationRules.custom(value);
      if (customError) return customError;
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const newValue = inputType === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Handle JSON formatting
    const field = fields.find((f) => f.name === name);
    if (field?.type === "json") {
      try {
        const parsed = JSON.parse(newValue);
        setPrettyJson((prev) => ({
          ...prev,
          [name]: JSON.stringify(parsed, null, 2),
        }));
      } catch (e) {
        // Don't format if JSON is invalid
        setPrettyJson((prev) => ({
          ...prev,
          [name]: newValue,
        }));
      }
    }

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Validate field on change if it has validation rules
    if (field?.validationRules) {
      const error = validateField(field, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Parse JSON fields before submitting
      const processedData = { ...formData };
      fields.forEach((field) => {
        if (field.type === "json" && processedData[field.name]) {
          try {
            processedData[field.name] = JSON.parse(processedData[field.name]);
          } catch (e) {
            // If JSON is invalid, it won't pass validation anyway
          }
        }
      });
      onSubmit(processedData);
    }
  };

  const renderField = (field) => {
    const {
      type = "text",
      name,
      label,
      options,
      required = false,
      placeholder,
      className = "",
      ...rest
    } = field;

    const baseInputClass =
      "w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white";
    const labelClass =
      "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const errorClass = "text-sm text-red-500 mt-1";

    // Add error state to input class
    const inputClass = `${baseInputClass} ${className} ${
      errors[name] ? "border-red-500" : ""
    }`;

    switch (type) {
      case "select":
        return (
          <DynamicSelectField
            name={name}
            label={label}
            options={options}
            required={required}
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            labelClass={labelClass}
            inputClass={inputClass}
            errorClass={errorClass}
          />
        );

      case "json":
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={name}
              value={prettyJson[name] || formData[name] || ""}
              onChange={handleChange}
              className={`${inputClass} min-h-[200px] font-mono text-sm`}
              placeholder={placeholder || "Enter valid JSON"}
              required={required}
              spellCheck="false"
              {...rest}
            />
            {errors[name] && <div className={errorClass}>{errors[name]}</div>}
          </div>
        );

      case "textarea":
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className={`${inputClass} min-h-[100px]`}
              placeholder={placeholder}
              required={required}
              {...rest}
            />
            {errors[name] && <div className={errorClass}>{errors[name]}</div>}
          </div>
        );

      case "checkbox":
        return (
          <div key={name} className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              name={name}
              checked={formData[name] || false}
              onChange={handleChange}
              className={`h-4 w-4 rounded border-stroke ${className}`}
              {...rest}
            />
            <label className={labelClass}>{label}</label>
            {errors[name] && <div className={errorClass}>{errors[name]}</div>}
          </div>
        );

      default:
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder={placeholder}
              required={required}
              {...rest}
            />
            {errors[name] && <div className={errorClass}>{errors[name]}</div>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(renderField)}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-strokedark rounded-md hover:bg-gray-100 dark:hover:bg-meta-4 dark:text-white"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
