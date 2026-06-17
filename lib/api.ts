const BACKEND_URL = "http://localhost:5000";

export interface CheckResult {
  url: string;
  result: "phishing" | "legitimate" | "unknown";
  confidence: number;
}

export async function checkURL(url: string): Promise<CheckResult> {
  const res = await fetch(`${BACKEND_URL}/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
}