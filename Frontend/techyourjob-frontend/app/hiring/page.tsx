"use client";

import { useState, useEffect } from "react";
import Header from "../components/NavBar/header";
import Footer from "../components/Autre/Footer";

function HiringPage() {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* text debut*/}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-16 py-10">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold mb-6">
              Trouvez les meilleurs <br /> développeurs, Sans bruit
            </h1>
            <p className="text-gray-400 mb-10 text-lg">
              Recrutez des développeurs qualifiés rapidement grâce à une
              plateforme pensée pour connecter les entreprises avec les
              meilleurs profils recherchés.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/auth?mode=register">
                <button className="bg-[#8a2be2] px-6 py-3 rounded-xl font-medium cursor-pointer">
                  Commencer à recruter gratuitement
                </button>
              </a>

              <button
                onClick={() => setOpenPopup(true)}
                className="bg-[#8a2be2] px-6 py-3 rounded-xl font-medium cursor-pointer"
              >
                En savoir plus sur la méthode
              </button>

              {openPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Information</h2>

                    <p className="text-gray-400 mb-6">
                      Nous contacter pour plus d'information.
                    </p>

                    <button
                      onClick={() => setOpenPopup(false)}
                      className="bg-[#8a2be2] px-6 py-3 rounded-xl font-medium cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* profils léo truc*/}
          <div className="relative w-full max-w-sm h-80 flex items-center justify-center">
            {/* carte gauche */}
            <div className="absolute left-0 bg-[#333] w-48 h-64 rounded-xl -rotate-6 opacity-40 border border-gray-700" />

            {/* carte droite */}
            <div className="absolute right-0 bg-[#333] w-48 h-64 rounded-xl rotate-6 opacity-40 border border-gray-700" />

            {/* Carte centre */}
            <div className="relative z-10 bg-[#2a2a2a] w-56 h-72 rounded-xl shadow-2xl border border-gray-600 flex flex-col items-center justify-center p-4">
              <div className="w-20 h-20 bg-gray-400 rounded-full mb-4" />

              <p className="font-bold">Léo</p>

              <p className="text-xs text-gray-400 mb-6 text-center">
                Fullstack JS (React, Node)
              </p>

              <button className="bg-[#8a2be2] text-xs px-4 py-2 rounded-lg">
                Voir le profil
              </button>
            </div>
          </div>
        </section>

        {/* pourquoi nous choisir*/}
        <section className="mt-20">
          <h2 className="text-xl font-bold mb-8 border-b-2 border-blue-500 inline-block pb-1">
            Pourquoi choisir TechYourJob RECRUTE ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* carte 1 */}
            <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-800">
              <h3 className="font-bold mb-2">1. Matchmaking intelligent</h3>
              <p className="text-sm text-gray-400">
                {" "}
                Notre système analyse vos besoins techniques pour vous proposer
                uniquement des profils réellement adaptés à votre entreprise.
              </p>
            </div>

            {/* carte 2 */}
            <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-800">
              <h3 className="font-bold mb-2">2. Optimisation</h3>
              <p className="text-sm text-gray-400">
                {" "}
                Gagnez un temps précieux en évitant les candidatures inutiles et
                les entretiens non pertinents.
              </p>
            </div>

            {/* carte 3 */}
            <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-800">
              <h3 className="font-bold mb-2">3. Tests techniques</h3>
              <p className="text-sm text-gray-400">
                {" "}
                La possibilités de créer des tests techniques pour évaluer les
                compétences des candidats.
              </p>
            </div>
          </div>
        </section>

        {/* card du bas pour avis sois disant*/}
        <section className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* aivs 1 */}

            <div className="flex flex-col">
              <div className="bg-[#333] p-6 rounded-2xl relative mb-6 border border-gray-800">
                <p className="text-sm text-gray-400 mb-4">
                  Nous avons trouvé un développeur React senior en moins d’une
                  semaine. Processus simple et très efficace.
                </p>
                <div className="w-full h-6 bg-[#216b7a] rounded-md opacity-50" />
                <div className="absolute -bottom-3 left-10 w-6 h-6 bg-[#333] rotate-45 border-r border-b border-gray-800" />
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-sm font-bold">Marc Durand</p>
                  <p className="text-xs text-gray-500">CEO chez StartupX</p>
                </div>
              </div>
            </div>

            {/* avis 2 */}

            <div className="flex flex-col">
              <div className="bg-[#333] p-6 rounded-2xl relative mb-6 border border-gray-800">
                <p className="text-sm text-gray-400 mb-4">
                  Enfin une plateforme qui comprend réellement nos besoins en
                  recrutement tech. Les profils proposés étaient excellents.
                </p>
                <div className="w-full h-6 bg-[#216b7a] rounded-md opacity-50" />
                <div className="absolute -bottom-3 left-10 w-6 h-6 bg-[#333] rotate-45 border-r border-b border-gray-800" />
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="w-10 h-10 bg-green-500 rounded-full" />
                <div>
                  <p className="text-sm font-bold">Sophie Martin</p>
                  <p className="text-xs text-gray-500">HR Manager</p>
                </div>
              </div>
            </div>

            {/*avis 3*/}

            <div className="flex flex-col">
              <div className="bg-[#333] p-6 rounded-2xl relative mb-6 border border-gray-800">
                <p className="text-sm text-gray-400 mb-4">
                  Les développeurs recommandés avaient un vrai niveau technique
                  démontré grace aux tests techniques.
                </p>

                <div className="w-full h-6 bg-[#216b7a] rounded-md opacity-50" />

                <div className="absolute -bottom-3 left-10 w-6 h-6 bg-[#333] rotate-45 border-r border-b border-gray-800" />
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div className="w-10 h-10 bg-red-500 rounded-full" />

                <div>
                  <p className="text-sm font-bold">Thomas Lebris</p>

                  <p className="text-xs text-gray-500">Lead Dev</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      
      </main>

      <Footer />
    </div>
  );
}

export default HiringPage;
