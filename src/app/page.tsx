import Link from "next/link";
import { CheckCircle2, Kanban, Users, Zap, Shield, BarChart3, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Kanban, title: "Kanban Boards", description: "Visualize your workflow with drag-and-drop task boards. Move tasks between columns as work progresses." },
  { icon: Users, title: "Team Collaboration", description: "Assign tasks to team members, leave comments, and keep everyone aligned on project goals." },
  { icon: Zap, title: "Fast & Lightweight", description: "Built with performance in mind. No bloated dependencies, just the tools you need to get work done." },
  { icon: Shield, title: "Secure by Default", description: "Authentication, data validation, and secure sessions protect your project data at every level." },
  { icon: BarChart3, title: "Progress Tracking", description: "See project status at a glance with task counts, completion rates, and priority indicators." },
  { icon: CheckCircle2, title: "Priority Management", description: "Tag tasks with priority levels and filter to focus on what matters most for your deadlines." },
];

const pricingPlans = [
  { name: "Starter", price: "$0", period: "forever", description: "For individuals and small side projects", features: ["Up to 3 projects", "Basic Kanban boards", "Task management", "Personal dashboard"], cta: "Get Started Free", highlighted: false },
  { name: "Pro", price: "$12", period: "per user / month", description: "For growing teams that need more power", features: ["Unlimited projects", "Advanced Kanban boards", "Team collaboration", "Priority support", "Custom fields", "File attachments"], cta: "Start Free Trial", highlighted: true },
  { name: "Enterprise", price: "$39", period: "per user / month", description: "For organizations with advanced needs", features: ["Everything in Pro", "SSO authentication", "Audit logs", "API access", "Custom integrations", "Dedicated support"], cta: "Contact Sales", highlighted: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav: glassmorphism, no borders ── */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
                <Kanban className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">PlanForge</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link href="/register"><Button size="sm">Get Started</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero: extreme negative space, gradient text ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-background to-teal-50/40" />
        {/* Decorative blurred orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-32 sm:pb-40">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary rounded-full px-5 py-2 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />Portfolio Demo
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display mb-8 leading-[1.1]">
              Project management{" "}
              <span className="text-gradient">made simple</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop juggling spreadsheets and sticky notes. PlanForge gives your team a clear view of every project, every task, and every deadline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-base px-8 shadow-lg shadow-primary/25">
                  Start Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-base px-8">View Demo</Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">No credit card required. Free forever for small teams.</p>
          </div>

          {/* ── Feature Float: overlapping cards that break the grid ── */}
          <div className="mt-20 sm:mt-24 max-w-5xl mx-auto relative">
            {/* Main board card */}
            <div className="rounded-2xl ghost-border bg-card/70 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden">
              <div className="bg-surface-container/50 px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-300/60" />
                <div className="w-3 h-3 rounded-full bg-amber-300/60" />
                <div className="w-3 h-3 rounded-full bg-green-300/60" />
                <div className="ml-4 flex-1 bg-background/60 rounded-lg px-4 py-1.5 text-xs text-muted-foreground">app.planforge.dev/dashboard</div>
              </div>
              <div className="p-8 bg-surface-container/30">
                <div className="grid grid-cols-3 gap-5">
                  {/* To Do column */}
                  <div className="rounded-xl bg-background/60 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground font-display">To Do</h3>
                      <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">5</span>
                    </div>
                    <div className="space-y-3">
                      {["Set up CI/CD pipeline", "Add dark mode", "Write tests"].map((t, i) => (
                        <div key={i} className="p-3.5 bg-card rounded-xl ghost-border text-sm transition-all hover:shadow-md">
                          <p className="font-medium text-foreground">{t}</p>
                          <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Medium</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* In Progress column */}
                  <div className="rounded-xl bg-primary/[0.03] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-primary font-display">In Progress</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">3</span>
                    </div>
                    <div className="space-y-3">
                      {["Build hero section", "Create pricing page"].map((t, i) => (
                        <div key={i} className="p-3.5 bg-card rounded-xl ghost-border text-sm transition-all hover:shadow-md">
                          <p className="font-medium text-foreground">{t}</p>
                          <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">High</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Done column */}
                  <div className="rounded-xl bg-secondary/[0.04] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-secondary font-display">Done</h3>
                      <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-1 rounded-full">2</span>
                    </div>
                    <div className="space-y-3">
                      {["Design homepage", "Implement navigation"].map((t, i) => (
                        <div key={i} className="p-3.5 bg-card rounded-xl ghost-border text-sm transition-all hover:shadow-md">
                          <p className="font-medium text-foreground/50 line-through">{t}</p>
                          <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Complete</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Float overlapping cards */}
            <div className="absolute -bottom-8 -left-6 animate-float-up">
              <div className="glass-card rounded-xl ghost-border shadow-lg px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-display">87% Complete</p>
                    <p className="text-xs text-muted-foreground">Sprint velocity up 23%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-4 animate-float-delayed">
              <div className="glass-card rounded-xl ghost-border shadow-lg px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-display">5 Active</p>
                    <p className="text-xs text-muted-foreground">Team members online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features: extreme negative space, tonal surfaces ── */}
      <section id="features" className="py-32 sm:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display mb-6">Everything you need to ship faster</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">PlanForge comes packed with the features your team needs to stay organized and deliver on time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-8 rounded-xl bg-card ghost-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold font-display mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing: tonal shift bg, no hard borders ── */}
      <section id="pricing" className="py-32 sm:py-40 bg-surface-container/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display mb-6">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Start free. Upgrade when you need more. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 bg-card transition-all duration-300 ${plan.highlighted ? "ghost-border shadow-xl shadow-primary/10 relative scale-105" : "ghost-border hover:shadow-lg"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-primary text-white text-sm font-medium px-5 py-1.5 rounded-full shadow-md shadow-primary/25">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold font-display">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-extrabold font-display">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                <Link href="/register">
                  <Button className="w-full mb-8" variant={plan.highlighted ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
                <ul className="space-y-3.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA: gradient banner ── */}
      <section className="py-32 sm:py-40 gradient-primary relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display mb-6">Ready to get organized?</h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">Get organized today. PlanForge gives your team a clear view of every project, every task, and every deadline.</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg text-base px-8 rounded-full gradient-primary-none" style={{ background: 'white', color: 'hsl(267 100% 35%)' }}>
              Start Free Today <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer: tonal dark ── */}
      <footer className="bg-foreground/[0.97] text-muted-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                <Kanban className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white font-display">PlanForge</span>
            </div>
            <p className="text-sm text-white/40">Built with Next.js, TypeScript, and Tailwind CSS. A portfolio demo project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
