import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { Button } from "../../components/ui/Button";

const fields = [
  {
    label: "Language",
    key: "language",
    options: ["English (US)", "French", "Igbo", "Yoruba", "Hausa"],
  },
  {
    label: "Timezone",
    key: "timezone",
    options: ["GMT+1 (Lagos)", "GMT+0 (London)", "GMT-5 (New York)"],
  },
  {
    label: "Date Format",
    key: "dateFormat",
    options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
  },
];

export function AccountPage() {
  const [values, setValues] = useState({
    language: "English (US)",
    timezone: "GMT+1 (Lagos)",
    dateFormat: "DD/MM/YYYY",
  });

  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-h4 font-bold text-neutral">Account Preferences</h2>

        <div className="mt-6 flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-small font-medium text-neutral">
                {field.label}
              </label>
              <div className="relative">
                <select
                  value={values[field.key as keyof typeof values]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.key]: e.target.value }))
                  }
                  className="w-full appearance-none rounded-lg border border-neutral-300 px-4 py-2.5 pr-10 text-body text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
