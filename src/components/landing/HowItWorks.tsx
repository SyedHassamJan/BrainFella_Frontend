import { UserPlus, ClipboardList, MessageCircle, TrendingUp } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create your account',
    description: 'Sign up in under 2 minutes — no credit card required',
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Take a quick assessment',
    description: 'Answer a few clinical questions to help us understand how you feel',
  },
  {
    icon: MessageCircle,
    step: '03',
    title: 'Chat with our AI',
    description: 'Get immediate support and personalized CBT exercise recommendations',
  },
  {
    icon: TrendingUp,
    step: '04',
    title: 'Track your progress',
    description: 'See your mood patterns improve over time with visual insights',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
            How BrainHealth works
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From your first session to lasting wellbeing — in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="relative">
              {/* Connector line */}
              <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-slate-100 -translate-x-8 z-0" />

              <div className="relative z-10 flex flex-col items-start">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-3xl font-bold text-slate-100">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
