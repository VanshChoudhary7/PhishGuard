import { Link2, ScanLine, BrainCircuit, BarChart3 } from "lucide-react"

const steps = [
  { icon: Link2, title: "User Enters URL", desc: "Paste any website link into the analyzer." },
  { icon: ScanLine, title: "Features Extracted", desc: "Key URL signals are parsed and structured." },
  { icon: BrainCircuit, title: "ML Model Analyzes", desc: "The model evaluates risk against learned patterns." },
  { icon: BarChart3, title: "Prediction Displayed", desc: "A clear verdict with confidence is shown." },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-secondary/20">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From URL to verdict in four simple steps.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative glass rounded-2xl border border-border p-6">
              <span className="absolute right-5 top-5 text-4xl font-bold text-primary/15">
                {i + 1}
              </span>
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <s.icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
