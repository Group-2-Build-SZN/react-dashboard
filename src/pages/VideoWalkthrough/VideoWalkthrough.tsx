import { Share2 } from "lucide-react";

import PageHeader from "../../components/PageHeader/PageHeader";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import PropertyOverview from "../../components/PropertyOverview/PropertyOverview";
import PropertySpecs from "../../components/PropertySpecs/PropertySpecs";
import AboutSection from "../../components/AboutSection/AboutSection";
import AmenitiesGrid from "../../components/AmenitiesGrid/AmenitiesGrid";
import TrustScorePanel from "../../components/TrustScorePanel/TrustScorePanel";
import Button from "../../components/Button/Button";

import { properties } from "../../data/properties";

type VideoWalkthroughProps = {
  propertyId?: number;
  onBack?: () => void;
};

function VideoWalkthrough({ propertyId = 1, onBack }: VideoWalkthroughProps) {
  const property = properties.find((p) => p.id === propertyId) ?? properties[0];

  return (
    <div className="min-h-screen bg-white pb-36">

      {/* Header */}
      <PageHeader
        title="Video Walkthrough"
        subtitle={property.name}
        onBack={onBack}
        rightAction={
          <button
            aria-label="Share"
            className="flex h-10 w-10 items-center justify-center text-gray-700"
          >
            <Share2 size={20} />
          </button>
        }
      />

      {/* Video */}
      <div className="mt-4">
        <VideoPreview thumbnail={property.image} duration={property.videoDuration} />
      </div>

      <div className="mt-5 flex flex-col gap-5 px-4">

        {/* Title and Price */}
        <PropertyOverview
          name={property.name}
          location={property.location}
          address={property.address}
          price={property.price}
          serviceCharge={property.serviceCharge}
          verified={property.verified}
        />

        {/* Bed, Bath, Size and Type */}
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

        {/* Trust Score */}
        <TrustScorePanel
          trustScore={property.trustScore}
          water={property.water}
          power={property.power}
          security={property.security}
          road={property.road}
        />

      </div>

      {/* Bottom Action */}
      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-gray-100 bg-white px-4 py-3">
        <Button variant="primary" className="w-full">
          Unlock Contact - {property.unlockPrice}
        </Button>
      </div>

    </div>
  );
}

export default VideoWalkthrough;
