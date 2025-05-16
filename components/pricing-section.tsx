import { Button } from "@/components/ui/button"
import { ShineBorder } from "@/components/ui/shine-border"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for casual image editing and cropping needs",
      features: ["Basic image cropping", "Standard filters and adjustments", "Up to 4K resolution", "Export in JPG and PNG"],
      buttonText: "Start Free",
      buttonVariant: "outline",
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "Advanced editing tools for professionals and creators",
      features: [
        "Everything in Free",
        "AI-powered cropping suggestions",
        "Batch processing",
        "Unlimited resolution",
        "Cloud storage (50GB)",
        "Collaboration features",
        "Priority support",
      ],
      buttonText: "Get Pro",
      buttonVariant: "default",
      highlight: true,
    },
  ]

  return (
    <section id="pricing" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Choose Your Plan</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Professional image editing tools for every level of expertise
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <ShineBorder
              key={plan.name}
              className={`h-full ${plan.highlight ? "z-10" : ""}`}
              borderClassName={`border ${plan.highlight ? "border-blue-500/50" : "border-white/10"} rounded-xl`}
            >
              <div className={`p-8 h-full ${plan.highlight ? "bg-gradient-to-b from-black to-black/80" : ""}`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 mb-1">{plan.period}</span>}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant as "outline" | "default"}
                  className={`w-full ${plan.highlight ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90" : ""}`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </ShineBorder>
          ))}
        </div>
      </div>
    </section>
  )
}

