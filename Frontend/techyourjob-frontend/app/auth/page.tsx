"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Login, Register } from "../services/Authentification/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Suspense } from "react";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [isLogin, setIsLogin] = useState(() => mode !== "register");
  const [isDesktop, setIsDesktop] = useState(false);

  // states pour l'erruer
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // detection mode mobile pour image
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setIsDesktop(media.matches);
    const listener = () => setIsDesktop(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // effacage de l'erreur quand on bascule de login a register
  useEffect(() => {
    setErrorMessage("");
  }, [isLogin]);

  // States champ commun et sécurité
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [LastName, setLastName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [HoneyPot, setHoneyPot] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [Role, setRole] = useState("user"); // nouveau

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); //  initialisation de l'erreur au clic

    if (HoneyPot !== "") return;
    if (isLocked) return;

    setClickCount((prev) => prev + 1);
    if (clickCount >= 2) setIsLocked(true);

    if (isLogin) {
      try {
        const success = await Login(Email, Password);
        if (success) {
          router.push("/offre");
        } else {
          setErrorMessage("Des informations sont incorrectes.");
        }
      } catch (error) {
        setErrorMessage("Des informations sont incorrectes.");
      }
    } else {
      try {
        // le try va intercepter le "throw new error" envoyé par ton auth.service.ts
        await Register(LastName, FirstName, Email, Password, Role);

        // Si la ligne du dessus n'a pas crash, c'est que c'est un succès (200 OK)
        setShowSuccessToast(true);
        setTimeout(() => {
          setIsLogin(true);
        }, 1500);
      } catch (error) {
        // ici dc pour si le compte existe deja ou s'il y a un probleme serveur
        setErrorMessage("Des informations sont incorrectes.");
      }
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#242424] overflow-hidden relative">
      <div className="relative w-full h-screen">
        {/* le formulaire*/}
        <motion.div
          initial={false}
          animate={{
            x: isDesktop ? (isLogin ? "55vw" : "0vw") : "0px",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full md:w-[45vw] h-full z-10 flex items-center justify-center p-6"
        >
          {/*gère le texte qui passe en dessous de l'image  */}
          <AnimatePresence mode="wait">
            <FormContent
              key={isLogin ? "login" : "register"}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              handleSubmit={handleSubmit}
              setEmail={setEmail}
              setPassword={setPassword}
              setFirstName={setFirstName}
              setLastName={setLastName}
              HoneyPot={HoneyPot}
              setHoneyPot={setHoneyPot}
              isLocked={isLocked}
              errorMessage={errorMessage} // tranfert de lerrerur de auth au composant childrren
              Role={Role}
              setRole={setRole}
            />
          </AnimatePresence>
        </motion.div>

        {/* image */}
        <motion.div
          initial={false}
          animate={{
            x: isDesktop ? (isLogin ? "0vw" : "45vw") : "0px",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="hidden md:block absolute top-0 left-0 w-[55vw] h-screen p-8 z-20 pointer-events-none"
        >
          <div
            className="w-full h-full rounded-[70px] bg-cover bg-center shadow-2xl pointer-events-auto"
            style={{ backgroundImage: "url('image3.png')" }}
          />
        </motion.div>
      </div>

      {/* pop up */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#7288C9] text-white px-11 py-7 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold border border-white/10"
          >
            <svg
              className="w-6 h-6 shrink-0 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Inscription réussie ! Redirection...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}

interface FormContentProps {
  isLogin: boolean;
  setIsLogin: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setFirstName: (val: string) => void;
  setLastName: (val: string) => void;
  HoneyPot: string;
  setHoneyPot: (val: string) => void;
  isLocked: boolean;
  errorMessage: string;
  Role: string;
  setRole: (val: string) => void;
}

// composant pour les animations de fondu
function FormContent({
  isLogin,
  setIsLogin,
  handleSubmit,
  setEmail,
  setPassword,
  setFirstName,
  setLastName,
  HoneyPot,
  setHoneyPot,
  isLocked,
  errorMessage,
  Role,
  setRole,
}: FormContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl flex flex-col items-center space-y-10"
    >
      {/* Titres */}
      <div className="text-center space-y-5">
        <h1 className="text-white text-7xl font-bold">Tech Your Job</h1>
        <p className="text-[#adadad] font-bold">
          {isLogin ? "Aucun compte ?" : "Avez-vous déjà un compte? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#7288C9] underline cursor-pointer ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>

      {/* formulaire */}
      <motion.div className="w-full bg-[#2c2c2c] rounded-[40px] py-12 px-10 shadow-2xl">
        <h2 className="text-white text-5xl font-bold text-center mb-10">
          {isLogin ? "De retour ?" : "Bonjour!"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={HoneyPot}
            onChange={(e) => setHoneyPot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* champs register */}
          {!isLogin && (
            <div className="space-y-4">
              <input
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                className="w-full bg-[#242424] text-white p-4 rounded-full border-1 border-[#8e8e8e] outline-none focus:border-[#7288C9] font-bold transition-all"
                required
              />
              <input
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                className="w-full bg-[#242424] text-white p-4 rounded-full border-1 border-[#8e8e8e] outline-none focus:border-[#7288C9] font-bold transition-all"
                required
              />
            </div>
          )}

          {/*champs commun des deux email password */}
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse mail"
            className="w-full bg-[#242424] text-white p-4 rounded-full border-1 border-[#8e8e8e] outline-none focus:border-[#7288C9] font-bold transition-all"
            required
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-[#242424] text-white p-4 rounded-full border-1 border-[#8e8e8e] outline-none focus:border-[#7288C9] font-bold transition-all"
            required
          />

          {/* Sélecteur de rôle */}
          {!isLogin && (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-3 rounded-full border font-bold transition-all ${
                  Role === "user"
                    ? "bg-[#7288C9] border-[#7288C9] text-white"
                    : "bg-[#242424] border-[#8e8e8e] text-[#8e8e8e] hover:border-[#7288C9]"
                }`}
              >
                Candidat
              </button>

              <button
                type="button"
                onClick={() => setRole("enterprise")}
                className={`flex-1 py-3 rounded-full border font-bold transition-all ${
                  Role === "enterprise"
                    ? "bg-[#7288C9] border-[#7288C9] text-white"
                    : "bg-[#242424] border-[#8e8e8e] text-[#8e8e8e] hover:border-[#7288C9]"
                }`}
              >
                Entreprise
              </button>
            </div>
          )}

          {/* forgot paddword pr login*/}
          {isLogin && (
            <div className="flex justify-start ml-2 pt-2">
              <Link
                href="/forgot-password"
                className="text-[#7288C9] cursor-pointer font-bold underline"
              >
                Mot de passe oublié?
              </Link>
            </div>
          )}

          {/*message quand erreur , les informations sont incorrectes jsp quoi */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[#ff5c5c] text-sm font-bold pl-2 pt-1"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={isLocked}
            className="w-full bg-[#242424] text-xl text-[#7288c9] font-bold py-4 rounded-full border-1 border-[#8e8e8e] mt-6 hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          >
            {isLogin ? "Connexion" : "S'inscrire"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
