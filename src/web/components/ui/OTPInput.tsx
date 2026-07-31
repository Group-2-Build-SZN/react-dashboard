import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";

interface OTPInputProps {
  length?: number;
  onChange?: (code: string) => void;
  error?: boolean;
}

export function OTPInput({ length = 6, onChange, error }: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function updateDigits(next: string[]) {
    setDigits(next);
    onChange?.(next.join(""));
  }

  function handleChange(index: number, rawValue: string) {
    const value = rawValue.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = value;
    updateDigits(next);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          inputMode="numeric"
          maxLength={1}
          autoFocus={index === 0}
          className={cn(
            "h-14 w-12 rounded-xl border text-center text-h4 font-semibold text-neutral focus:outline-none focus:ring-2 focus:ring-primary/30",
            error
              ? "border-error focus:border-error"
              : "border-neutral-300 focus:border-primary"
          )}
        />
      ))}
    </div>
  );
}
