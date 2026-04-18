"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Timeline data
const timeline = [
  {
    year: "2022",
    title: "Het Begin",
    text: "Eerste experiment in een Antwerpse garage. Een groep vrienden, een brouwkit, en een droom.",
  },
  {
    year: "2023",
    title: "Moeskop is Geboren",
    text: "Onze eerste bier wordt gelanceerd. Eerste ratings op Untappd. De naam Troebel wordt officieel.",
  },
  {
    year: "2024",
    title: "Brews Almighty",
    text: "Onze flagship pale ale wordt de favoriet. 98 ratings en tellend. Eerste cafes nemen ons bier op.",
  },
  {
    year: "2025",
    title: "De Webshop",
    text: "Troebel gaat online. Nu kun je onze bieren ook thuis proeven.",
  },
];

// Philosophy items
const philosophy = [
  {
    title: "LOKAAL",
    text: "Ingrediënten van Belgische leveranciers waar mogelijk.",
  },
  {
    title: "AMBACHTELIJK",
    text: "Kleine batches, met de hand gemaakt. Elke brouw is uniek.",
  },
  {
    title: "SPEELS",
    text: "Leuke namen, experimentele smaken. Bier mag ook gewoon plezier zijn.",
  },
  {
    title: "DUURZAAM",
    text: "Herbruikbare flessen, lokale distributie.",
  },
];

export default function VerhaalPage() {
  return (
    <>
      <Header />

      <main className="pt-[100px]">
        {/* Hero Section */}
        <section className="bg-dark text-cream py-12 md:py-16 px-4 md:px-8 border-b-[5px] border-yellow">
          <div className="max-w-[1200px] mx-auto text-center">
            <h1
              className="text-3xl md:text-[3.5rem] text-yellow mb-4 leading-[0.9]"
              style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}
            >
              WIJ ZIJN TROEBEL
            </h1>
            <p className="font-body text-lg md:text-xl text-cream/90 max-w-[600px] mx-auto mb-4">
              De naam zegt het al: wij geloven niet in het wegfilteren van smaak.
            </p>
            <p className="font-hand text-xl md:text-2xl text-cream/50 transform -rotate-1">
              Garage brewing met attitude sinds 2022
            </p>
          </div>
        </section>

        {/* Main Story Section with Image Collage */}
        <section className="dots-pattern py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image Collage - Left Side */}
              <div className="relative h-[580px] lg:h-[850px] mb-12 lg:mb-0">
                {/* Founders Polaroid - Top Left */}
                <div
                  className="polaroid absolute top-0 left-0 w-[90%] md:w-[70%] z-20"
                  style={{ transform: 'rotate(-3deg)' }}
                >
                  <Image
                    src="/founders.jpg"
                    alt="Founders of Troebel Brewing"
                    width={600}
                    height={450}
                    className="w-full"
                  />
                  <div className="text-center font-hand text-2xl md:text-3xl mt-4 text-dark font-bold leading-none">
                    Founders
                  </div>
                </div>

                {/* Garage Brewing Photo - Bottom Right */}
                <div
                  className="absolute bottom-0 right-[-5%] w-[110%] md:w-[100%] bg-white p-3 md:p-4 border-4 border-dark z-30"
                  style={{
                    transform: 'rotate(2deg)',
                    boxShadow: '12px 12px 0px var(--color-yellow)'
                  }}
                >
                  <Image
                    src="/Garage brouwen.png"
                    alt="Garage Brewing Scene"
                    width={650}
                    height={433}
                    className="w-full border-2 border-dark"
                  />
                  <div className="text-center font-hand text-2xl md:text-3xl mt-3 text-dark font-bold leading-none">
                    Where the magic happens
                  </div>
                </div>

                {/* Handwritten Note - Middle Connector */}
                <div
                  className="absolute top-[45%] right-[10%] font-hand text-dark text-xl z-10 hidden md:block"
                  style={{ transform: 'rotate(15deg)' }}
                >
                  Est. 2022 →
                </div>
              </div>

              {/* Content - Right Side */}
              <div>
                <h2
                  className="text-4xl md:text-[3.5rem] text-dark mb-6 leading-[0.9]"
                  style={{ textShadow: '3px 3px 0px var(--color-yellow)' }}
                >
                  NIET HELDER,<br/>WEL BRILJANT
                </h2>

                <div className="space-y-4 text-lg text-gray-700 leading-relaxed mb-8">
                  <p>
                    Wat begon in een garage met een tweedehands brouwketel en te veel goesting,
                    is nu Troebel Brewing Co.
                  </p>
                  <p>
                    In het Nederlands betekent &quot;troebel&quot; niet helder, ondoorzichtig.
                    Net als het beste Belgische bier. Wij omarmen de troebele kant van het brouwen.
                  </p>
                  <p>
                    Onze bieren zijn niet gefilterd tot kristalhelder. Ze behouden hun karakter,
                    hun gist, hun ziel. Soms wat troebel, altijd oprecht.
                  </p>
                </div>

                {/* Quote Box */}
                <div className="bg-yellow border-4 border-dark p-6 transform -rotate-1 shadow-[6px_6px_0px_rgba(0,0,0,1)] inline-block">
                  <p className="font-hand text-2xl text-dark text-center">
                    &quot;Garage brewing<br/>met attitude!&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-dark text-cream py-16 md:py-24 px-4 md:px-8 stripe-border-top relative">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-[4rem] text-yellow mb-4"
                style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}
              >
                ONZE REIS
              </h2>
              <p className="font-hand text-xl text-cream/60">
                Van garage tot brouwerij
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-yellow/30 -translate-x-1/2" />

              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-yellow border-4 border-dark rounded-full -translate-x-1/2 z-10" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                    }`}
                  >
                    <span className="inline-block px-4 py-2 bg-yellow text-dark font-heading text-lg mb-3 border-2 border-dark transform -rotate-1">
                      {item.year}
                    </span>
                    <h4 className="text-2xl font-heading text-cream mb-2">{item.title}</h4>
                    <p className="text-cream/70 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Etiquettes Section */}
        <section className="dots-pattern py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-[4rem] text-dark mb-4"
                style={{ textShadow: '4px 4px 0px var(--color-yellow)' }}
              >
                VAN SCHETS TOT ETICKET
              </h2>
              <p className="font-hand text-xl text-gray-600">
                Elk detail met de hand gemaakt
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
              {/* Etiquette Image */}
              <div
                className="bg-white p-4 border-4 border-dark w-[300px]"
                style={{
                  transform: 'rotate(-2deg)',
                  boxShadow: '10px 10px 0px var(--color-yellow)'
                }}
              >
                <Image
                  src="/eticket brews.jpg"
                  alt="Beer Labels"
                  width={300}
                  height={400}
                  className="w-full border-2 border-dark"
                />
                <div className="text-center font-hand text-lg mt-3 text-dark">
                  Handcrafted labels
                </div>
              </div>

              {/* Cartoon Image */}
              <div
                className="bg-yellow p-4 border-4 border-dark w-[320px]"
                style={{
                  transform: 'rotate(2deg)',
                  boxShadow: '10px 10px 0px var(--color-dark)'
                }}
              >
                <Image
                  src="/Cartoon brouwen.png"
                  alt="Cartoon Brewing"
                  width={350}
                  height={280}
                  className="w-full"
                />
              </div>

              {/* Text */}
              <div className="max-w-md">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Elke fles vertelt een verhaal. Van de eerste schetsen tot de finale etiketten -
                  alles gemaakt met dezelfde aandacht en passie als ons bier.
                </p>
                <p className="font-hand text-yellow text-2xl bg-dark inline-block px-4 py-2 transform rotate-1">
                  ← Check die details!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="bg-dark text-cream py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-[4rem] text-yellow mb-4"
                style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}
              >
                HOE WIJ BROUWEN
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {philosophy.map((item, index) => (
                <div
                  key={index}
                  className="bg-dark border-4 border-yellow p-6 text-center transform hover:scale-105 transition-transform"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                    boxShadow: '6px 6px 0px var(--color-yellow)'
                  }}
                >
                  <div className="w-12 h-12 bg-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="font-heading text-dark text-xl">{index + 1}</span>
                  </div>
                  <h4 className="text-xl font-heading text-yellow mb-3">{item.title}</h4>
                  <p className="text-cream/70 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-yellow py-16 text-center px-6 border-t-4 border-dark">
          <div className="max-w-[600px] mx-auto">
            <h2
              className="text-3xl md:text-[3rem] text-dark mb-4"
              style={{ textShadow: '3px 3px 0px rgba(255,255,255,0.3)' }}
            >
              KLAAR OM TE PROEVEN?
            </h2>
            <p className="text-dark/70 text-lg mb-8">
              Ontdek al onze bieren in de webshop.
            </p>
            <Link href="/webshop" className="btn-brutal btn-brutal-dark">
              Naar de Webshop →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
