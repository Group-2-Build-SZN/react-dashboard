import { CameraIcon } from "lucide-react";

type PropertyImageProps = {
  image: string;
  uploadCount: number;
  videoDuration: string;
  className?: string;
  compact?: boolean;
};

function PropertyImage({
  image,
  uploadCount,
  videoDuration,
  className = "h-48 w-full",
  compact = false,
}: PropertyImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={image}
        alt="Property"
        className="h-full w-full object-cover"
      />

      {/* Upload Count */}
      <div
        className={`absolute flex items-center gap-1 rounded-md bg-black/70 text-white ${
          compact
            ? "left-1.5 top-1.5 px-1 py-0.5 text-[10px]"
            : "left-3 top-3 px-2 py-1 text-xs"
        }`}
      >
        <CameraIcon size={compact ? 11 : 14} />
        <span>{uploadCount}</span>
      </div>

      {/* Video Duration */}
      <div
        className={`absolute rounded-md bg-black/70 text-white ${
          compact
            ? "bottom-1.5 left-1.5 px-1 py-0.5 text-[10px]"
            : "bottom-3 left-3 px-2 py-1 text-xs"
        }`}
      >
        {videoDuration}
      </div>
    </div>
  );
}

export default PropertyImage;
