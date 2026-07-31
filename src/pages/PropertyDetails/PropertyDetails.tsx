import { useEffect, useState } from "react";
import { Video } from "lucide-react";

import ImageGallery from "../../components/ImageGallery/ImageGallery";
import DetailTrustBar from "../../components/DetailTrustBar/DetailTrustBar";
import PropertyOverview from "../../components/PropertyOverview/PropertyOverview";
import PropertySpecs from "../../components/PropertySpecs/PropertySpecs";
import AboutSection from "../../components/AboutSection/AboutSection";
import AmenitiesGrid from "../../components/AmenitiesGrid/AmenitiesGrid";
import PropertyOwnerCard from "../../components/PropertyOwnerCard/PropertyOwnerCard";
import Button from "../../components/Button/Button";

import { getProperty } from "../../api/properties";
import { apiPropertyToProperty, scoreLabel, formatNaira, propertyTypeLabel, featureLabel } from "../../api/adapters";
import type { Property } from "../../types";

type PropertyDetailsProps = {
  propertyId?: string;
  onClose?: () => void;
  onOpenVideo?: (propertyId: string) => void;
  onReport?: (propertyId: string) => void;
};

function PropertyDetails({ propertyId, onClose, onOpenVideo, onReport }: PropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setError("No property specified");
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getProperty(propertyId)
      .then((detail) => {
        if (!cancelled) setProperty(apiPropertyToProperty(detail));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load property");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-muted">Loading property…</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <p className="text-sm text-error-600">{error ?? "Property not found"}</p>
        <Button variant="outline" onClick={onClose}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">

      <ImageGallery images={property.photoUrls.length > 0 ? property.photoUrls : [property.coverImageUrl]} onClose={onClose} />

      <div className="mt-6 flex flex-col gap-6 px-4">

        <DetailTrustBar
          trustScore={property.trustScore}
          trustRating={scoreLabel(property.trustScore)}
          water={scoreLabel(property.waterScore)}
          power={scoreLabel(property.powerScore)}
          security={scoreLabel(property.securityScore)}
        />

        <PropertyOverview
          name={property.listingTitle}
          location={property.neighborhood}
          address={property.address}
          price={formatNaira(property.price)}
          serviceCharge="—"
          verified={property.isVerified}
        />

        <PropertySpecs
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          size="—"
          propertyType={propertyTypeLabel(property.propertyType)}
        />

        <AboutSection text={property.description ?? "No description provided."} />

        <AmenitiesGrid amenities={property.features.map(featureLabel)} />

        <PropertyOwnerCard
          name={property.owner?.name ?? "Owner"}
          memberSince={property.owner?.memberSince ?? "—"}
          idVerified={property.owner?.isVerified ?? false}
        />

      </div>

      <div className="sticky bottom-0 mx-auto mt-6 flex w-full max-w-md flex-shrink-0 gap-3 border-t border-gray-100 bg-white px-4 py-3">

        <Button
          variant="outline"
          className="flex flex-1 items-center justify-center gap-2"
          onClick={() => onOpenVideo?.(property.id)}
        >
          <Video size={18} />
          Video
        </Button>

        <Button variant="primary" className="flex-1" onClick={() => onReport?.(property.id)}>
          Report property
        </Button>

      </div>

    </div>
  );
}

export default PropertyDetails;
