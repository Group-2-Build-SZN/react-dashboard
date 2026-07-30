import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="max-w-xl rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-h4 font-bold text-neutral">Change Password</h2>

        <div className="mt-6 flex flex-col gap-5">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter current password"
          />
          <Input type="password" label="New Password" placeholder="Enter new password" />
          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button>Update Password</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
