import type { ReactNode } from "react";
import {
  Zap,
  Droplets,
  Shield,
  ParkingCircle,
  DoorOpen,
  UtensilsCrossed,
  Home,
} from "lucide-react";

type AmenitiesGridProps = {
  amenities: string[];
};

const iconMap: Record<string, ReactNode> = {
  "24/7 Power": <Zap size={18} />,
  "Water Supply": <Droplets size={18} />,
  "Security": <Shield size={18} />,
  "Parking Space": <ParkingCircle size={18} />,
  "Balcony": <DoorOpen size={18} />,
  "Fitted Kitchen": <UtensilsCrossed size={18} />,
};

function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  return (
    <div>

      <h3 className="text-base font-semibold text-gray-900">
        Amenities
      </h3>

      <div className="mt-3 grid grid-cols-3 gap-3">

        {amenities.map((amenity) => (
          <div
            key={amenity}
            className="flex flex-col items-center gap-2 rounded-xl bg-gray-100 px-2 py-3 text-center"
          >
            <span className="text-gray-700">
              {iconMap[amenity] ?? <Home size={18} />}
            </span>

            <span className="text-xs font-medium text-gray-600">
              {amenity}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default AmenitiesGrid;
