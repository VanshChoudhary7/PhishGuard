"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { label: "Detection Accuracy", value: 98, suffix: "%" },
  { label: "Response Time", value: 120, suffix: "ms" },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1600
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.floor(eased * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl border border-border p-6 text-center"
          >
            <p className="text-3xl font-bold text-primary sm:text-4xl">
              <Counter target={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
