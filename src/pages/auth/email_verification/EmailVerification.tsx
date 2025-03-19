import { useState, useEffect, useCallback, useRef } from "react";
import { UserAuthLayout } from "@/components";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sendOTP, verifyOTP } from "@/endpoints/userAuth";
import { getErrorMessage } from "@/utils/errorHandler";

const EmailVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const didSend = useRef(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // Get the user email from either 'user-signup-credentials' or 'user-email'
  useEffect(() => {
    const storedUserData = localStorage.getItem("user-signup-credentials");
    const storedUserEmail = localStorage.getItem("user-email");

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.email) {
          setUserEmail(parsedData.email);
          return;
        }
      } catch (error) {
        // Parsing failed – fallback to storedUserEmail
        console.log(error);
      }
    }
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    } else {
      // If neither source is available, navigate back.
      window.history.back();
    }
  }, []);

  // Send OTP when a valid userEmail is set
  useEffect(() => {
    if (!userEmail) return; // Wait until email is set
    if (didSend.current) return;
    didSend.current = true;

    const handleSendOTP = async () => {
      try {
        await sendOTP(userEmail);
      } catch (error) {
        const err = getErrorMessage(error);
        toast.error(`Error: ${err}`);
      }
    };

    handleSendOTP();
  }, [userEmail]);

  // Update OTP state as the user types.
  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  // When OTP is complete, call verifyOTP to validate the code.
  const handleOTPComplete = async (value: string) => {
    try {
      const response = await verifyOTP(value);
      if (response.success) {
        toast.success("Email verified successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid code. Please try again.");
        setOtp("");
      }
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(`Error: ${err}`);
      setOtp("");
    }
  };

  // Resend logic: simulate resend API call and start a 30-second cooldown.
  const handleResendCode = useCallback(async () => {
    if (isResending || resendTimer > 0) return;

    setIsResending(true);
    try {
      await sendOTP(userEmail);
      toast.success("A new verification code has been sent to your email!");
      setResendTimer(30);
    } catch (error) {
      const err = getErrorMessage(error);
      toast.error(`Error: ${err}`);
    } finally {
      setIsResending(false);
    }
  }, [isResending, resendTimer, userEmail]);

  // Timer countdown effect.
  useEffect(() => {
    if (resendTimer === 0) return;
    const intervalId = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [resendTimer]);

  // If there's no email available, don't render anything.
  if (!userEmail) return null;

  return (
    <main className="flex min-h-full w-full max-w-md flex-col justify-center items-center relative pt-4 px-4">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Confirm Your Email
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          We sent a code to <span className="font-semibold">{userEmail}</span>
        </p>
        <button
          id="edit-email-button"
          className="mt-2 text-sm font-semibold text-indigo-600 hover:underline"
        >
          Edit Email
        </button>
      </header>
      <div className="w-full flex justify-center mb-6">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={otp}
          id="otp-field"
          name="otpField"
          onChange={handleOTPChange}
          onComplete={handleOTPComplete}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResendCode}
            disabled={resendTimer > 0}
            id="resend-otp-button"
            className={`font-semibold ${
              resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:underline"
            }`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
          </button>
        </p>
      </div>
    </main>
  );
};

export default UserAuthLayout(EmailVerification);
