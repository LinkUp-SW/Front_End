import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import { updateEmail } from "@/endpoints/settingsEndpoints";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { getErrorMessage } from "@/utils/errorHandler";

const AddEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate("/settings/security/email");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = Cookies.get("linkup_auth_token");
      if (!token) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      await updateEmail(token, newEmail.toLocaleLowerCase(), password);
      toast.success("OTP sent to your new account");
      navigate(`/settings/security/email/verify?new=${newEmail}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = newEmail && password;

  return (
    <SettingsLayoutPage>
      <div className="max-w-[700px] w-full mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-[rgba(0,0,0,0.9)] dark:text-white transition-colors duration-300">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="text-[#0a66c2] dark:text-[#1d4ed8] text-base font-semibold flex items-center mb-4 hover:underline transition-all duration-300"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-semibold mb-2">Email Address Update</h2>
          <p className="text-lg text-[rgba(0,0,0,0.7)] dark:text-[rgba(255,255,255,0.7)] mb-6">
            Add a new email address to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Email Input */}
          <div>
            <label
              htmlFor="newEmail"
              className="block mb-2 font-medium text-[rgba(0,0,0,0.9)] dark:text-white text-sm"
            >
              New Email Address
            </label>
            <input
              id="newEmail"
              type="email"
              className="w-full p-4 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] rounded-md text-base bg-white dark:bg-gray-800 text-[rgba(0,0,0,0.9)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] dark:focus:ring-[#1d4ed8] transition-all"
              placeholder="Email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <p className="mt-2 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
              A confirmation will be sent to this account.
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-[rgba(0,0,0,0.9)] dark:text-white text-sm"
            >
              Your LinkUp Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-4 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] rounded-md text-base bg-white dark:bg-gray-800 text-[rgba(0,0,0,0.9)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] dark:focus:ring-[#1d4ed8] transition-all"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full p-4 rounded-md disabled:opacity-50 cursor-not-allowed text-white font-semibold transition-colors duration-200 ${
              isSubmitting ? "affirmativeBtn" : "affirmativeBtn"
            } ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Updating..." : "Submit"}
          </button>
        </form>
      </div>
    </SettingsLayoutPage>
  );
};

export default AddEmailPage;
