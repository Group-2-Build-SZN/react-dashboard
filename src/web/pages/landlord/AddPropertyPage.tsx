import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ImageIcon, Video as VideoIcon, Pencil } from "lucide-react";
import { LandlordLayout } from "../../components/landlord/LandlordLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import {
  createProperty,
  uploadPropertyMedia,
  publishProperty,
} from "../../../api/properties";
import { propertyTypeLabel } from "../../../api/adapters";

const PROPERTY_TYPES = [
  "self_contained",
  "single_room",
  "one_bedroom_flat",
  "two_bedroom_flat",
  "three_bedroom_flat",
  "duplex",
  "bungalow",
  "shared_apartment",
];

export function AddPropertyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState<"rent" | "sale">("rent");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  const canContinueStep1 =
    title.trim() !== "" && propertyType !== "" && price.trim() !== "" && address.trim() !== "";

  async function handleCreateDraft() {
    setError(null);
    setIsSubmitting(true);
    try {
      const created = await createProperty({
        listingTitle: title.trim(),
        listingPurpose: listingType,
        description: description.trim() || undefined,
        propertyType,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        price: Number(price),
        address: address.trim(),
        latitude: null,
        longitude: null,
      });
      setPropertyId(created.id);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save property details");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUploadMedia() {
    if (!propertyId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      if (photoFiles.length > 0 || videoFiles.length > 0) {
        const formData = new FormData();
        photoFiles.forEach((f) => formData.append("photos", f));
        videoFiles.forEach((f) => formData.append("videos", f));
        await uploadPropertyMedia(propertyId, formData);
      }
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't upload photos/videos");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublish() {
    if (!propertyId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await publishProperty(propertyId);
      navigate("/landlord/properties");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't publish this listing");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LandlordLayout>
      {step === 1 && (
        <>
          <h1 className="text-h2 font-bold text-neutral">Add New Property</h1>
          <p className="mt-1 text-body text-neutral-500">Lets start with the basic information</p>

          <div className="mt-6 flex max-w-2xl flex-col gap-5">
            <Input
              id="title"
              label="Property Title"
              placeholder="e.g spacious 2 bedroom apartment in enugu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-body font-medium text-neutral">
                  Property Type<span className="text-error">*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-body text-neutral"
                >
                  <option value="">Select property type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {propertyTypeLabel(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-body font-medium text-neutral">
                  Listing Type<span className="text-error">*</span>
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as "rent" | "sale")}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-body text-neutral"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>

            <Input
              id="address"
              label="Location / Address"
              placeholder="e.g 123 Nza Street, Independence Layout, Enugu"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                id="price"
                label="Price (₦)"
                type="number"
                placeholder="eg. 1230576"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <Input
                id="bedrooms"
                label="Bedrooms"
                type="number"
                placeholder="Select"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>

            <Input
              id="bathrooms"
              label="Bathrooms"
              type="number"
              placeholder="Select"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            />

            <div>
              <label className="mb-1.5 block text-body font-medium text-neutral">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-body text-neutral"
                placeholder="Describe this property"
              />
            </div>

            {error && <p className="text-small text-error">{error}</p>}

            <div className="flex justify-end">
              <Button
                onClick={handleCreateDraft}
                disabled={!canContinueStep1 || isSubmitting}
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                {isSubmitting ? "Saving…" : "Continue"}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-h2 font-bold text-neutral">Add Photos & Videos</h1>
          <p className="mt-1 text-body text-neutral-500">
            High quality videos get more views and inquiries
          </p>

          <div className="mt-6 max-w-2xl">
            <p className="mb-2 text-body font-medium text-neutral">
              Photos<span className="text-error">*</span>
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 py-10 text-center">
              <ImageIcon size={22} className="text-neutral-400" />
              <p className="mt-2 text-body text-neutral-500">Drag & drop photo here</p>
              <p className="mt-1 text-small text-neutral-400">or</p>
              <span className="mt-2 rounded-lg border border-neutral-300 px-4 py-1.5 text-small font-medium text-neutral-700">
                Choose Files
              </span>
              <p className="mt-2 text-caption text-neutral-400">
                JPG, PNG, up to 10MB each. Max 20 photos.
              </p>
              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
                className="hidden"
                onChange={(e) => setPhotoFiles(Array.from(e.target.files ?? []))}
              />
            </label>
            {photoFiles.length > 0 && (
              <p className="mt-2 text-small text-neutral-500">{photoFiles.length} photo(s) selected</p>
            )}

            <p className="mb-2 mt-6 text-body font-medium text-neutral">
              Video Walkthrough (Recommended)
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 py-10 text-center">
              <VideoIcon size={22} className="text-neutral-400" />
              <span className="mt-2 rounded-lg border border-neutral-300 px-4 py-1.5 text-small font-medium text-neutral-700">
                Choose Files
              </span>
              <p className="mt-2 text-caption text-neutral-400">MP4, MOV up to 200MB.</p>
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                multiple
                className="hidden"
                onChange={(e) => setVideoFiles(Array.from(e.target.files ?? []))}
              />
            </label>
            {videoFiles.length > 0 && (
              <p className="mt-2 text-small text-neutral-500">{videoFiles.length} video(s) selected</p>
            )}

            {error && <p className="mt-3 text-small text-error">{error}</p>}

            <div className="mt-6 flex justify-between">
              <Button variant="outline" icon={<ArrowLeft size={18} />} onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleUploadMedia}
                disabled={isSubmitting}
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                {isSubmitting ? "Uploading…" : "Continue"}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-h2 font-bold text-neutral">Review Your Listing</h1>
          <p className="mt-1 text-body text-neutral-500">
            Please review your property details before publishing
          </p>

          <div className="mt-6 max-w-3xl">
            <p className="mb-2 text-body font-semibold text-neutral">Property Review</p>
            <div className="flex gap-4 rounded-2xl border border-neutral-200 p-4">
              <div className="h-32 w-40 flex-shrink-0 rounded-xl bg-neutral-100" />
              <div>
                <h3 className="text-h4 font-semibold text-neutral">{title}</h3>
                <p className="text-small text-neutral-500">{address}</p>
                <p className="mt-1 text-caption uppercase text-neutral-400">
                  {listingType === "rent" ? "For Rent" : "For Sale"}
                </p>
                <p className="mt-1 text-h4 font-bold text-primary">
                  ₦{Number(price || 0).toLocaleString()}
                  <span className="text-small font-normal text-neutral-500">/year</span>
                </p>
                <div className="mt-2 flex gap-4 text-small text-neutral-500">
                  {bedrooms && <span>{bedrooms} Bedrooms</span>}
                  {bathrooms && <span>{bathrooms} Bathrooms</span>}
                  <span>{propertyTypeLabel(propertyType)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-small text-neutral-400">Description</p>
                  <p className="text-body text-neutral">{description || "—"}</p>
                </div>
                <button onClick={() => setStep(1)} aria-label="Edit description">
                  <Pencil size={16} className="text-neutral-400" />
                </button>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-small text-neutral-400">Location</p>
                  <p className="text-body text-neutral">{address}</p>
                </div>
                <button onClick={() => setStep(1)} aria-label="Edit location">
                  <Pencil size={16} className="text-neutral-400" />
                </button>
              </div>
            </div>

            {error && <p className="mt-3 text-small text-error">{error}</p>}

            <div className="mt-6 flex justify-between">
              <Button variant="outline" icon={<ArrowLeft size={18} />} onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handlePublish} disabled={isSubmitting}>
                {isSubmitting ? "Publishing…" : "Publish Listing"}
              </Button>
            </div>
          </div>
        </>
      )}
    </LandlordLayout>
  );
}
