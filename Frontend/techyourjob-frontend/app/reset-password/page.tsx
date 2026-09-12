"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Suspense } from "react";

function ResetPasswordContent() {
  // récup le token et l'id depuis l'URL du lien recu par mail
  const searchParams = useSearchParams(); //lire parametre dans url
  const router = useRouter();
  const token = searchParams.get("token");
  const id = searchParams.get("id"); //recup du token et id ds url
  const [password, setPassword] = useState(""); //stockage par la suite utilsé
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    //appélé quand le mec clic sur submit g
    e.preventDefault();
    setError(""); //nettoyage des messages auparavant
    setMessage("");

    if (password !== confirm)
      return setError("Les mots de passe ne correspondent pas.");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // requetea a notre backend ppir vérif le token pr sécurité et ensuite récup l'id de la personne qui change son mdp et son nv password
          body: JSON.stringify({ token, id, password }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Mot de passe mis à jour ! Redirection...");
      setTimeout(() => router.push("/login"), 1000); //si il n'y a pas derreur , apres que le mdp soit bien changé on peut rediriger vers le login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#242424] flex justify-center">
      {/* formulaire */}
      <div className="w-full md:w-[45%] flex flex-col items-center justify-center p-6 space-y-18">
        {/* titre et lien */}
        <div className="text-center space-y-5">
          <h1 className="text-white text-7xl font-bold">Tech Your Job</h1>
          <h1 className="text-[#ADADAD] font-bold text-s flex justify-center">
            Remembered your password?{" "}
            <a
              href="/login"
              className="text-[#7288C9] ml-1 cursor-pointer underline"
            >
              Login
            </a>
          </h1>
        </div>

        <div className="w-full max-w-xl bg-[#2c2c2c] rounded-[40px] py-15 px-10 shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-white text-5xl font-bold mb-4">
              Forgot Password
            </h1>
            <p className="text-[#8e8e8e] font-bold">Enter your new password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // a chaque fois que le mec appuie sur une touche ca met a jour ke state de
              placeholder="New Password"
              required
              className="w-full bg-[#242424] text-white font-bold placeholder:font-bold placeholder-[#8e8e8e] px-6 py-4 rounded-full outline-none border-2 border-[#8e8e8e] transition-all"
            />

            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmation"
              required
              className="w-full bg-[#242424] text-white font-bold placeholder:font-bold placeholder-[#8e8e8e] px-6 py-4 rounded-full outline-none border-2 border-[#8e8e8e] transition-all"
            />

            {message && (
              <p className="text-green-400 text-center text-sm font-bold">
                {message}
              </p>
            )}
            {error && (
              <p className="text-red-400 text-center text-sm font-bold">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="block mx-auto bg-[#242424] text-xl border-2 border-[#8e8e8e] text-[#7288c9] font-bold py-4 px-20 rounded-full cursor-pointer"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
