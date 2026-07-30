import { ShieldCheck, BedDouble, Bath } from "lucide-react";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  type: string;
}

export function PropertyCard({
  image,
  title,
  location,
  price,
  beds,
  baths,
  type,
}: PropertyCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 transition-shadow hover:shadow-md">
      <div className="relative">
        <img src={image} alt={title} className="h-44 w-full object-cover" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-caption font-semibold text-secondary">
          <ShieldCheck size={12} />
          VERIFIED
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-h4 font-semibold text-neutral">{title}</h3>
        <p className="mt-1 text-small text-neutral-500">{location}</p>
        <p className="mt-2 text-h4 font-bold text-primary">
          {price}
          <span className="text-small font-normal text-neutral-500">/year</span>
        </p>
        <div className="mt-3 flex items-center gap-4 text-small text-neutral-500">
          <span className="flex items-center gap-1">
            <BedDouble size={14} /> {beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {baths} Baths
          </span>
          <span>{type}</span>
        </div>
      </div>
    </div>
  );
}
