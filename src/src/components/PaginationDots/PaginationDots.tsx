type PaginationDotsProps = {
  total: number;
  activeIndex: number;
};

function PaginationDots({ total, activeIndex }: PaginationDotsProps) {
  return (
    <div className="flex items-center gap-1.5">

      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-2 rounded-full transition-all ${
            index === activeIndex
              ? "w-6 bg-primary-800"
              : "w-2 bg-primary-100"
          }`}
        />
      ))}

    </div>
  );
}

export default PaginationDots;
