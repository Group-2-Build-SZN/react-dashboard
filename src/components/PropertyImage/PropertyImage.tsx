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
    <div className="relative h-44 w-40 overflow-hidden rounded-xl">
      <img
        src={image}
        alt="Property"
        className="h-full w-full object-cover"
      />

      {/* Upload Count */}
      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
        <CameraIcon size={14} />
        <span>{uploadCount}</span>
      </div>

      {/* Video Duration */}
      <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
        {videoDuration}
      </div>
    </div>
  );
}

export default PropertyImage;