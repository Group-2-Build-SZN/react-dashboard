import { useRef, useState } from "react";
import { Pencil, Calendar, BellRing, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SettingsLayout } from "../../components/dashboard/SettingsLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../lib/AuthContext";
import { completeProfile, uploadAvatar } from "../../../api/auth";

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startEditing() {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhone(user?.phone || "");
    setError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    setError(null);
    setIsSaving(true);
    try {
      const updated = await completeProfile({
        firstName,
        lastName,
        phone,
        role: user?.role || "tenant",
      });
      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update your details");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(file);
      setUser(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update your photo");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  const details = [
    { label: "First Name", value: user?.firstName || "—" },
    { label: "Last Name", value: user?.lastName || "—" },
    { label: "Email Address", value: user?.email || "—" },
    { label: "Phone Number", value: user?.phone || "—" },
    { label: "Role", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—" },
    { label: "Subscription", value: user?.isPremium ? "Premium" : "Free" },
  ];

  const startDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  return (
    <SettingsLayout>
      <div
        className="flex flex-col gap-4 rounded-2xl p-6 text-white sm:flex-row sm:items-center sm:justify-between"
        style={{
          background:
            "linear-gradient(90deg, #1E40AF 7.69%, rgba(30, 64, 175, 0.69) 53.61%, rgba(22, 163, 74, 0.22) 99.52%)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={user?.avatarUrl}
              alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Your avatar'}
              size={64}
              className="ring-2 ring-white/50"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              aria-label="Change photo"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary shadow"
            >
              <Pencil size={12} />
            </button>
          </div>
          <div>
            <p className="text-h4 font-bold text-white">
              {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'My Ulo user'}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-small text-white/80">
              <Calendar size={14} />
              Member since: {startDate}
            </p>
          </div>
        </div>
        {isEditing ? (
          <Button variant="secondary" icon={<X size={16} />} onClick={() => setIsEditing(false)}>
            Close
          </Button>
        ) : (
          <Button variant="secondary" icon={<Pencil size={16} />} onClick={startEditing}>
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-h4 font-bold text-neutral">Edit Profile Details</h2>

          <div className="mt-5 flex flex-col gap-5 sm:max-w-md">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          {error && <p className="mt-4 text-small text-error">{error}</p>}

          <div className="mt-6 flex gap-3">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-h4 font-bold text-neutral">Profile Details</h2>
          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label}>
                <p className="text-small text-neutral-500">{d.label}</p>
                <p className="mt-1 text-body font-medium text-neutral">
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl p-6 text-white sm:flex-row sm:items-center"
        style={{
          background:
            "linear-gradient(90deg, #1E40AF 7.69%, rgba(30, 64, 175, 0.69) 53.61%, rgba(22, 163, 74, 0.22) 99.52%)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
            <BellRing size={18} />
          </span>
          <div>
            <p className="text-body font-semibold text-white">
              Customize Notification Settings
            </p>
            <p className="text-small text-white/80">
              Select your preferred method of receiving notification
            </p>
          </div>
        </div>
        <Link to="/dashboard/settings/notifications">
          <Button>Manage</Button>
        </Link>
      </div>
    </SettingsLayout>
  );
}
