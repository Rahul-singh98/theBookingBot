import React, { useState, useEffect } from "react";
import DynamicSelectField from "./DynamicSelectField";
import JsonStart from "../JsonComps/JsonStart";
import JsonDropdown from "../JsonComps/JsonDropdown";
import JsonDate from "../JsonComps/JsonDate";
import JsonTime from "../JsonComps/JsonTime";
import JsonDateTime from "../JsonComps/JsonDateTime";
import JsonAddress from "../JsonComps/JsonAddress";
import JsonNumber from "../JsonComps/JsonNumber";
import JsonClickList from "../JsonComps/JsonClickList";
import JsonEmail from "../JsonComps/JsonEmail";
import JsonPassword from "../JsonComps/JsonPassword";
import JsonInput from "../JsonComps/JsonInput";
import JsonEnd from "../JsonComps/JsonEnd";
import JsonCondition from "../JsonComps/JsonCondition";
import { uploadImage } from "@/api/upload";

const DynamicForm = ({ fields, initialData, onSubmit, onCancel, submitLabel = "Submit", cancelLabel = "Cancel", matrixLayout = [], }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [prettyJson, setPrettyJson] = useState({});
  const [jsonDependencyKey, setJsonDependencyKey] = useState("");

  // Process initial data and handle JSON fields 
  useEffect(() => {
    const processInitialData = () => {
      const processedData = {};
      const formattedJson = {};
      fields.forEach((field) => {
        const initialValue = initialData?.[field.name];
        if (field.type === "json") {
          try {
            // Handle JSON fields 
            let jsonValue = initialValue;
            if (typeof initialValue === "string") {
              jsonValue = JSON.parse(initialValue);
            } processedData[field.name] = JSON.stringify(jsonValue, null, 2);
            formattedJson[field.name] = JSON.stringify(jsonValue, null, 2);
          } catch (e) {
            processedData[field.name] = initialValue || "{}";
            formattedJson[field.name] = initialValue || "{}";
          }
        } else {
          // Handle non-JSON fields 
          processedData[field.name] = initialValue ?? field.defaultValue ?? getDefaultValueByType(field.type);
        }
      });
      setFormData(processedData);
      setPrettyJson(formattedJson);
    };
    processInitialData();
  }, [initialData, fields]);

  const getDefaultValueByType = (type) => {
    switch (type) {
      case "number": return 0;
      case "checkbox": return false;
      case "select": return "";
      case "json": return "{}";
      default: return "";
    }
  };

  const validateField = (field, value) => {
    const { name, validationRules, type } = field;
    if (!validationRules) return "";
    if (type === "json") {
      if (!value && !validationRules.required) return "";
      if (typeof value === "string") {
        try {
          const parsedValue = JSON.parse(value);
          if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
            return `${field.label} must be a valid JSON object`;
          }
        } catch (e) {
          return `Invalid JSON format for ${field.label}: ${e.message}`;
        }
      } else if (typeof value === "object" && !Array.isArray(value)) {
        return "";
      } else {
        return `${field.label} must be a valid JSON object`;
      }
    } if (validationRules.min !== undefined && value < validationRules.min) {
      return `The value for ${field.label} cannot be less than ${validationRules.min}`;
    } if (validationRules.max !== undefined && value > validationRules.max) {
      return `The value for ${field.label} cannot be greater than ${validationRules.max}`;
    } if (validationRules.pattern) {
      const regex = new RegExp(validationRules.pattern);
      if (!regex.test(value)) {
        return validationRules.message || `Invalid format for ${field.label}`;
      }
    } if (validationRules.required && !value) {
      return `${field.label} is required`;
    } if (validationRules.custom) {
      const customError = validationRules.custom(value);
      if (customError) return customError;
    } return "";
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
    // Update dependency key for JSON fields 
    const dependentJsonFields = fields.filter((field) => field.type === "json" && field.dependency === name);
    dependentJsonFields.forEach(() => {
      setJsonDependencyKey(value);
    });
    // Update form data 
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    // Handle JSON field updates 
    const field = fields.find((f) => f.name === name);
    if (field?.type === "json") {
      try {
        const parsed = JSON.parse(newValue);
        setPrettyJson((prev) => ({ ...prev, [name]: JSON.stringify(parsed, null, 2), }));
      } catch (e) {
        setPrettyJson((prev) => ({ ...prev, [name]: newValue }));
      }
    } // Clear errors 
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } // Validate field if needed 
    if (field?.validationRules) {
      const error = validateField(field, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const processedData = { ...formData };
      fields.forEach((field) => {
        if (field.type === "json" && processedData[field.name]) {
          try {
            processedData[field.name] = JSON.parse(processedData[field.name]);
          } catch (e) { }
        }
      });
      onSubmit(processedData);
    }
  };

  const renderJson = (type, name, placeholder, required, rest, inputClass, initialValue) => {
    // Parse initialValue if it's a string 
    let parsedInitialValue = initialValue;
    try {
      if (typeof initialValue === "string") {
        parsedInitialValue = JSON.parse(initialValue);
      }
    } catch (e) {
      parsedInitialValue = {};
    } const commonProps = { targetName: name, onDataChange: handleChange, initialData: parsedInitialValue, };
    switch (type) {
      case "Start": return <JsonStart {...commonProps} />;
      case "Dropdown": return <JsonDropdown {...commonProps} />;
      case "Date": return <JsonDate {...commonProps} />;
      case "Time": return <JsonTime {...commonProps} />;
      case "DateTime": return <JsonDateTime {...commonProps} />;
      case "Address": return <JsonAddress {...commonProps} />;
      case "Number": return <JsonNumber {...commonProps} />;
      case "ClickList": return <JsonClickList {...commonProps} />;
      case "Email": return <JsonEmail {...commonProps} />;
      case "Password": return <JsonPassword {...commonProps} />;
      case "Input": return <JsonInput {...commonProps} />;
      case "Conditional": return <JsonCondition {...commonProps} />;
      case "End": return <JsonEnd {...commonProps} />;
      default: return (<textarea name={name} value={prettyJson[name] || formData[name] || ""} onChange={handleChange} className={`${inputClass} min-h-[200px] font-mono text-sm`
      } placeholder={placeholder || "Enter valid JSON"
      } required={required} spellCheck="false" {...rest} />);
    }
  };

  const renderField = (field) => {
    const {
      type = "text",
      name,
      label,
      required = false,
      placeholder,
      className = "",
      ...rest
    } = field;

    const baseInputClass =
      "w-full rounded-md border border-stroke bg-transparent px-5 py-3 dark:border-strokedark dark:bg-meta-4 dark:text-white";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const errorClass = "text-sm text-red-500 mt-1";
    const inputClass = `${baseInputClass} ${className} ${errors[name] ? "border-red-500" : ""}`;

    switch (type) {
      case "image":
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              name={name}
              onChange={(e) => handleImageChange(e, name)}
              className={inputClass}
              required={required}
              {...rest}
            />
            {formData[name] && (
              <div className="mt-2">
                <img
                  src={formData[name]}
                  alt="Uploaded Preview"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
            )}
            {errors[name] && <div className={errorClass}>{errors[name]}</div>}
          </div>
        );
      default:
        // Existing field rendering logic...
        return (
          <div key={name} className="mb-4">
            <label className={labelClass}>
              {label} {required && <span className="text-red-500 ml-1">*</span>}
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

  // Add this helper function to handle image file changes
  const handleImageChange = async (e, name) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // Ensure the key matches the backend

      try {
        // Upload the image to the backend
        const data = await uploadImage(formData);
        const fileUrl = data.file_url;

        // Update form data with the file URL
        setFormData((prev) => ({
          ...prev,
          [name]: fileUrl,
        }));
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 grid gap-4"
      style={{ gridTemplateColumns: `repeat(${matrixLayout.columns}, minmax(0, 1fr))`, }}>
      {matrixLayout.rows.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}> {
          row.map((cell) => (
            <div key={cell.name}
              style={{ gridColumn: `span ${cell.colSpan || 1}` }} >
              {renderField(fields.find((field) => field.name === cell.name))} </div>))} </React.Fragment >))}
      <div className="flex justify-end gap-2 col-span-full" > {onCancel && (<button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 dark:border-strokedark rounded-md hover:bg-gray-100 dark:hover:bg-meta-4 dark:text-white" > {cancelLabel} </button>)} <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90" > {submitLabel} </button>
      </div>
    </form>
  );
};

export default DynamicForm;
