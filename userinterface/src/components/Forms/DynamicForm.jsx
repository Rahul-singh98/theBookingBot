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

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
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
    }
  }, [initialData, fields]);

  const getDefaultValueByType = (type) => {
    switch (type) {
      case "number":
        return 0;
      case "checkbox":
        return false;
      case "select":
        return "";
      default:
        return "";
    }
  };

  const validateField = (field, value) => {
    const { name, validationRules } = field;
    if (!validationRules) return "";

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
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Validate field on change if it has validation rules
    const field = fields.find((f) => f.name === name);
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
      onSubmit(formData);
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
