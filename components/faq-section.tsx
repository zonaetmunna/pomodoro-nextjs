"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function FaqSection() {
  const faqs = [
    {
      question: "What file formats does CropStudio support?",
      answer:
        "CropStudio supports all major image formats including JPG, PNG, WebP, TIFF, SVG, and RAW files from most camera manufacturers. You can import and export in any of these formats with full quality preservation.",
    },
    {
      question: "How does CropStudio's AI-powered cropping work?",
      answer:
        "Our AI-powered cropping uses advanced computer vision algorithms to detect subjects, focal points, and composition rules in your images. It then suggests optimal crops based on these elements while maintaining the integrity of your visual story.",
    },
    {
      question: "Can I use CropStudio on my mobile device?",
      answer:
        "Yes! CropStudio is available as a web app, iOS and Android app, as well as desktop applications for Windows and macOS. Your projects sync across all your devices with cloud storage.",
    },
    {
      question: "Is there a limit to image resolution in CropStudio?",
      answer:
        "The free version supports images up to 4K resolution. With CropStudio Pro, you can work with images of any resolution, including ultra-high resolution RAW files from professional cameras.",
    },
    {
      question: "How does batch processing work?",
      answer:
        "Batch processing allows you to apply the same crop settings, adjustments, and edits to multiple images at once. This is perfect for creating consistent social media posts, product photos, or processing large photoshoots efficiently.",
    },
    {
      question: "Can I collaborate with others on image editing projects?",
      answer: "Yes, CropStudio Pro includes collaboration features that allow you to share editing projects with team members, clients, or collaborators. They can view, comment, or edit depending on the permissions you set.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 px-6 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Have questions about CropStudio? Find answers to common questions below.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-white/10 rounded-xl overflow-hidden">
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && <div className="p-6 pt-0 text-gray-400">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

