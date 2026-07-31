import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function GooglePlayIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" {...props}>
      <path d="M3 2.2c-.4.2-.6.6-.6 1.1v13.4c0 .5.2.9.6 1.1l7.6-7.8L3 2.2z" fill="#00D2FF" />
      <path d="M13.6 7.3 10.6 10l3 2.7 3.6-2c.6-.4.6-1.3 0-1.6l-3.6-1.8z" fill="#FFCF00" />
      <path d="M3 2.2 12.5 7.3l1.1-1L4.4 1.3c-.5-.3-1-.2-1.4.1z" fill="#00F76F" />
      <path d="M3 17.8 12.5 12.7l1.1 1-9.2 5c-.5.3-1 .2-1.4-.1z" fill="#FF3A44" />
    </svg>
  );
}

export function AppleIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path d="M14.94 10.6c-.02-2.03 1.66-3.01 1.73-3.05-.95-1.38-2.42-1.57-2.95-1.6-1.25-.13-2.45.74-3.08.74-.63 0-1.61-.72-2.65-.7-1.36.02-2.62.79-3.32 2.01-1.42 2.46-.36 6.1 1.02 8.09.68.98 1.48 2.07 2.53 2.03 1.02-.04 1.4-.65 2.63-.65 1.22 0 1.57.65 2.64.63 1.09-.02 1.78-.99 2.44-1.98.77-1.13 1.09-2.23 1.1-2.29-.02-.01-2.11-.81-2.13-3.23z" />
      <path d="M12.9 4.44c.56-.68.94-1.62.83-2.56-.8.03-1.78.53-2.36 1.2-.52.6-.97 1.56-.85 2.48.9.07 1.82-.45 2.38-1.12z" />
    </svg>
  );
}
