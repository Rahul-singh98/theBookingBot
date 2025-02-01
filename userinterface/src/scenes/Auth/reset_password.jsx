import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { confirm_reset_password } from "@/api/auth";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the 'next' parameter from the query string
  const queryParams = new URLSearchParams(location.search);
  const next = queryParams.get("next") || "/";

  // Password validation rules
  const passwordRules = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const validatePassword = (password) => {
    if (password.length < passwordRules.minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!passwordRules.hasUpperCase.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!passwordRules.hasLowerCase.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!passwordRules.hasNumber.test(password)) {
      return "Password must contain at least one number";
    }
    if (!passwordRules.hasSpecialChar.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Make API call to reset password
      const response = await confirm_reset_password(
        user.access_token,
        formData.password
      );
      setSuccess(true);
      navigate(next);
    } catch (err) {
      setError(
        err.message || "An error occurred while resetting your password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Please enter your new password below
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success ? (
          <div className="mb-4 p-4 rounded bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
            <p className="text-green-600 dark:text-green-400 text-sm">
              Password has been successfully reset. You can now log in with your
              new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                           dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                           dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed
                       dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
