import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import SettingsLayoutPage from "../../components/hoc/SettingsLayoutPage";
import { validatePassword } from "../../utils";
import { changePassword } from "@/endpoints/settingsEndpoints";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
  });

  useEffect(() => {
    const newErrors = {
      currentPassword: "",
      newPassword: newPassword ? validatePassword(newPassword) || "" : "",
      retypePassword:
        newPassword !== retypePassword && retypePassword
          ? "Passwords don't match"
          : "",
    };

    setErrors(newErrors);

    if (
      currentPassword &&
      newPassword &&
      !validatePassword(newPassword) &&
      retypePassword &&
      newPassword === retypePassword
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [currentPassword, newPassword, retypePassword]);

  const handleBack = () => {
    navigate("/settings/security");
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "retype":
        setShowRetypePassword(!showRetypePassword);
        break;
    }
  };

  const handleSavePassword = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setStatusMessage("");

    const token = Cookies.get("linkup_auth_token");
    if (token && currentPassword && newPassword) {
      try {
        const response = await changePassword(
          token,
          currentPassword,
          newPassword
        );

        if (response.success) {
          setStatusMessage("Password changed successfully");
          toast.success(response.message);
          setTimeout(() => {
            handleBack();
          }, 1500);
        } else {
          toast.error(response.message || "Failed to change password");
          setStatusMessage(response.message || "Failed to change password");
        }
      } catch (error) {
        setStatusMessage("An error occurred. Please try again later.");
        toast.error(getErrorMessage(error));
        console.error("Password change error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <SettingsLayoutPage>
      <div className="flex flex-col w-full max-w-[800px] mx-auto p-5">
        <div className="mb-[30px]">
          <button
            onClick={handleBack}
            className="flex items-center bg-transparent border-0 text-[var(--badge-color)] text-sm font-semibold p-0 mb-4 cursor-pointer"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold m-0 mb-2 text-[var(--text-primary)] dark:text-white">
            Change password
          </h1>
          <p className="text-sm text-[var(--text-secondary)] dark:text-[rgba(255,255,255,0.7)] m-0 mb-5">
            Create a new password that is at least 8 characters long.
          </p>

          <div className="relative mb-6">
            <button
              onClick={() => setShowPasswordInfo(!showPasswordInfo)}
              className="flex items-center bg-transparent border-0 text-[var(--badge-color)] px-3 py-2 rounded-2xl bg-[rgba(10,102,194,0.08)] dark:bg-[rgba(10,102,194,0.15)] cursor-pointer text-sm"
            >
              <FaInfoCircle className="mr-2 text-base" />
              <span className="dark:text-white">What makes a strong password?</span>
            </button>

            {showPasswordInfo && (
              <div className="absolute top-full left-0 w-[300px] bg-[var(--background-primary)] dark:bg-[#1a1a1a] rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] mt-2 z-[100] border border-[var(--border-color)] dark:border-[rgba(255,255,255,0.1)]">
                <div className="flex justify-between items-start p-4 pb-2 border-b border-[var(--border-color)] dark:border-[rgba(255,255,255,0.1)]">
                  <h3 className="text-base m-0 font-semibold text-[var(--text-primary)] dark:text-white max-w-[85%]">
                    Choose a strong password to protect your account
                  </h3>
                  <button
                    onClick={() => setShowPasswordInfo(false)}
                    className="bg-transparent border-0 text-xl cursor-pointer text-[var(--text-secondary)] dark:text-[rgba(255,255,255,0.6)] p-0"
                  >
                    ×
                  </button>
                </div>
                <ul className="list-none p-4 m-0">
                  {[
                    "It should be at least 8 characters long",
                    "It should contain at least one uppercase letter",
                    "It should contain at least one lowercase letter",
                    "It should contain at least one digit",
                    "It should contain at least one special character",
                  ].map((rule, index) => (
                    <li
                      key={index}
                      className="relative py-2 text-sm text-[var(--text-primary)] dark:text-white border-b border-[var(--border-color)] dark:border-[rgba(255,255,255,0.1)] last:border-b-0"
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {[
            {
              id: "current-password",
              label: "Type your current password",
              value: currentPassword,
              setValue: setCurrentPassword,
              show: showCurrentPassword,
              toggle: () => togglePasswordVisibility("current"),
              error: errors.currentPassword,
            },
            {
              id: "new-password",
              label: "Type your new password",
              value: newPassword,
              setValue: setNewPassword,
              show: showNewPassword,
              toggle: () => togglePasswordVisibility("new"),
              error: errors.newPassword,
              charCount: newPassword.length,
            },
            {
              id: "retype-password",
              label: "Retype your new password",
              value: retypePassword,
              setValue: setRetypePassword,
              show: showRetypePassword,
              toggle: () => togglePasswordVisibility("retype"),
              error: errors.retypePassword,
              charCount: retypePassword.length,
            },
          ].map((field, index) => (
            <div key={index} className="flex flex-col relative mb-2">
              <label
                htmlFor={field.id}
                className="text-sm text-[var(--text-primary)] dark:text-white mb-2"
              >
                {field.label} <span className="text-[#d11124]">*</span>
              </label>
              <div className="flex border border-[var(--border-color)] rounded overflow-hidden bg-[var(--background-primary)] dark:bg-[#1a1a1a]">
                <input
                  id={field.id}
                  type={field.show ? "text" : "password"}
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="flex-1 p-3 border-0 outline-none text-base text-[var(--text-primary)] dark:text-white bg-[var(--background-primary)] dark:bg-[#1a1a1a]"
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  className="bg-transparent border-0 px-4 text-[var(--badge-color)] font-semibold cursor-pointer"
                >
                  {field.show ? "Hide" : "Show"}
                </button>
              </div>
              {field.error && (
                <div className="text-[#d11124] text-xs mt-1 flex items-center">
                  {field.error}
                </div>
              )}
              {field.charCount !== undefined && (
                <div className="absolute right-2 -bottom-5 text-xs text-[var(--text-secondary)] dark:text-[rgba(255,255,255,0.6)]">
                  {field.charCount}/200
                </div>
              )}
            </div>
          ))}

          {statusMessage && (
            <div
              className={`text-xs mt-1 ${
                statusMessage.includes("success")
                  ? "text-green-600"
                  : "text-[#d11124]"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col gap-4 mt-5">
            <button
              onClick={handleSavePassword}
              disabled={!isFormValid || isLoading}
              className={`py-2 w-[140px] border-0 rounded-[20px] font-semibold cursor-pointer text-base transition-all duration-200 
                ${
                  isFormValid
                    ? "bg-[#0891b2] text-white hover:bg-[#0ea5e9]"
                    : "bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.1)] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)] cursor-not-allowed"
                }`}
            >
              {isLoading ? "Processing..." : "Save Password"}
            </button>

            <button
              onClick={handleForgotPassword}
              className="bg-transparent border-0 text-[var(--badge-color)] cursor-pointer text-base text-left p-0 w-fit mb-4 dark:text-white"
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default ChangePasswordPage;
