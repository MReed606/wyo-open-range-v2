type AdminMetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
};

export function AdminMetricCard({
  title,
  value,
  icon,
  color,
}: AdminMetricCardProps) {

  return (

    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <div className="text-sm font-bold text-[#6B7280]">

            {title}

          </div>

          <div className="mt-3 text-4xl font-black text-[#111827]">

            {value}

          </div>

        </div>

        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}>

          {icon}

        </div>

      </div>

    </div>

  );
}