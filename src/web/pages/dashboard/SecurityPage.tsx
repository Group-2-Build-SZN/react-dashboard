import { useState } from "react";
import { SettingsLayout } from "../../components/dashboard/SettingsLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../lib/AuthContext";

export function SecurityPage() {
  const { user } = useAuth();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (user?.email && currentEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      setNotice("That doesn't match the email on your account.");
      return;
    }

    setNotice("Email changes aren't supported yet — email support@myulo.com and our team will update it for you.");
  }

  function handleCancel() {
    setCurrentEmail("");
    setNewEmail("");
    setNotice(null);
  }

  return (
    <SettingsLayout>
      <form onSubmit={handleSubmit} className="max-w-xl rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-h4 font-bold text-neutral">Change Email</h2>

        <div className="mt-6 flex flex-col gap-5">
          <Input
            label="Current Email"
            type="email"
            placeholder="Enter current email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
          <Input
            label="New Email"
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        {notice && <p className="mt-4 text-small text-neutral-600">{notice}</p>}

        <div className="mt-6 flex gap-3">
          <Button type="submit">Update email</Button>
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </SettingsLayout>
  );
}
