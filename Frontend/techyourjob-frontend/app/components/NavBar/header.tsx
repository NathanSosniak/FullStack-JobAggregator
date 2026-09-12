"use client";
import { useState } from "react";
import Notifications from "./Notification";
import Link from "next/link";

import { Data_User_erith } from "@/app/contexte/UserContext";
import { Logout_User } from "@/app/services/Authentification/Logout";

function Header() {
  const navLinks = [
    { icon: "Home.svg", label: "Accueil", alt: "accueil", href: "/" },
    { icon: "Archive.svg", label: "Offres", alt: "offres", href: "/offre" },
    {
      icon: "batiment.svg",
      label: "Entreprises",
      alt: "entreprises",
      href: "/entreprise",
    },
    {
      icon: "recrutement.svg",
      label: "Je recrute",
      alt: "recrutement",
      href: "/hiring",
    },
  ];

  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isLoggedIn, prenom, photoProfil } = Data_User_erith();

  const UserAvatar = ({ size = 22 }) => {
    if (isLoggedIn && photoProfil) {
      return (
        <img
          src={photoProfil}
          alt="Photo de profil"
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      );
    }

    if (isLoggedIn && prenom) {
      return (
        <div
          className="rounded-full bg-purple-600 flex items-center justify-center text-white font-bold"
          style={{ width: size, height: size, fontSize: size * 0.45 }}
        >
          {prenom.charAt(0).toUpperCase()}
        </div>
      );
    }

    return <img style={{ width: size }} src="User.svg" alt="Profil" />;
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await Logout_User();
  };

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/[0.05]">
      <div className="flex justify-between items-center px-10  h-20">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div>
            <img
              className="w-14"
              src="techyourjob.png"
              alt="Logo Tech Your Job"
            />
          </div>

          <span className="font-black text-zinc-100 text-xl tracking-tighter group-hover:text-purple-400 transition-colors">
            Tech Your Job
          </span>
        </div>

        <div className="hidden md:flex items-center gap-12">
          <nav className="flex items-center gap-1">
            {navLinks.map(({ icon, label, alt, href }) => (
              <Link
                key={label}
                href={href}
                className="relative flex items-center gap-2.5 px-5 py-2 group transition-all duration-300 rounded-xl hover:bg-white/[0.03]"
              >
                <img
                  className="w-4.5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"
                  src={icon}
                  alt={alt}
                />

                <span className="font-bold text-[13px] text-zinc-400 group-hover:text-zinc-100 transition-colors">
                  {label}
                </span>

                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-purple-500 rounded-full opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 border-l border-white/[0.08] pl-8">
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserMenuOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/[0.05] hover:bg-zinc-800 transition-all text-zinc-400 hover:text-zinc-100"
                aria-label="Notifications"
              >
                <img className="w-5" src="Bell.svg" alt="" />
              </button>

              <Notifications
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                notifications={[
                  {
                    id: 1,
                    type: "entreprise",
                    titre: "Google vous suit",
                    message: "Google a consulte votre profil.",
                    date: "il y a 5 min",
                    lu: false,
                  },
                  {
                    id: 2,
                    type: "offre",
                    titre: "Candidature envoyee",
                    message:
                      "Votre candidature chez Airbus a bien ete soumise.",
                    date: "il y a 1h",
                    lu: false,
                  },
                  {
                    id: 3,
                    type: "refus",
                    titre: "Candidature refusee",
                    message:
                      "Votre candidature chez Amazon n'a pas ete retenue.",
                    date: "il y a 3h",
                    lu: true,
                  },
                  {
                    id: 4,
                    type: "modification",
                    titre: "Profil mis a jour",
                    message: "Vos informations ont bien ete modifiees.",
                    date: "hier",
                    lu: true,
                  },
                  {
                    id: 5,
                    type: "autre",
                    titre: "Bienvenue !",
                    message: "Votre compte Tech Your Job est actif.",
                    date: "il y a 2 jours",
                    lu: true,
                  },
                ]}
              />
            </div>

            {/* menu pr pc */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotifOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/[0.05] hover:bg-zinc-800 transition-all"
                aria-label="Mon profil"
              >
                <UserAvatar size={24} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-[#0d0d0d] border border-white/[0.08] rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-white/[0.05] mb-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Connecté en tant que
                    </p>
                    <p className="text-sm font-bold text-zinc-100">
                      {prenom || "Utilisateur"}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] transition-colors"
                  >
                    Mon Profil
                  </Link>

                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] transition-colors"
                  >
                    Paramètres
                  </button>

                  <hr className="my-2 border-white/[0.05]" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setUserMenuOpen(false);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Notifications"
            >
              <img style={{ width: "20px" }} src="Bell.svg" alt="" />
            </button>

            <Notifications
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
              notifications={[
                {
                  id: 1,
                  type: "entreprise",
                  titre: "Google vous suit",
                  message: "Google a consulte votre profil.",
                  date: "il y a 5 min",
                  lu: false,
                },
                {
                  id: 2,
                  type: "offre",
                  titre: "Candidature envoyee",
                  message: "Votre candidature chez Airbus a bien ete soumise.",
                  date: "il y a 1h",
                  lu: false,
                },
                {
                  id: 3,
                  type: "refus",
                  titre: "Candidature refusee",
                  message: "Votre candidature chez Amazon n'a pas ete retenue.",
                  date: "il y a 3h",
                  lu: true,
                },
                {
                  id: 4,
                  type: "modification",
                  titre: "Profil mis a jour",
                  message: "Vos informations ont bien ete modifiees.",
                  date: "hier",
                  lu: true,
                },
                {
                  id: 5,
                  type: "autre",
                  titre: "Bienvenue !",
                  message: "Votre compte Tech Your Job est actif.",
                  date: "il y a 2 jours",
                  lu: true,
                },
              ]}
            />
          </div>

          {/* menu pr mobile */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotifOpen(false);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Mon profil"
            >
              <UserAvatar size={28} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#2C2C2C] border border-white/10 rounded-lg shadow-xl py-2 z-50">
                <Link
                  href="/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Profil
                </Link>
                <button
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Télécharger les données
                </button>
                <hr className="my-1 border-white/10" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setUserMenuOpen(false);
              setNotifOpen(false);
            }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />

              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col border-t border-white/10">
          {navLinks.map(({ icon, label, alt, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-7 py-3.5 hover:bg-white/5 transition-colors duration-200"
            >
              <img style={{ width: "18px" }} src={icon} alt={alt} />

              <span className="font-bold text-sm text-white/80">{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export default Header;
