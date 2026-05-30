import {
  supabase
} from "@/lib/supabase";

export type PostSafetyResult = {
  riskScore: number;
  riskFlags: string[];
  duplicateWarning: boolean;
};

export type TrustLevel = {
  label: string;
  color: string;
};

export async function analyzePostSafety({
  title,
  description,
  price,
}: {
  title: string;
  description: string;
  price: string;
}): Promise<PostSafetyResult> {
  const flags: string[] = [];

  let score = 0;

  let duplicateWarning = false;

  const combined =
    `
      ${title}
      ${description}
    `.toLowerCase();

  const suspiciousWords = [
    "wire transfer",
    "western union",
    "gift cards",
    "crypto only",
    "text me only",
    "whatsapp",
    "telegram",
    "urgent sale",
    "guaranteed profit",
  ];

  suspiciousWords.forEach((word) => {
    if (combined.includes(word)) {
      score += 25;
      flags.push(`Suspicious phrase detected: "${word}"`);
    }
  });

  const numericPrice =
    Number(
      price.replace(
        /[^0-9.]/g,
        ""
      )
    );

  if (
    numericPrice > 0 &&
    numericPrice < 10
  ) {
    score += 15;
    flags.push("Unusually low price detected");
  }

  const upperCount =
    (
      title.match(
        /[A-Z]/g
      ) || []
    ).length;

  if (upperCount > 15) {
    score += 10;
    flags.push("Excessive capital letters");
  }

  if (title.trim().length > 5) {
    const {
      data: similarListings
    } =
      await supabase
        .from("listings")
        .select("id, title")
        .ilike(
          "title",
          `%${title.trim()}%`
        )
        .limit(3);

    if (
      similarListings &&
      similarListings.length > 0
    ) {
      score += 20;
      duplicateWarning = true;
    }
  }

  return {
    riskScore: score,
    riskFlags: flags,
    duplicateWarning,
  };
}

export function getTrustLevel(
  riskScore: number
): TrustLevel {
  if (riskScore >= 50) {
    return {
      label: "High Risk",
      color: "bg-red-100 text-red-700",
    };
  }

  if (riskScore >= 25) {
    return {
      label: "Moderate Risk",
      color: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "Trusted Listing",
    color: "bg-green-100 text-green-700",
  };
}
