import React, { useState, useEffect } from "react";

const DynamicForm = ({
  fields,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}) => {
  const [formData, setFormData] = useState({});

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

      console.log("DefaultData in DyanamicForm", defaultData);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Target", e.target, name, value, type, checked);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    console.log("FormData", formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("handleSubmit in DyanamicForm", formData);
    onSubmit(formData);
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

    switch (type) {
      case "select":
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>{label}</label>
            <select
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className={`${baseInputClass} ${className}`}
              required={required}
              {...rest}
            >
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "textarea":
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>{label}</label>
            <textarea
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className={`${baseInputClass} min-h-[100px] ${className}`}
              placeholder={placeholder}
              required={required}
              {...rest}
            />
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
          </div>
        );

      default:
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className={`${baseInputClass} ${className}`}
              placeholder={placeholder}
              required={required}
              {...rest}
            />
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
