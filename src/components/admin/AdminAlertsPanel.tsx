import {
  Activity
} from "lucide-react";

type Props = {
  alerts: any[];
};

export function AdminAlertsPanel({
  alerts,
}: Props) {
  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <Activity className="h-7 w-7 text-[#2F5D50]" />

        <h2 className="text-3xl font-black text-[#111827]">
          Live Safety Alerts
        </h2>
      </div>

      {!alerts.length && (
        <div className="rounded-2xl bg-[#F7F5F2] p-8 text-center text-[#6B7280]">
          No alerts at this time.
        </div>
      )}

      <div className="space-y-5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-2xl bg-[#F7F5F2] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <h3 className="text-xl font-black text-[#111827]">
                  {alert.title}
                </h3>

                <p className="mt-3 text-[#374151]">
                  {alert.message}
                </p>
              </div>

              <div className="rounded-full bg-[#2F5D50]/10 px-4 py-2 text-xs font-black text-[#2F5D50]">
                {alert.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
