import { ShieldCheck } from "lucide-react"

export function About() {
  return (
    <section id="about" className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <ShieldCheck className="size-7" />
        </span>
        <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          About The Project
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          This project uses machine learning algorithms and URL feature extraction techniques to
          identify phishing websites and protect users from cyber threats. It is designed as a
          lightweight, extensible frontend ready to connect with a Flask backend API for real-time
          predictions.
        </p>
      </div>
    </section>
  )
}
