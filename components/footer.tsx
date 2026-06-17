import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="#home" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Shield className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              PhishGuard <span className="text-primary">AI</span>
            </span>
          </a>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Have questions or want to collaborate? Reach out anytime.
          </p>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PhishGuard AI. Built for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
