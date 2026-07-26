import { Video } from "lucide-react";

import ImageGallery from "../../components/ImageGallery/ImageGallery";
import DetailTrustBar from "../../components/DetailTrustBar/DetailTrustBar";
import PropertyOverview from "../../components/PropertyOverview/PropertyOverview";
import PropertySpecs from "../../components/PropertySpecs/PropertySpecs";
import AboutSection from "../../components/AboutSection/AboutSection";
import AmenitiesGrid from "../../components/AmenitiesGrid/AmenitiesGrid";
import PropertyOwnerCard from "../../components/PropertyOwnerCard/PropertyOwnerCard";
import Button from "../../components/Button/Button";

import { properties } from "../../data/properties";

type PropertyDetailsProps = {
  propertyId?: number;
  onClose?: () => void;
  onOpenVideo?: (propertyId: number) => void;
};

function PropertyDetails({ propertyId = 1, onClose, onOpenVideo }: PropertyDetailsProps) {
  const property = properties.find((p) => p.id === propertyId) ?? properties[0];

  return (
    <div className="flex min-h-screen flex-col bg-white">

      <ImageGallery images={property.images} onClose={onClose} />

      <div className="mt-6 flex flex-col gap-6 px-4">

        <DetailTrustBar
          trustScore={property.trustScore}
          trustRating={property.trustRating}
          water={property.water}
          power={property.power}
          security={property.security}
        />

        <PropertyOverview
          name={property.name}
          location={property.location}
          address={property.address}
          price={property.price}
          serviceCharge={property.serviceCharge}
          verified={property.verified}
        />

        <PropertySpecs
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          size={property.size}
          propertyType={property.propertyType}
        />

        <AboutSection text={property.about} />

        <AmenitiesGrid amenities={property.amenities} />

        <PropertyOwnerCard
          name={property.owner.name}
          memberSince={property.owner.memberSince}
          idVerified={property.owner.idVerified}
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

        <Button variant="primary" className="flex-1">
          Report property
        </Button>

      </div>

    </div>
  );
}

export default PropertyDetails;
