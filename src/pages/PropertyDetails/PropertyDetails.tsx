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
    <div className="min-h-screen bg-white pb-36">

      {/* Image Gallery */}
      <ImageGallery images={property.images} onClose={onClose} />

      <div className="mt-4 flex flex-col gap-5 px-4">

        {/* Trust Bar */}
        <DetailTrustBar
          trustScore={property.trustScore}
          trustRating={property.trustRating}
          water={property.water}
          power={property.power}
          security={property.security}
        />

        {/* Title + Price */}
        <PropertyOverview
          name={property.name}
          location={property.location}
          address={property.address}
          price={property.price}
          serviceCharge={property.serviceCharge}
          verified={property.verified}
        />

        {/* Bed / Bath / Size / Type */}
        <PropertySpecs
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          size={property.size}
          propertyType={property.propertyType}
        />

        {/* About */}
        <AboutSection text={property.about} />

        {/* Amenities */}
        <AmenitiesGrid amenities={property.amenities} />

        {/* Owner */}
        <PropertyOwnerCard
          name={property.owner.name}
          memberSince={property.owner.memberSince}
          idVerified={property.owner.idVerified}
        />

      </div>

      {/* Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md gap-3 border-t border-gray-100 bg-white px-4 py-3">

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
