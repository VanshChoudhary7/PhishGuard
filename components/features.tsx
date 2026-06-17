import {
  BrainCircuit,
  Radar,
  Zap,
  ShieldCheck,
  ListTree,
  FileSearch,
} from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "Machine Learning Detection",
    desc: "Trained classification models flag malicious patterns with high accuracy.",
  },
  {
    icon: Radar,
    title: "Real-Time URL Analysis",
    desc: "Submit any URL and get an instant verdict on its safety.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    desc: "Feature extraction and inference run in milliseconds.",
  },
  {
    icon: ShieldCheck,
    title: "Security Focused",
    desc: "Built around modern threat-intelligence best practices.",
  },
  {
    icon: ListTree,
    title: "Threat Classification",
    desc: "Categorizes sites as safe, suspicious, or phishing.",
  },
  {
    icon: FileSearch,
    title: "Detailed Risk Assessment",
    desc: "Transparent risk scores and confidence breakdowns.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Powerful Detection Features
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Everything you need to evaluate the trustworthiness of a website in one place.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass group rounded-2xl border border-border p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
