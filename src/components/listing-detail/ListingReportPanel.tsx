type ListingReportPanelProps = {
  reportReason: string;
  reportSubmitted: boolean;
  onReportReasonChange: (value: string) => void;
  onSubmitReport: () => void;
};

export function ListingReportPanel({
  reportReason,
  reportSubmitted,
  onReportReasonChange,
  onSubmitReport,
}: ListingReportPanelProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-[#111827]">
        Report Listing
      </h2>

      <textarea
        value={reportReason}
        onChange={(e) => onReportReasonChange(e.target.value)}
        placeholder="Describe the issue..."
        className="mt-5 min-h-40 w-full rounded-2xl border border-gray-300 px-5 py-4"
      />

      <button
        onClick={onSubmitReport}
        className="mt-5 w-full rounded-2xl bg-red-600 px-6 py-4 text-lg font-black text-white transition hover:bg-red-700"
      >
        Submit Report
      </button>

      {reportSubmitted && (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          Report submitted successfully.
        </div>
      )}
    </div>
  );
}
