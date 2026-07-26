function CardBrandBadges() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex h-5 w-8 items-center justify-center rounded border border-gray-200 bg-white text-[9px] font-bold italic text-primary-700">
        VISA
      </span>

      <span className="flex h-5 w-8 items-center justify-center rounded bg-gray-50">
        <span className="relative h-3 w-5">
          <span className="absolute left-0 h-3 w-3 rounded-full bg-error-500 opacity-80" />
          <span className="absolute right-0 h-3 w-3 rounded-full bg-accent-500 opacity-80" />
        </span>
      </span>

      <span className="flex h-5 w-9 items-center justify-center rounded bg-error-600 text-[9px] font-bold italic text-white">
        Verve
      </span>
    </div>
  );
}

export default CardBrandBadges;
