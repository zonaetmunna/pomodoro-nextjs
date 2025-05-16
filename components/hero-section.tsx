import { Button } from "@/components/ui/button"
import { InteractiveGrid } from "@/components/ui/interactive-grid"
import { ShineBorder } from "@/components/ui/shine-border"
import { Play, Upload } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-black hero-gradient">
      <InteractiveGrid containerClassName="absolute inset-0" className="opacity-30" points={40} />

      <ShineBorder
        className="relative z-10 max-w-6xl mx-auto px-6"
        borderClassName="border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Professional Image Editing
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Made Simple & Powerful
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            CropStudio gives you professional-grade tools for perfect image cropping, resizing, and editing. 
            Create stunning visuals with precision, speed, and simplicity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 gap-2">
              <Upload className="w-4 h-4" />
              Try It Now
            </Button>
          </div>
        </div>

        <ShineBorder className="relative mx-auto" borderClassName="border border-white/10 rounded-xl overflow-hidden">
          <div className="relative bg-black/80 p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-video bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg overflow-hidden border border-white/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-80"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-dashed border-blue-400 w-3/4 h-3/4 rounded-md flex items-center justify-center bg-blue-500/10">
                        <div className="text-blue-300 font-medium">Cropping Area</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">Pro Tools</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-blue-500">20+</p>
                      <p className="text-xs text-gray-400">Crop Presets</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-500">4K</p>
                      <p className="text-xs text-gray-400">Resolution</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-indigo-500">100%</p>
                      <p className="text-xs text-gray-400">Accuracy</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">Smart Functions</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <p>AI-powered object detection</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <p>Auto-adjustment algorithms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ShineBorder>
      </ShineBorder>
    </section>
  )
}

