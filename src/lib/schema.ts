import { siteConfig } from '@/config/site'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        email: siteConfig.email,
        logo: `${siteConfig.url}/android-chrome-512x512.png`,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: siteConfig.email,
            availableLanguage: ['English', 'Japanese'],
          },
        ],
      },
      {
        '@type': 'TransportationService',
        '@id': `${siteConfig.url}/#transportation-service`,
        name: siteConfig.name,
        url: siteConfig.url,
        email: siteConfig.email,
        provider: {
          '@id': `${siteConfig.url}/#organization`,
        },
        serviceType: 'Airport shuttle service',
        areaServed: [
          {
            '@type': 'Place',
            name: 'Narita Airport',
          },
          {
            '@type': 'Place',
            name: 'Haneda Airport',
          },
          {
            '@type': 'Place',
            name: 'Myoko Kogen',
          },
          {
            '@type': 'Place',
            name: 'Madarao',
          },
          {
            '@type': 'Place',
            name: 'Tangram',
          },
          {
            '@type': 'Place',
            name: 'Lotte Arai Resort',
          },
        ],
        availableLanguage: ['English', 'Japanese'],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        publisher: {
          '@id': `${siteConfig.url}/#organization`,
        },
      },
    ],
  }
}

export function getFaqSchema() {
  const faqs = [
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
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
