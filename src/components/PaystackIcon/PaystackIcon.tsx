function PaystackIcon({ size = 16 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="13" width="4" height="9" rx="1" fill="#00C3F7" />
        <rect x="10" y="8" width="4" height="14" rx="1" fill="#00C3F7" />
        <rect x="18" y="3" width="4" height="19" rx="1" fill="#011B33" />
      </svg>
      <span className="font-bold text-[#011B33]">paystack</span>
    </span>
  );
}

export default PaystackIcon;
