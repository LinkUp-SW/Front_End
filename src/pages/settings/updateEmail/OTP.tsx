import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import {
  sendEmailVerificationOTP,
  verifyEmailOTP,
} from "@/endpoints/settingsEndpoints";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

const OTP: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const newEmail = searchParams.get("new"); // grabs the value of `?new=...`
  const token = Cookies.get("linkup_auth_token");
  const didFetchOtp = useRef(false);

  useEffect(() => {
    // only run this effect once
    if (didFetchOtp.current) return;
    didFetchOtp.current = true;

    // if we don’t have an email, bail out
    if (!newEmail) {
      navigate(-1);
      return;
    }

    (async () => {
      try {
        await sendEmailVerificationOTP(newEmail.toLowerCase(), token as string);
      } catch (error) {
        toast.error(getErrorMessage(error));
        navigate("/settings/security/email");
      }
    })();
  }, [newEmail, token, navigate]);

  const handleBack = () => {
    navigate("/settings/security/email");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!newEmail) return;

    try {
      await verifyEmailOTP(
        verificationCode,
        newEmail.toLocaleLowerCase(),
        true,
        token as string
      );
      toast.success("Email verified successfully");
      navigate("/settings/security/email");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!newEmail) {
    navigate(-1);
    return null;
  }

  return (
    <SettingsLayoutPage>
      <div className="max-w-[700px] w-full mx-auto p-6 bg-white dark:bg-[#111827] rounded-lg text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] transition-colors duration-300">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="bg-transparent border-none text-[#0a66c2] text-base font-semibold cursor-pointer py-2 flex items-center mb-4 hover:underline"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold mb-2">Email addresses</h2>
          <p className="text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            We sent a code to your email
          </p>
        </div>

        <div className="pt-5">
          <p className="text-sm mb-4">
            Enter the verification code sent to {newEmail}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <input
              type="text"
              className="w-full max-w-sm px-4 py-3 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)] rounded text-base bg-white dark:bg-[#111827] text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
              placeholder="Enter the PIN"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />

            <button
              type="submit"
              className={`rounded-full px-6 py-2 text-sm font-medium text-white transition ${
                verificationCode.length === 6 && !isSubmitting
                  ? "bg-[#0a66c2] hover:bg-[#0e7490]"
                  : "bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.12)] cursor-not-allowed"
              }`}
              disabled={verificationCode.length !== 6 || isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Submit"}
            </button>
          </form>

          <p className="text-xs mt-4 text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">
            If you don't see the email in your inbox, check your spam folder.
          </p>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default OTP;
