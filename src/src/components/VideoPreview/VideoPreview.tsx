import { Play, Maximize2 } from "lucide-react";

type VideoPreviewProps = {
  thumbnail: string;
  duration: string;
  onPlay?: () => void;
};

function VideoPreview({ thumbnail, duration, onPlay }: VideoPreviewProps) {
  return (
    <div className="relative mx-4 h-56 overflow-hidden rounded-2xl bg-black">

      <img
        src={thumbnail}
        alt="Video walkthrough preview"
        className="h-full w-full object-cover opacity-90"
      />

      <button
        onClick={onPlay}
        aria-label="Play video"
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 bg-black/30 text-white backdrop-blur-sm"
      >
        <Play size={22} fill="white" className="ml-0.5" />
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 text-xs font-medium text-white">
        <span>00:00</span>
        <div className="flex items-center gap-3">
          <span>{duration}</span>
          <Maximize2 size={14} />
        </div>
      </div>

    </div>
  );
}

export default VideoPreview;
