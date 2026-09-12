// Ce ficheir sert a sauvegarder la photo de profile de l'utilisateur a travers les pages sans rechagrmenet, ca agi au dessus en gros

"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  createElement,
} from "react";
import { Get_User_Info } from "../services/Info_User_Service";

const UserContext = createContext({
  isLoggedIn: false,
  prenom: "",
  photoProfil: null,
  loading: true,
});

export function UtilisateurData_erith({ children }) {
  const [user, setUser] = useState({
    isLoggedIn: false,
    prenom: "",
    photoProfil: null,
    loading: true,
  });

  useEffect(() => {
    Get_User_Info()
      .then((data) => {
        const u = data.global?.[0];
        const p = data.profil?.[0];
        setUser({
          isLoggedIn: true,
          prenom: u?.prenom || "",
          photoProfil: p?.photo_profil || null,
          loading: false,
        });
      })
      .catch(() => {
        setUser({
          isLoggedIn: false,
          prenom: "",
          photoProfil: null,
          loading: false,
        });
      });
  }, []);

  return createElement(UserContext.Provider, { value: user }, children);
}

export function Data_User_erith() {
  return useContext(UserContext);
}
