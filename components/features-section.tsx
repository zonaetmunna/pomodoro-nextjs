import { GradientCard } from "@/components/ui/gradient-card"
import { Crop, ImagePlus, Layers, Layout, Share2, Wand2 } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "Precision Cropping",
      description: "Pixel-perfect cropping tools with adjustable ratios, guides, and presets for different platforms",
      icon: <Crop className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Batch Processing",
      description: "Edit and crop multiple images at once with consistent settings for professional results",
      icon: <ImagePlus className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Smart AI Adjustments",
      description: "AI-powered tools that suggest optimal crops based on subject detection and composition rules",
      icon: <Wand2 className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Social Media Templates",
      description: "Ready-to-use templates for all major social platforms to ensure your images look perfect everywhere",
      icon: <Layout className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Layer Management",
      description: "Work with multiple layers for complex edits, masking, and non-destructive editing",
      icon: <Layers className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Instant Export",
      description: "Export in multiple formats and resolutions with just one click for quick publishing",
      icon: <Share2 className="h-6 w-6 text-indigo-500" />,
    },
  ]

  return (
    <section id="features" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Professional Editing Tools
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          CropStudio delivers advanced image editing capabilities in an intuitive interface, helping you create
          pixel-perfect visuals for any project or platform.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <GradientCard key={feature.title}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-white/5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>
    </section>
  )
}

