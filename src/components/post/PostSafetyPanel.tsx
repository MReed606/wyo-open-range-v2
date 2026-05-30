import {
  Shield,
  AlertTriangle,
} from "lucide-react";

type Props = {
  riskScore: number;
  riskFlags: string[];
  duplicateWarning: boolean;
  trustLevel: {
    label: string;
    color: string;
  };
};

export function PostSafetyPanel({
  riskScore,
  riskFlags,
  duplicateWarning,
  trustLevel,
}: Props) {

  return (

    <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">

      <div className="flex flex-wrap items-center justify-between gap-5">

        <div>

          <div className="mb-4 flex items-center gap-3">

            <Shield className="h-7 w-7 text-[#2F5D50]" />

            <h2 className="text-3xl font-black text-[#111827]">

              Marketplace Trust Analysis

            </h2>

          </div>

          <div className="text-[#6B7280]">

            AI-powered listing safety evaluation.

          </div>

        </div>

        <div className={`rounded-full px-5 py-3 text-sm font-black ${trustLevel.color}`}>

          {trustLevel.label}

        </div>

      </div>

      <div className="mt-8">

        <div className="mb-3 flex items-center justify-between">

          <div className="font-black text-[#111827]">

            Risk Score

          </div>

          <div className="font-black text-[#111827]">

            {riskScore}/100

          </div>

        </div>

        <div className="h-4 overflow-hidden rounded-full bg-gray-200">

          <div
            className={`h-full transition-all ${
              riskScore >= 50
                ? "bg-red-500"
                : riskScore >= 25
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{
              width: `${riskScore}%`
            }}
          />

        </div>

      </div>

      {!!riskFlags.length && (

        <div className="mt-8 space-y-3">

          {riskFlags.map(
            (flag, i) => (

            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-700"
            >

              <AlertTriangle className="h-5 w-5" />

              {flag}

            </div>

          ))}

        </div>

      )}

      {duplicateWarning && (

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-sm font-bold text-red-700">

          <AlertTriangle className="h-5 w-5" />

          Similar listings already exist.
          Duplicate or spam listings may reduce visibility.

        </div>

      )}

    </div>

  );
}
