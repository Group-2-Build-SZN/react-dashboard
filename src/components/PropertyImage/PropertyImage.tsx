import { CameraIcon } from "lucide-react";

type PropertyImageProps = {
  image: string;
  uploadCount: number;
  videoDuration: string;
};

function PropertyImage({
  image,
  uploadCount,
  videoDuration,
}: PropertyImageProps) {
  return (
    <div className="relative h-48 w-full overflow-hidden">
      <img
        src={image}
        alt="Property"
        className="h-full w-full object-cover"
      />

      {/* Upload Count */}
      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
        <CameraIcon size={14} />
        <span>{uploadCount}</span>
      </div>

      {/* Video Duration */}
      <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
        {videoDuration}
      </div>
    </div>
  );
}

export default PropertyImage;
