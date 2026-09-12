"use client";
import Header from "../components/NavBar/header";
import { useEffect, useState } from "react";

import { Get_User_Info } from "../services/Info_User_Service";

import { See_Profile_User } from "../services/Entreprise/See_Profile_User";
import { useSearchParams } from "next/navigation";

// components
import DashBoard_Preview from "../components/Account_components/Dashboard_preview";
import Document_priview from "../components/Account_components/Document";
import Competence_Preview from "../components/Account_components/Competence_preview";
import Infos_generale from "../components/Account_components/Infos_generale";
import Biographie_account from "../components/Account_components/biographie";
import Contact_account from "../components/Account_components/Contact_account";
import Plateforme_Account from "../components/Account_components/Plateforme_account";
import ExperiencePro_account from "../components/Account_components/ExperiencePro_account";
import Formation_Account from "../components/Account_components/Formation_account";

// page entreprise
import AddTestTechnique from "../components/Account_components/Entreprise/AJouter_test_technique";
import Reponse_candidats from "../components/Account_components/Entreprise/Managae_reponse";
import Footer from "../components/Autre/Footer";

import { Suspense } from "react";

function AccountContent() {
  const searchParams = useSearchParams();
  const viewUserId = searchParams.get("user");

  const [Data, setData] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(true);
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      let data;

      if (viewUserId) {
        data = await See_Profile_User(viewUserId);
        setIsEdit(false);
        setIsUser(true);
      } else {
        data = await Get_User_Info();
        if (data.global[0].role === "enterprise") {
          setIsEdit(false);
          setIsUser(false);
        }
      }

      setData(data);
    };
    fetchUser();
  }, [viewUserId]);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
      <Header />

      <main className="flex-1">
        <h1 className="sr-only">
          {isUser ? "Mon Espace" : "Espace Entreprise"}
        </h1>

        {isUser && (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-x-4 gap-y-4 mt-4 px-4 pb-4">
            <div className="flex flex-col gap-4">
              {!Data && (
                <div role="alert" className="text-bold text-red-500">
                  Acces reserve pour les entreprises partenaire !
                </div>
              )}

              {Data && <DashBoard_Preview />}
              {Data && <Document_priview isEdit={isEdit} />}
              {Data && (
                <Competence_Preview
                  isEdit={isEdit}
                  infos={{
                    competences_experience: Data.experience.flatMap((e: any) =>
                      (e["compétences"] ?? []).map((c: any) => ({
                        competence: c,
                        source: e.nom_entreprise,
                        sourceType: "experience" as const,
                        sourceId: e.id_experience,
                        logo: e.logo ?? null,
                      })),
                    ),
                    competences_formation: Data.formation.flatMap((f: any) =>
                      (f["compétences"] ?? []).map((c: any) => ({
                        competence: c,
                        source: f["nom_établissement"],
                        sourceType: "formation" as const,
                        sourceId: f.id_formation,
                        logo: f.logo ?? null,
                      })),
                    ),
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-4">
              {Data && (
                <Infos_generale
                  isEdit={isEdit}
                  infos={{
                    ...Data.global[0],
                    ...Data.profil[0],
                    PP: Data.profil[0].photo_profil,
                  }}
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                {Data && (
                  <Biographie_account
                    isEdit={isEdit}
                    infos={{
                      ...Data.profil[0],
                    }}
                  />
                )}
                <div className="flex flex-col gap-4">
                  {Data && (
                    <Contact_account
                      isEdit={isEdit}
                      infos={{
                        ...Data.global[0],
                      }}
                    />
                  )}

                  {Data && (
                    <Plateforme_Account
                      isEdit={isEdit}
                      infos={{
                        ...Data.profil[0],
                      }}
                    />
                  )}
                </div>
              </div>
              {Data && (
                <ExperiencePro_account
                  isEdit={isEdit}
                  infos={{
                    experience: Data.experience,
                    competences_experience: Data.experience.flatMap((e: any) =>
                      (e["compétences"] ?? []).map((c: any) => ({
                        competence: c,
                        source: e.nom_entreprise,
                      })),
                    ),
                  }}
                />
              )}
              {Data && (
                <Formation_Account isEdit={isEdit} infos={Data.formation} />
              )}
            </div>
          </div>
        )}

        {!isUser && (
          <div className="flex flex-row gap-5">
            <Reponse_candidats />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Account() {
  return (
    <Suspense fallback={null}>
      <AccountContent />
    </Suspense>
  );
}
