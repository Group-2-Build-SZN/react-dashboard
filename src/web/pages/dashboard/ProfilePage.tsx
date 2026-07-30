import { Pencil, Calendar, Bell } from "lucide-react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { Button } from "../../components/ui/Button";
import avatar from "../../assets/images/Ellipse 20.png";

const details = [
  { label: "First Name", value: "John" },
  { label: "Last Name", value: "Doe" },
  { label: "Date of birth", value: "12-02-1999" },
  { label: "Email Address", value: "johndoe@gmail.com" },
  { label: "Phone Number", value: "+2345087498591" },
  { label: "Gender", value: "Male" },
  { label: "City", value: "Enugu" },
  { label: "State", value: "Enugu" },
  { label: "Country", value: "Nigeria" },
];

export function ProfilePage() {
  return (
    <DashboardLayout>
      <div
        className="flex flex-col gap-4 rounded-2xl p-6 text-white sm:flex-row sm:items-center sm:justify-between"
        style={{
          background:
            "linear-gradient(90deg, #1E40AF 7.69%, rgba(30, 64, 175, 0.69) 53.61%, rgba(22, 163, 74, 0.22) 99.52%)",
        }}
      >
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt="John Doe"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-white/50"
          />
          <div>
            <p className="text-h4 font-bold text-white">John Doe</p>
            <p className="mt-1 flex items-center gap-1.5 text-small text-white/80">
              <Calendar size={14} />
              Start Date: 31 Jun 2026
            </p>
          </div>
        </div>
        <Button variant="secondary" icon={<Pencil size={16} />}>
          Edit Profile
        </Button>
      </div>

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

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-primary-50 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
            <Bell size={18} />
          </span>
          <div>
            <p className="text-body font-semibold text-neutral">
              Customize Notification Settings
            </p>
            <p className="text-small text-neutral-500">
              Select your preferred method of receiving notification
            </p>
          </div>
        </div>
        <Button>Manage</Button>
      </div>
    </DashboardLayout>
  );
}
