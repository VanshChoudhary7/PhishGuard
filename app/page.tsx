import { Navbar } from "@/components/navbar"
import { Analyzer } from "@/components/analyzer"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Stats } from "@/components/stats"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { ToastProvider } from "@/components/toast"

export default function Page() {
  return (
    <ToastProvider>
      <Navbar />
      <main>
        <Analyzer />
        <Features />
        <HowItWorks />
        <Stats />
        <About />
      </main>
      <Footer />
    </ToastProvider>
  )
}
