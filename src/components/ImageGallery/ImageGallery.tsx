import { useState } from "react";
import { X } from "lucide-react";

type ImageGalleryProps = {
  images: string[];
  onClose?: () => void;
};

function ImageGallery({ images, onClose }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative bg-white">

      <div className="relative h-80 w-full overflow-hidden">

        <img
          src={images[activeIndex]}
          alt="Property"
          className="h-full w-full object-cover"
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
        >
          <X size={20} />
        </button>

      </div>

      <div className="relative -mt-8 flex gap-3 overflow-x-auto px-4 pb-1">

        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
              index === activeIndex
                ? "border-primary-800"
                : "border-white"
            }`}
          >
            <img
              src={image}
              alt={`Property thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}

      </div>

    </div>
  );
}

export default ImageGallery;
