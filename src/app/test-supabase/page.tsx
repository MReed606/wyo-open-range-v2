import { supabase } from "@/lib/supabase";

export default async function TestSupabasePage() {
  let status = "Connecting...";
  let errorMessage = "";

  try {
    const { error } = await supabase
      .from("test")
      .select("*")
      .limit(1);

    if (error) {
      status = "Supabase Connected";
      errorMessage = error.message;
    } else {
      status = "Supabase Connected";
    }
  } catch (err) {
    status = "Connection Failed";

    if (err instanceof Error) {
      errorMessage = err.message;
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 shadow-md">
        <p className="text-sm font-bold uppercase tracking-wide text-[#2F5D50]">
          Backend Connection Test
        </p>

        <h1 className="mt-4 text-4xl font-bold text-[#1F2933]">
          {status}
        </h1>

        <div className="mt-8 rounded-xl bg-[#F7F5F2] p-5">
          <p className="font-bold text-[#1F2933]">
            Result
          </p>

          <p className="mt-3 break-all text-[#52606D]">
            {errorMessage || "Supabase client initialized successfully."}
          </p>
        </div>
      </div>
    </main>
  );
}
