export async function submitRawScoreToApi(userId, { score, duration, levelId, levelTitle, timestamp }) {
  if (!userId) {
    console.warn("No userId provided; skipping score submit.");
    return;
  }

  const payload = {
    UserId: String(userId),
    Score: score,
    Timestamp: timestamp || new Date().toISOString(),
    GameName: "Food Treasure",
    Level: `Stage ${levelId} - ${levelTitle}`,
    Duration: duration, // "HH:MM:SS"
    Source: "Linked",
  };

  const res = await fetch(
    "https://activehealth.dev.bio-streams.eu/api/seriousgames/scores/submit-raw-score",
    {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        JsonPayload: JSON.stringify(payload),
      }),
    }
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Score submit failed (${res.status}): ${txt}`);
  }

  // Some APIs return empty body; be tolerant
  const text = await res.text().catch(() => "");
  return text;
}
