"use client"

import { useState } from "react"
import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  MessageCircle, 
  ArrowRight,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

type FAQItem = {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "Where is the Narita Airport pickup point?",
      answer: "The shuttle meets at Narita Airport Terminal 3, Bus Stop No. 6. If you arrive at Terminal 1 or Terminal 2, please use the free inter-terminal airport transport to reach Terminal 3."
    },
    {
      question: "Where is the Haneda Airport pickup point?",
      answer: "The shuttle meets at Haneda Airport Garden, 1F Bus Terminal, Bus Stop No. 5. It is approximately 7 minutes from Haneda Airport Terminal 3 via the connecting passage."
    },
    {
      question: "Can the bus wait if my flight is delayed?",
      answer: "No. Airport parking times are very strict, so the shuttle must depart at the scheduled time. Please allow enough time for immigration, baggage collection, and terminal transfers."
    },
    {
      question: "What happens if I miss the bus because my flight is delayed?",
      answer: "If you miss the shuttle due to a delayed flight, no refund is issued. We recommend arranging travel insurance that covers flight delays and missed transfers."
    },
    {
      question: "How far in advance do I need to book?",
      answer: "Bookings should be made at least 13 days before departure. If you need to book within 13 days, please contact us to check availability."
    },
    {
      question: "Do I need a printed ticket?",
      answer: "No printed ticket is required. Your name will be checked against the booking list when boarding. Please bring identification such as a passport, and keep your booking confirmation available."
    },
    {
      question: "Are children charged the same price?",
      answer: "Yes. There is no separate child fare. All seats are charged at the standard fare."
    },
    {
      question: "Are babies free?",
      answer: "Babies and young infants can travel free if they do not require their own seat. If they need a seat, the standard fare applies."
    },
    {
      question: "Does the bus have a toilet?",
      answer: "No. The bus does not have a toilet onboard, but it will make a stop at a highway service area for a toilet break."
    },
    {
      question: "Does the bus stop during the journey?",
      answer: "Yes. The bus normally makes one highway service area stop so passengers can use the toilet, stretch, and buy food or drinks."
    },
    {
      question: "Can I bring ski or snowboard luggage?",
      answer: "Yes. Ski and snowboard luggage is accepted. There are generally no limits."
    },
    {
      question: "Do I need to enter my flight number and hotel?",
      answer: "Yes. Please enter your flight number and accommodation details when booking. This helps us provide a smoother transfer service."
    },
    {
      question: "Can I book a return trip?",
      answer: "Bookings are made one way. For a return journey, please make two separate bookings."
    },
    {
      question: "Are there free local shuttle tickets included?",
      answer: "Yes. Airport shuttle customers receive 2 free local shuttle tickets. Customers who also book a return trip receive 5 free local shuttle tickets."
    },
    {
      question: "Can service times change?",
      answer: "Yes. Shuttle times may change or services may be cancelled due to weather, road conditions, traffic, or operating requirements."
    },
    {
      question: "What is the cancellation policy?",
      answer: "Cancellation fees may apply, especially within 21 days of travel. Please check the policies and information page before booking."
    },
    {
      question: "Can my booking be moved to another bus?",
      answer: "If possible, we may try to move you to a different operating bus. If this is not possible, the normal cancellation policy applies."
    },
    {
      question: "Where is the Tokyo drop-off point?",
      answer: "The Tokyo drop-off area is near Tokyo Station Yaesu Exit at the Marunouchi Kajibashi parking lot."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-white scroll-mt-20">
      <Container>
        <div className="flex flex-col gap-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Important information about bookings, airport pickup, luggage, delays, children, and cancellations.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto w-full divide-y divide-slate-100 border-t border-b border-slate-100">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div key={idx} className="group">
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="flex w-full items-center justify-between py-6 text-left transition-all hover:px-2"
                  >
                    <span className={cn(
                      "text-lg font-bold transition-colors duration-300",
                      isOpen ? "text-primary" : "text-slate-900 group-hover:text-primary"
                    )}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                      isOpen ? "bg-primary text-white rotate-180" : "bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isOpen ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
                  )}>
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-3xl font-bold text-white">Still have questions?</h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Contact us before booking and we’ll help you choose the right shuttle.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a 
                  href="mailto:myokoshuttle@gmail.com"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "primary" }),
                    "h-14 px-10 text-lg font-bold rounded-xl flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 transition-all hover:-translate-y-0.5 shadow-xl"
                  )}
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Us
                </a>
                <a 
                  href="/book"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "h-14 px-10 text-lg font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5"
                  )}
                >
                  Book Your Shuttle
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
