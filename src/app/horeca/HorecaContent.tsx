"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Features for horeca
const features = [
  "PERSOONLIJKE LEVERING IN REGIO ANTWERPEN",
  "EXCLUSIEVE BATCHES EN SEIZOENSBIEREN",
  "FLEXIBELE BESTELLINGEN EN HOEVEELHEDEN",
  "MARKETING SUPPORT EN PROMOTIEMATERIAAL",
  "PROEFSESSIES VOOR UW TEAM",
];

// Packages
const packages = [
  {
    name: "PROEFPAKKET",
    description: "Ideaal om te ontdekken",
    items: ["6 verschillende bieren", "Promotiemateriaal", "Prijslijst"],
    price: "Gratis",
    note: "Voor nieuwe horeca partners",
    featured: false,
  },
  {
    name: "STARTER",
    description: "Voor kleinere zaken",
    items: ["Min. 24 flessen per bestelling", "1 tap badge", "Glaswerk in bruikleen"],
    price: "Op aanvraag",
    note: "",
    featured: false,
  },
  {
    name: "PARTNER",
    description: "Volledige samenwerking",
    items: [
      "Vaste voorraad afspraken",
      "Exclusieve batches",
      "Evenement support",
      "Prioriteit bij nieuwe releases",
    ],
    price: "Op maat",
    note: "Langdurige samenwerking",
    featured: true,
  },
];

import { faq } from "./faqData";

export default function HorecaContent() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Bedankt voor uw interesse! We nemen binnen 2 werkdagen contact op.");
  };

  return (
    <>
      <Header />

      <main>
        {/* Hero Section - Yellow with Cartoon */}
        <section className="relative min-h-[90vh] flex items-center bg-yellow overflow-hidden">
          {/* Diagonal stripes background */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                var(--color-dark),
                var(--color-dark) 2px,
                transparent 2px,
                transparent 20px
              )`,
            }}
          />

          <div className="max-w-[1400px] mx-auto px-6 py-32 md:py-20 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <div
                  className="inline-block px-4 py-2 bg-dark text-yellow font-hand text-lg mb-6"
                  style={{
                    transform: 'rotate(-2deg)',
                    boxShadow: '4px 4px 0px var(--color-white)',
                  }}
                >
                  Voor de echte cafébazins
                </div>

                <h1
                  className="text-dark mb-6"
                  style={{
                    fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                    transform: 'rotate(-1deg)',
                    lineHeight: '0.85',
                    textShadow: '4px 4px 0px var(--color-white)',
                  }}
                >
                  TROEBEL OP JE TOOG?
                </h1>

                <div
                  className="bg-white text-dark p-5 mb-8 font-body text-lg md:text-xl max-w-[550px] border-4 border-dark mx-auto lg:mx-0"
                  style={{
                    transform: 'rotate(1deg)',
                    boxShadow: '8px 8px 0px var(--color-dark)',
                  }}
                >
                  Wil je je klanten iets anders serveren dan de standaard pils?
                  Onze bieren zijn een <strong>gegarandeerde conversatiestarter</strong>.
                  <span className="block mt-3 text-gray-500 text-base italic">
                    En ja, het bier is echt. De garage-foto&apos;s... daar zijn we gewoon goed in Photoshop.
                  </span>
                </div>

                <a
                  href="#contact"
                  className="btn-brutal btn-brutal-dark inline-block"
                  style={{ transform: 'rotate(-1deg)' }}
                >
                  Partner Worden &rarr;
                </a>
              </div>

              {/* Cartoon Image - Big and Bold */}
              <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                <div
                  className="relative w-full max-w-[500px] lg:max-w-[550px]"
                  style={{ transform: 'rotate(2deg)' }}
                >
                  <Image
                    src="/Cartoon brouwen.png"
                    alt="Troebel Brewing - Cartoon"
                    width={550}
                    height={550}
                    className="w-full h-auto drop-shadow-2xl"
                    priority
                  />

                  {/* Photoshop joke sticker */}
                  <div
                    className="absolute -bottom-4 -right-2 bg-white text-dark px-3 py-2 font-hand text-sm md:text-base border-3 border-dark z-20 max-w-[180px] text-center"
                    style={{
                      transform: 'rotate(6deg)',
                      boxShadow: '3px 3px 0px var(--color-dark)',
                    }}
                  >
                    *geen garage meer, zo zijn we wel begonnen
                  </div>

                  {/* Lokaal sticker */}
                  <div
                    className="absolute -top-2 -right-2 md:top-4 md:right-4 bg-red text-white px-4 py-3 font-hand text-xl border-3 border-dark z-20 rounded-full"
                    style={{
                      transform: 'rotate(15deg)',
                      boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                    }}
                  >
                    100% Echt Bier!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-dark" />
        </section>

        {/* Why Troebel Section */}
        <section className="bg-cream py-16 md:py-24 px-4 md:px-8 border-b-4 border-dark relative">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(var(--color-dark) 1px, transparent 1px),
                linear-gradient(90deg, var(--color-dark) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content Card */}
              <div
                className="bg-white border-4 border-dark p-8 md:p-12"
                style={{
                  transform: 'rotate(-1deg)',
                  boxShadow: '10px 10px 0px var(--color-yellow)',
                }}
              >
                <span className="font-hand text-xl text-dark mb-2 block" style={{ transform: 'rotate(-2deg)' }}>
                  Waarom kiezen voor
                </span>
                <h2 className="text-4xl md:text-5xl mb-8">TROEBEL?</h2>

                <p className="font-body text-lg text-gray-700 mb-8 leading-relaxed">
                  Als nano-brouwerij uit Antwerpen bieden we iets dat de grote
                  brouwerijen niet kunnen: <strong>persoonlijke service</strong> en
                  unieke bieren met een verhaal.
                </p>

                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className="check-box" />
                      <span className="font-heading text-lg md:text-xl">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Polaroid Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="polaroid" style={{ transform: 'rotate(3deg)' }}>
                  <div className="relative w-[300px] md:w-[350px] aspect-[4/3]">
                    <Image
                      src="/founders.jpg"
                      alt="De oprichters van Troebel Brewing"
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 768px) 300px, 350px"
                    />
                  </div>
                  <p className="font-hand text-center mt-4 text-lg text-dark">
                    De Schuldigen (niet gephotoshopt)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="bg-white py-16 md:py-24 px-4 md:px-8 border-b-4 border-dark relative">
          <div className="max-w-[1200px] mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <span className="font-hand text-2xl text-dark mb-2 block" style={{ transform: 'rotate(-1deg)' }}>
                Samenwerking
              </span>
              <h2 className="text-4xl md:text-5xl mb-4">ONZE PAKKETTEN</h2>
              <div
                className="w-[100px] h-[6px] bg-yellow mx-auto border-2 border-dark"
                style={{ transform: 'rotate(1deg)' }}
              />
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`card-eticket ${pkg.featured ? 'relative' : ''}`}
                  style={{
                    padding: '2rem',
                  }}
                >
                  {pkg.featured && (
                    <div
                      className="absolute -top-3 -left-3 bg-red text-white px-3 py-1 font-heading text-sm uppercase border-2 border-dark z-10"
                      style={{
                        transform: 'rotate(-5deg)',
                        boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                      }}
                    >
                      Best Value
                    </div>
                  )}

                  <h3 className="text-2xl md:text-3xl mb-2">{pkg.name}</h3>
                  <p className="font-body text-gray-600 text-sm mb-6">{pkg.description}</p>

                  <ul className="space-y-3 mb-8">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-gray-700">
                        <span className="text-yellow font-bold text-xl">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t-4 border-dark">
                    <p className="font-heading text-3xl">
                      {pkg.price}
                    </p>
                    {pkg.note && (
                      <p className="font-body text-sm text-gray-500 mt-1">{pkg.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="bg-yellow py-16 md:py-24 px-4 md:px-8 border-b-4 border-dark relative">
          {/* Subtle stripes */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                var(--color-dark),
                var(--color-dark) 1px,
                transparent 1px,
                transparent 15px
              )`,
            }}
          />

          <div className="max-w-[800px] mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="font-hand text-2xl text-dark mb-2 block" style={{ transform: 'rotate(1deg)' }}>
                Laten we praten
              </span>
              <h2 className="text-4xl md:text-5xl mb-4">INTERESSE?</h2>
              <p className="font-body text-dark/70 max-w-[500px] mx-auto text-lg">
                Vul het formulier in en we nemen binnen 2 werkdagen contact op.
                <span className="block text-base mt-1 italic">Beloofd. Geen Photoshop nodig.</span>
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="border-4 border-dark p-6 md:p-10 bg-white"
              style={{ boxShadow: '8px 8px 0px var(--color-dark)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-heading text-lg mb-2">
                    NAAM ZAAK *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-3 border-dark bg-cream font-body focus:outline-none focus:bg-white transition-colors"
                    style={{ boxShadow: '3px 3px 0px var(--color-dark)' }}
                    placeholder="Cafe De Troebele Pint"
                  />
                </div>

                <div>
                  <label className="block font-heading text-lg mb-2">
                    CONTACTPERSOON *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-3 border-dark bg-cream font-body focus:outline-none focus:bg-white transition-colors"
                    style={{ boxShadow: '3px 3px 0px var(--color-dark)' }}
                    placeholder="Jan Pansen"
                  />
                </div>

                <div>
                  <label className="block font-heading text-lg mb-2">
                    E-MAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-3 border-dark bg-cream font-body focus:outline-none focus:bg-white transition-colors"
                    style={{ boxShadow: '3px 3px 0px var(--color-dark)' }}
                    placeholder="jan@cafe.be"
                  />
                </div>

                <div>
                  <label className="block font-heading text-lg mb-2">
                    TELEFOON
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-3 border-dark bg-cream font-body focus:outline-none focus:bg-white transition-colors"
                    style={{ boxShadow: '3px 3px 0px var(--color-dark)' }}
                    placeholder="+32 xxx xx xx xx"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-heading text-lg mb-2">
                    ADRES ZAAK
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border-3 border-dark bg-cream font-body focus:outline-none focus:bg-white transition-colors"
                    style={{ boxShadow: '3px 3px 0px var(--color-dark)' }}
                    placeholder="Straatnaam 123, 2000 Antwerpen"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-heading text-lg mb-2">
                    BERICHT
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border-3 border-dark bg-cream font-body focus:outline-none focus:bg-white transition-colors resize-none"
                    style={{ boxShadow: '3px 3px 0px var(--color-dark)' }}
                    placeholder="Vertel ons over uw zaak en wat u zoekt..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-brutal btn-brutal-dark w-full mt-8 text-center justify-center"
                style={{ transform: 'rotate(0deg)' }}
              >
                VERSTUUR AANVRAAG &rarr;
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-cream py-16 md:py-24 px-4 md:px-8 border-b-4 border-dark">
          <div className="max-w-[800px] mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="font-hand text-2xl text-dark mb-2 block" style={{ transform: 'rotate(-1deg)' }}>
                Nog vragen?
              </span>
              <h2 className="text-4xl md:text-5xl mb-4">FAQ</h2>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-4 border-dark"
                  style={{
                    boxShadow: openFaq === index ? '6px 6px 0px var(--color-yellow)' : '4px 4px 0px var(--color-dark)',
                    transform: openFaq === index ? 'translate(-2px, -2px)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-heading text-lg md:text-xl pr-4">{item.question}</span>
                    <span
                      className={`text-3xl font-heading flex-shrink-0 transition-transform duration-200 ${
                        openFaq === index ? "rotate-45 text-yellow" : "text-dark"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 border-t-2 border-dark pt-4">
                      <p className="font-body text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Contact CTA */}
        <section className="bg-dark py-16 px-4 md:px-8 relative overflow-hidden">
          {/* Angled yellow accent */}
          <div
            className="absolute top-0 right-0 w-1/3 h-full bg-yellow opacity-10"
            style={{ transform: 'skewX(-12deg) translateX(50%)' }}
          />

          <div className="max-w-[700px] mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl text-yellow mb-4">
              LIEVER DIRECT CONTACT?
            </h2>
            <p className="font-body text-gray-300 mb-8 text-lg">
              Bel of mail ons gerust voor een vrijblijvend gesprek.
              <span className="block text-sm mt-1 text-gray-500">We bijten niet. We brouwen alleen.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:horeca@troebelbrewing.be"
                className="btn-brutal"
                style={{ transform: 'rotate(-1deg)' }}
              >
                horeca@troebelbrewing.be
              </a>
              <a
                href="tel:+32123456789"
                className="btn-brutal btn-brutal-dark"
                style={{ transform: 'rotate(1deg)' }}
              >
                +32 123 45 67 89
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
