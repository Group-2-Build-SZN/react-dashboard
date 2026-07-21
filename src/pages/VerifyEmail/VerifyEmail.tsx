import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import OTPInput from "../../components/OTPInput/OTPInput";

type VerifyEmailProps = {
  email?: string;
  onVerified?: (code: string) => void;
  onResend?: () => void;
};

const RESEND_SECONDS = 45;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function VerifyEmail({ email = "example@gmail.com", onVerified, onResend }: VerifyEmailProps) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (value: string) => {
    if (value.length === 6) {
      onVerified?.(value);
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    onResend?.();
  };

  return (
    <div className="flex min-h-screen flex-col bg-blue-tint px-6 pb-8 pt-10">

      {/* Content centers as a group in the available space */}
      <div className="flex flex-1 flex-col justify-center gap-8">

        <div>
          <h1 className="text-[28px] font-bold leading-9 text-gray-900">
            Verify your Email
          </h1>

          <p className="mt-1 text-base leading-6 text-gray-500">
            We've sent a 6-digit code to {email}
          </p>
        </div>

        <OTPInput onChange={handleChange} />

        <p className="text-sm text-gray-500">
          {secondsLeft > 0 ? (
            <>
              Resend code in{" "}
              <span className="font-medium text-primary-800">
                {formatTime(secondsLeft)}
              </span>
            </>
          ) : (
            <button onClick={handleResend} className="font-medium text-primary-800">
              Resend code
            </button>
          )}
        </p>

      </div>

      {/* Help note stays near the bottom */}
      <div className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
        <CheckCircle2 size={14} className="flex-shrink-0 text-secondary-600" />
        <span>Didn't receive a code? Check inbox or spam folder</span>
      </div>

    </div>
  );
}

export default VerifyEmail;
