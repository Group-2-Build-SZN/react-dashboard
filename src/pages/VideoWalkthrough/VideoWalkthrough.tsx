import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

import PageHeader from "../../components/PageHeader/PageHeader";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import PropertyOverview from "../../components/PropertyOverview/PropertyOverview";
import PropertySpecs from "../../components/PropertySpecs/PropertySpecs";
import AboutSection from "../../components/AboutSection/AboutSection";
import AmenitiesGrid from "../../components/AmenitiesGrid/AmenitiesGrid";
import TrustScorePanel from "../../components/TrustScorePanel/TrustScorePanel";
import Button from "../../components/Button/Button";

import { getProperty } from "../../api/properties";
import { apiPropertyToProperty, scoreLabel, propertyTypeLabel, featureLabel } from "../../api/adapters";
import type { Property } from "../../types";
import { UNLOCK_FEE_NGN } from "../../types";

type VideoWalkthroughProps = {
  propertyId?: string;
  onBack?: () => void;
  onUnlockContact?: (propertyId: string) => void;
};

function VideoWalkthrough({ propertyId, onBack, onUnlockContact }: VideoWalkthroughProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  async function handleShare() {
    const shareUrl = `${window.location.origin}/property/${propertyId}`;
    const shareData = {
      title: property?.listingTitle ?? 'Check out this property on My Ulo',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the native share sheet — not an error
      }
      return;
    }

    // No Web Share API (most desktop browsers) — fall back to clipboard.
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  }

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
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <p className="text-sm text-error-600">{error ?? "Property not found"}</p>
        <Button variant="outline" onClick={onBack}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">

      <PageHeader
        title="Video Walkthrough"
        subtitle={property.listingTitle}
        onBack={onBack}
        rightAction={
          <button
            aria-label="Share"
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center text-gray-700"
          >
            <Share2 size={20} />
          </button>
        }
      />

      {linkCopied && (
        <p className="mt-2 text-center text-sm font-medium text-primary-800">Link copied to clipboard</p>
      )}

      <div className="mt-4">
        <VideoPreview
          thumbnail={property.videoUrls[0] ?? property.coverImageUrl}
          duration="—" // no video-duration field in the API
        />
      </div>

      <div className="mt-5 flex flex-col gap-5 px-4">

        <PropertyOverview
          name={property.listingTitle}
          location={property.neighborhood}
          address={property.address}
          price={`₦${property.price.toLocaleString('en-NG')}`}
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

        <TrustScorePanel
          trustScore={property.trustScore}
          water={scoreLabel(property.waterScore)}
          power={scoreLabel(property.powerScore)}
          security={scoreLabel(property.securityScore)}
          road={scoreLabel(property.roadScore)}
        />

      </div>

      <div className="sticky bottom-0 mx-auto mt-6 w-full max-w-md flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3">
        <Button variant="primary" className="w-full" onClick={() => onUnlockContact?.(property.id)}>
          Unlock Contact - ₦{UNLOCK_FEE_NGN.toLocaleString('en-NG')}
        </Button>
      </div>

    </div>
  );
}

export default VideoWalkthrough;
