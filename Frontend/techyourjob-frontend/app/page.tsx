"use client";

import { Search, CircleArrowLeft, ArrowRightCircle } from "lucide-react";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import Header from "./components/NavBar/header";
import { useState } from "react";
import LogoCarousel from "./components/LogoCarousel";
import Footer from "./components/Autre/Footer";

const cards = [
  { title: "Développeur Web" },
  { title: "Développeur IA" },
  { title: "Data Engineer" },
  { title: "DevOps Engineer" },
  { title: "Cybersécurité" },
  { title: "UX Designer" },
  { title: "Product Manager" },
  { title: "Cloud Architect" },
];

const CARDS_PER_SLIDE = 4;

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");

  const [current, setCurrent] = useState(0);

  const slides = [];
  for (let i = 0; i < cards.length; i += CARDS_PER_SLIDE) {
    slides.push(cards.slice(i, i + CARDS_PER_SLIDE));
  }

  const prev = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const next = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <div>
        <Header />
      </div>
      <main id="main-content">
        {/* HEAD SECTION */}
        <section aria-labelledby="hero-title">
          <div className="bg-[#313030]">
            <header className="py-16 px-4 text-center relative overflow-hidden">
              <h1 className="text-5xl font-bold mb-4">Trouver votre avenir</h1>
              <p className="text-xl text-gray-300 mb-8">
                Plus de 4435 jobs vous attendent
              </p>

              {/* Barre de recherche */}
              <div className="max-w-2xl mx-auto mb-4 flex items-center bg-[#226979] rounded-[20px] overflow-hidden">
                <div className="flex items-center gap-3 px-6 flex-1 py-4">
                  <Search className="w-6 h-6 text-white stroke-[3px]" />
                  <input
                    type="text"
                    placeholder="Chercher un job, un domaine, une entreprise"
                    aria-label="Rechercher un job, un domaine ou une entreprise"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-200 text-lg w-full outline-none font-medium"
                  />
                </div>
                <button className="bg-[#47AD95] text-white px-8 h-full py-4 rounded-[20px] flex items-center gap-3 transition self-stretch">
                  <Search className="w-6 h-6 text-white stroke-[3px]" />
                  <span className="text-lg font-bold">Rechercher</span>
                </button>
              </div>

              <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                Tech Your Job : la plateforme créée par des dev, pour t'aider à
                trouver ton prochain métier, en conditions réelles.
                <br />
                Pour cela nous utilisons un système unique de projet intégré !
              </p>
              <a href="#offres">
                <button className="mt-4 text-xl flex items-center gap-2 mx-auto hover:underline">
                  Découvrir <FaRegArrowAltCircleDown className="w-6 h-6" />
                </button>
              </a>
            </header>
          </div>
        </section>
        {/* --- SECTION EXPLORER --- */}
        <div id="offres" className="bg-[#242424]">
          <section className="py-12 px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-10">Explorer nos offres</h2>

            <div className="relative flex items-center gap-4">
              {/* Bouton gauche */}
              <button
                onClick={prev}
                aria-label="Slide précédente"
                className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white transition-all duration-150 hover:bg-white/25 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Slides + Indicators */}
              <div className="overflow-hidden flex-1">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {slides.map((slide, i) => (
                    <div
                      key={i}
                      className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                      {slide.map((card) => (
                        <div
                          key={card.title}
                          className="bg-[#2a2a2a] min-h-64 rounded-xl border border-gray-800 hover:border-purple-500 transition"
                        >
                          <div className="h-1/4 flex items-center justify-center bg-[#4D4D4D] rounded-t-xl">
                            <h3 className="text-2xl font-bold">{card.title}</h3>
                          </div>
                          <div className="h-3/4 flex flex-col justify-between bg-[url('/image18.png')] bg-cover bg-center rounded-b-xl">
                            <p className="text-xl p-4">
                              +350 offres
                              <br />
                              Top 5
                            </p>
                            <div className="flex justify-center mb-6">
                              <button className="px-12 py-3 bg-white text-purple-700 rounded-full font-bold hover:bg-purple-100 transition">
                                Découvrir +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-3 mt-4">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        current === i ? "bg-purple-500" : "bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bouton droit */}
              <button
                onClick={next}
                aria-label="Slide suivante"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white transition-all duration-150 hover:bg-white/25 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col mt-12 items-center gap-8">
              <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-md font-bold transition">
                Explorer les toutes
              </button>

              {/* Partners Logos */}
              <div className="w-full">
                <LogoCarousel />
              </div>
              <p className="text-xs text-gray-400">
                Vous êtes une entreprise et vous recrutez ?
              </p>
              <a href="#" className="text-teal-400 text-xs underline">
                Renseignez-vous !
              </a>
            </div>
          </section>
        </div>

        {/* SECTION SYSTEME UNIQUE */}
        <section className="py-20 bg-[#1a1a1a] relative">
          <div className="max-w-6xl mx-auto px-8">
            <h2 id="unique-system-title" className="text-4xl font-bold mb-16">
              Notre système de projet{" "}
              <span className="text-teal-400 italic">Unique</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 relative">
                <div className="absolute -right-6 top-0 bottom-0 w-1 bg-blue-500 rounded-full opacity-50 hidden lg:block"></div>

                <div className="bg-[#333] p-4 rounded-xl max-w-sm ml-0 border-l-4 border-gray-500">
                  <h3 className="font-bold text-sm mb-1">
                    Des compétences par la pratique
                  </h3>
                  <p className="text-sm text-gray-300">
                    Chez Tech Your Job, nous croyons que pour tester les
                    compétences, il faut les mettre en pratique.
                  </p>
                </div>

                <div className="bg-[#333] p-4 rounded-xl max-w-sm ml-auto mr-12 border-l-4 border-gray-500">
                  <h4 className="font-bold text-sm mb-1 text-right">
                    Comment ?
                  </h4>
                  <p className="text-sm text-gray-300 text-right">
                    Les entreprises proposent des mini-projets qui simulent leur
                    stack technique réelle.
                  </p>
                </div>

                <div className="bg-[#333] p-4 rounded-xl max-w-sm ml-0 border-l-4 border-gray-500">
                  <h4 className="font-bold text-sm mb-1">
                    Comment j'y répond ?
                  </h4>
                  <p className="text-sm text-gray-300">
                    Directement depuis la page de l'offre.
                  </p>
                </div>
              </div>

              <div className="space-y-6 relative">
                <div className="bg-[#333] p-4 rounded-xl max-w-sm ml-auto mr-12 border-r-4 border-gray-500">
                  <h3 className="font-bold text-sm mb-1">1 consigne</h3>
                  <p className="text-sm text-gray-300">
                    Une mission claire et concrète basée sur un vrai besoin
                    technique d'entreprise.
                  </p>
                </div>

                <div className="bg-[#333] p-4 rounded-xl max-w-sm ml-0 border-r-4 border-gray-500">
                  <h4 className="font-bold text-sm mb-1 text-right">
                    1 question
                  </h4>
                  <p className="text-sm text-gray-300 text-right">
                    Pas de QCM interminable. Une seule problématique
                    d'architecture ou de code à résoudre.
                  </p>
                </div>

                <div className="bg-[#333] p-4 rounded-xl max-w-sm ml-auto mr-12 border-r-4 border-gray-500">
                  <h4 className="font-bold text-sm mb-1">Centralisation</h4>
                  <p className="text-sm text-gray-300">
                    Retrouve tout ce dont tu as besoin pour trouver le travail
                    de tes rêves
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER CALL TO ACTION --- */}
        <footer className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous êtes convaincu ?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Rejoignez l'aventure Tech Your Job dès maintenant et trouvez votre
            futur offre
          </p>
          <a href="/offre">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-md font-bold flex items-center gap-2 mx-auto transition transform hover:scale-105">
              En avant <ArrowRightCircle className="w-5 h-5" />
            </button>
          </a>
          <div className="mt-20">
          </div>
        </footer>
      </main>
      <Footer/>

    </div>
  );
}
