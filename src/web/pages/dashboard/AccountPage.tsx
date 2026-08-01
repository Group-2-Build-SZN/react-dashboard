import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SettingsLayout } from "../../components/dashboard/SettingsLayout";
import { Button } from "../../components/ui/Button";

const LANGUAGES = ["English (US)", "English (UK)"];
const TIMEZONES = ["GMT+1 (Lagos)", "GMT (London)", "GMT-5 (New York)"];
const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

const STORAGE_KEY = "myulo:account-preferences";

function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { language: LANGUAGES[0], timezone: TIMEZONES[0], dateFormat: DATE_FORMATS[0] };
    return JSON.parse(raw);
  } catch {
    return { language: LANGUAGES[0], timezone: TIMEZONES[0], dateFormat: DATE_FORMATS[0] };
  }
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-body font-semibold text-neutral">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-body text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  );
}

export function AccountPage() {
  const saved = loadPreferences();
  const [language, setLanguage] = useState(saved.language);
  const [timezone, setTimezone] = useState(saved.timezone);
  const [dateFormat, setDateFormat] = useState(saved.dateFormat);
  const [saved_, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, timezone, dateFormat }));
    setSaved(true);
  }

  function handleCancel() {
    const prefs = loadPreferences();
    setLanguage(prefs.language);
    setTimezone(prefs.timezone);
    setDateFormat(prefs.dateFormat);
    setSaved(false);
  }

  return (
    <SettingsLayout>
      <div className="max-w-xl rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-h4 font-bold text-neutral">Account Preferences</h2>

        <div className="mt-6 flex flex-col gap-5">
          <Select label="Language" value={language} options={LANGUAGES} onChange={setLanguage} />
          <Select label="Timezone" value={timezone} options={TIMEZONES} onChange={setTimezone} />
          <Select label="Date Format" value={dateFormat} options={DATE_FORMATS} onChange={setDateFormat} />
        </div>

        {saved_ && <p className="mt-4 text-small text-secondary-700">Preferences saved on this device.</p>}

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </SettingsLayout>
  );
}
