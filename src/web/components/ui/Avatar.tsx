import { CircleUserRound } from "lucide-react";

type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, alt, size = 36, className = "" }: AvatarProps) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={dimension}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      style={dimension}
      className={`flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400 ${className}`}
    >
      <CircleUserRound size={size * 0.75} strokeWidth={1.5} />
    </span>
  );
}
