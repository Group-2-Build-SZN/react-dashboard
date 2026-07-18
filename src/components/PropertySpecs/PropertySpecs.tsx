import { Bed, Bath, Ruler, Building2 } from "lucide-react";

type PropertySpecsProps = {
  bedrooms: number;
  bathrooms: number;
  size: string;
  propertyType: string;
};

function PropertySpecs({
  bedrooms,
  bathrooms,
  size,
  propertyType,
}: PropertySpecsProps) {
  return (
    <div className="flex items-center gap-4 border-y border-gray-100 py-3 text-xs text-gray-500">

      <div className="flex items-center gap-1">
        <Bed size={14} />
        <span>{bedrooms} Beds</span>
      </div>

      <div className="flex items-center gap-1">
        <Bath size={14} />
        <span>{bathrooms} Baths</span>
      </div>

      <div className="flex items-center gap-1">
        <Ruler size={14} />
        <span>{size}</span>
      </div>

      <div className="flex items-center gap-1">
        <Building2 size={14} />
        <span>{propertyType}</span>
      </div>

    </div>
  );
}

export default PropertySpecs;
