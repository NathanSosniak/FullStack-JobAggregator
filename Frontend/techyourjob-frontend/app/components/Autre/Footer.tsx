"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function Footer() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  return (
    <footer className="w-full mt-auto bg-[#0a0a0a] border-t border-white/[0.05] text-zinc-500 text-sm font-sans py-8 relative">
      <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">
        {/* redirections */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start order-1">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 text-center md:text-left">
            <Link
              href="/"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              href="/offre"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Offres
            </Link>
            <Link
              href="/auth"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Authentification
            </Link>
            <Link
              href="/entreprise"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Entreprises
            </Link>
            <Link
              href="/account"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Compte
            </Link>
            <Link
              href="/hiring"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Je recrute
            </Link>
          </div>
        </div>

        {/* bouton mentions légales + nom appli */}
        <div className="w-full md:w-1/3 flex flex-col items-center gap-5 order-2 text-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
            <span className="font-black text-zinc-100 text-base tracking-tighter">
              Tech Your Job
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            © 2026 Tous droits réservés
          </p>
          <div className="flex gap-8 justify-center">
            <button
              onClick={() => setActivePopup("mentions")}
              className="text-[10px] font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Mentions Légales
            </button>
            <button
              onClick={() => setActivePopup("confidentialite")}
              className="text-[10px] font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Confidentialité
            </button>
          </div>
        </div>

        {/* email */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-end order-3 text-center md:text-right">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Support & Contact
            </p>
            <a
              href="mailto:support@techyourjob.fr"
              className="text-purple-400 hover:text-purple-300 font-bold transition-colors text-base"
            >
              support@techyourjob.fr
            </a>
          </div>
        </div>
      </div>

      {/* la pop-up*/}
      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              onClick={() => setActivePopup(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0d0d0d] border border-white/[0.08] w-full max-w-2xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/[0.05] bg-zinc-900/30">
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-zinc-100 tracking-tight">
                    {activePopup === "mentions"
                      ? "Mentions Légales"
                      : "Politique de Confidentialité"}
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                    Tech Your Job - 2026
                  </p>
                </div>
                <button
                  onClick={() => setActivePopup(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 border border-white/[0.05] text-zinc-500 hover:text-zinc-100 transition-all cursor-pointer"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto text-zinc-400 text-sm space-y-8 leading-relaxed custom-scrollbar bg-[#0d0d0d]">
                {activePopup === "mentions" ? (
                  <>
                    <section className="space-y-3">
                      <h3 className="font-bold text-white text-base">
                        1. Édition du site
                      </h3>
                      <p>
                        Le site <strong>Tech Your Job</strong> est édité par
                        l'équipe de développement Epitech composée de : Jarod
                        Putman-Grain, Gabin Hannier, Nathan Sosniak et Antoine
                        Graber.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h3 className="font-bold text-white text-base">
                        2. Hébergement et Souveraineté
                      </h3>
                      <p>
                        Conformément à notre charte éthique, l'intégralité des
                        données est hébergée sur des serveurs situés en
                        <strong> Union Européenne</strong>, garantissant une
                        protection juridique optimale et la souveraineté de vos
                        informations.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h3 className="font-bold text-white text-base">
                        3. Propriété Intellectuelle
                      </h3>
                      <p>
                        L'architecture technique, les algorithmes de matching et
                        l'identité graphique sont la propriété exclusive de Tech
                        Your Job. Toute reproduction sans accord préalable est
                        interdite.
                      </p>
                    </section>
                  </>
                ) : (
                  <>
                    <section className="space-y-3">
                      <h3 className="font-bold text-white text-base">
                        1. Collecte et Transparence (RGPD)
                      </h3>
                      <p>Nous distinguons deux types de données :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Données Privées :</strong> Nom, email, mot de
                          passe. Elles sont chiffrées et servent uniquement à la
                          gestion de votre compte.
                        </li>
                        <li>
                          <strong>Données Professionnelles :</strong>{" "}
                          Compétences, métiers, expériences. Elles servent au
                          fonctionnement de notre IA de recommandation.
                        </li>
                      </ul>
                      <p className="text-purple-400 font-medium italic">
                        Aucune donnée personnelle n'est revendue à des tiers.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h3 className="font-bold text-white text-base">
                        2. Éthique de l'IA et Algorithmes
                      </h3>
                      <p>
                        Nos algorithmes sont audités pour bannir tout biais
                        discriminatoire.
                        <strong>
                          {" "}
                          Aucune candidature ne peut être rejetée
                          automatiquement
                        </strong>{" "}
                        par notre IA sans une revue humaine par un recruteur
                        (Human-in-the-loop).
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h3 className="font-bold text-white text-base">
                        3. Conservation des données
                      </h3>
                      <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
                        <table className="w-full text-[11px] uppercase tracking-wider">
                          <tbody>
                            <tr className="border-b border-white/[0.05]">
                              <td className="py-2 font-bold text-zinc-500">
                                Dossier Candidat
                              </td>
                              <td className="py-2 text-right text-white">
                                2 ans (après dernier contact)
                              </td>
                            </tr>
                            <tr className="border-b border-white/[0.05]">
                              <td className="py-2 font-bold text-zinc-500">
                                Données Connexion
                              </td>
                              <td className="py-2 text-right text-white">
                                12 mois
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 font-bold text-zinc-500">
                                Cookies Techniques
                              </td>
                              <td className="py-2 text-right text-white">
                                13 mois
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h3 className="font-bold text-white text-base">
                        4. Vos Droits et Contact
                      </h3>
                      <p>
                        Vous bénéficiez d'un <strong>droit à l'oubli</strong>{" "}
                        total. Vous pouvez demander la suppression définitive de
                        vos données depuis votre compte ou via :
                        <span className="text-purple-400 block mt-1">
                          support@techyourjob.fr
                        </span>
                      </p>
                    </section>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
