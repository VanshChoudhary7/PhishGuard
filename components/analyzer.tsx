"use client"

import { useState } from "react"
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Search, Loader2 } from "lucide-react"
import { useToast } from "@/components/toast"

type Prediction = "Safe" | "Suspicious" | "Phishing"
type Result = {
  prediction: Prediction
  confidence: number
  risk_score: number
  domain: string
}

const config: Record<
  Prediction,
  { icon: typeof ShieldCheck; label: string; color: string; bg: string; ring: string }
> = {
  Safe: {
    icon: ShieldCheck,
    label: "Safe Website",
    color: "text-accent",
    bg: "bg-accent/10",
    ring: "ring-accent/30",
  },
  Suspicious: {
    icon: ShieldAlert,
    label: "Suspicious Website",
    color: "text-[oklch(0.8_0.15_85)]",
    bg: "bg-[oklch(0.8_0.15_85)]/10",
    ring: "ring-[oklch(0.8_0.15_85)]/30",
  },
  Phishing: {
    icon: ShieldX,
    label: "Phishing Website Detected",
    color: "text-destructive",
    bg: "bg-destructive/10",
    ring: "ring-destructive/30",
  },
}

function Gauge({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-32">
        <svg className="size-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--secondary)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{value}%</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function getDomain(url: string) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname
  } catch {
    return url
  }
}

export function Analyzer() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const { toast } = useToast()

  async function analyze(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) {
      toast("Please enter a URL to analyze.", "error")
      return
    }
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("http://localhost:5000/api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      // Map Flask response → your Result type
      const prediction: Prediction =
        data.result === "phishing" ? "Phishing" :
        data.result === "suspicious" ? "Suspicious" : "Safe"

      const risk_score =
        prediction === "Phishing" ? Math.round(data.confidence ?? 85) :
        prediction === "Suspicious" ? Math.round((data.confidence ?? 50) * 0.6) :
        Math.round(100 - (data.confidence ?? 90))

      const res: Result = {
        prediction,
        confidence: Math.round(data.confidence ?? 80),
        risk_score: Math.min(99, risk_score),
        domain: getDomain(url),
      }

      setResult(res)
      toast(
        prediction === "Safe"
          ? "Analysis complete — this site looks safe."
          : `Analysis complete — ${prediction.toLowerCase()} detected.`,
        prediction === "Phishing" ? "error" : "success"
      )
    } catch (err) {
      toast("❌ Could not connect to backend. Make sure Flask server is running on port 5000.", "error")
    }

    setLoading(false)
  }

  const cfg = result ? config[result.prediction] : null
  const ResultIcon = cfg?.icon ?? Shield

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs text-muted-foreground">
          <span className="size-2 animate-pulse rounded-full bg-accent" />
          AI-Powered Threat Detection
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Detect Phishing Websites Before They Harm You
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          AI-powered URL analysis using Machine Learning to identify malicious and fraudulent
          websites.
        </p>

        <form
          onSubmit={analyze}
          className="glass mx-auto mt-10 flex flex-col gap-3 rounded-2xl border border-border p-3 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-input/40 px-4">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Analyzing
              </>
            ) : (
              "Analyze"
            )}
          </button>
        </form>
      </div>

      {/* Result */}
      {(loading || result) && (
        <div className="relative mx-auto mt-12 max-w-3xl px-6">
          {loading && (
            <div className="glass flex flex-col items-center gap-4 rounded-2xl border border-border p-10">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Extracting URL features and running the model...
              </p>
            </div>
          )}

          {result && cfg && (
            <div className="glass overflow-hidden rounded-2xl border border-border duration-500 animate-in fade-in slide-in-from-bottom-4">
              <div className={`flex flex-col items-center gap-3 p-8 ${cfg.bg}`}>
                <span className={`flex size-16 items-center justify-center rounded-full ${cfg.bg} ring-2 ${cfg.ring}`}>
                  <ResultIcon className={`size-8 ${cfg.color}`} />
                </span>
                <h3 className={`text-xl font-semibold ${cfg.color}`}>{cfg.label}</h3>
                <p className="text-sm text-muted-foreground">
                  Confidence: <span className="font-semibold text-foreground">{result.confidence}%</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
                {[
                  { label: "Domain Name", value: result.domain },
                  { label: "Risk Score", value: `${result.risk_score}/100` },
                  { label: "Prediction Result", value: result.prediction },
                ].map((row) => (
                  <div key={row.label} className="bg-card p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</p>
                    <p className="mt-1 truncate font-semibold text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-border p-8 sm:grid-cols-3">
                <Gauge value={result.risk_score} label="Threat Score" color="var(--destructive)" />
                <Gauge
                  value={result.risk_score}
                  label="Risk Percentage"
                  color="oklch(0.8 0.15 85)"
                />
                <Gauge value={result.confidence} label="Detection Confidence" color="var(--primary)" />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}