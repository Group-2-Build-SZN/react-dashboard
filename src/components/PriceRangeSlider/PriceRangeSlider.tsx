type PriceRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number, isMax: boolean) => string;
};

function defaultFormat(value: number, isMax: boolean) {
  const formatted = `₦${value.toLocaleString("en-NG")}`;
  return isMax ? `${formatted}+` : formatted;
}

function PriceRangeSlider({
  min,
  max,
  step = 50000,
  value,
  onChange,
  formatLabel = defaultFormat,
}: PriceRangeSliderProps) {
  const [low, high] = value;

  const lowPercent = ((low - min) / (max - min)) * 100;
  const highPercent = ((high - min) / (max - min)) * 100;

  const handleLowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(event.target.value), high - step);
    onChange([next, high]);
  };

  const handleHighChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(event.target.value), low + step);
    onChange([low, next]);
  };

  return (
    <div>
      <div className="relative h-6">
        {/* Track */}
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-border-light" />

        {/* Active range */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary-800"
          style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleLowChange}
          className="range-thumb pointer-events-none absolute top-1/2 h-6 w-full -translate-y-1/2 appearance-none bg-transparent"
          aria-label="Minimum price"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleHighChange}
          className="range-thumb pointer-events-none absolute top-1/2 h-6 w-full -translate-y-1/2 appearance-none bg-transparent"
          aria-label="Maximum price"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm font-medium text-gray-700">
        <span>{formatLabel(low, false)}</span>
        <span>{formatLabel(high, true)}</span>
      </div>
    </div>
  );
}

export default PriceRangeSlider;
