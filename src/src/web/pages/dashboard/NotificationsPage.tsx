import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { cn } from "../../lib/utils";

const initialEmail = [
  { key: "newListings", label: "New Listings", description: "Get notified when new properties are listed", on: false },
  { key: "priceChanges", label: "Price Changes", description: "Get notified when property prices are updated", on: true },
  { key: "comments", label: "Comments", description: "Notification for new comments on saved properties", on: false },
];

const initialPush = [
  { key: "newListings", label: "New Listings", description: "Push notifications when new properties are listed", on: false },
  { key: "priceChanges", label: "Price Changes", description: "Push notifications when property prices are updated", on: true },
  { key: "comments", label: "Comments", description: "Push notifications for new comments on saved properties", on: true },
  { key: "reminders", label: "Reminders", description: "Push notifications for site visitations", on: false },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-primary" : "bg-neutral-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function NotificationGroup({
  title,
  items,
  toggle,
}: {
  title: string;
  items: typeof initialEmail;
  toggle: (key: string) => void;
}) {
  return (
    <div>
      <h3 className="text-h4 font-bold text-neutral">{title}</h3>
      <hr className="my-3 border-neutral-200" />
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.key} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-body font-semibold text-neutral">{item.label}</p>
              <p className="text-small text-neutral-500">{item.description}</p>
            </div>
            <Toggle on={item.on} onClick={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsPage() {
  const [email, setEmail] = useState(initialEmail);
  const [push, setPush] = useState(initialPush);

  function toggleEmail(key: string) {
    setEmail((items) =>
      items.map((i) => (i.key === key ? { ...i, on: !i.on } : i))
    );
  }

  function togglePush(key: string) {
    setPush((items) =>
      items.map((i) => (i.key === key ? { ...i, on: !i.on } : i))
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl rounded-2xl border border-neutral-200 p-6">
        <NotificationGroup title="Email Notifications" items={email} toggle={toggleEmail} />
        <div className="mt-8">
          <NotificationGroup title="Push Notifications" items={push} toggle={togglePush} />
        </div>
      </div>
    </DashboardLayout>
  );
}
