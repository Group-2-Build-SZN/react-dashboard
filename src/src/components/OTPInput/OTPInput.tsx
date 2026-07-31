import { useRef, useState } from "react";

type OTPInputProps = {
  length?: number;
  onChange?: (code: string) => void;
};

function OTPInput({ length = 6, onChange }: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateDigits = (next: string[]) => {
    setDigits(next);
    onChange?.(next.join(""));
  };

  const handleChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = value;
    updateDigits(next);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          inputMode="numeric"
          maxLength={1}
          autoFocus={index === 0}
          className="h-12 w-12 rounded-xl border border-muted bg-transparent text-center text-lg font-semibold text-gray-900 focus:border-primary-800 focus:outline-none"
        />
      ))}
    </div>
  );
}

export default OTPInput;
