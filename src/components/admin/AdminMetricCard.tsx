import Link from "next/link";

type AdminMetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  href?: string;
};

export function AdminMetricCard({
  title,
  value,
  icon,
  color,
  href,
}: AdminMetricCardProps) {

  const card = (
    <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

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

  if (href) {

    return (
      <Link href={href}>
        {card}
      </Link>
    );
  }

  return card;
}