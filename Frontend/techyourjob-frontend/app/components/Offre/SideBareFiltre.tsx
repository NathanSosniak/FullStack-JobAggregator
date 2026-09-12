"use client";

import { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaCalendarAlt,
  FaTimes,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEuroSign,
  FaStar,
  FaGlobe,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import * as Slider from "@radix-ui/react-slider";

const TypeContrat = [
  {
    display: "CDD",
    value: "fixedTerm",
  },
  {
    display: "CDI",
    value: "permanent",
  },
  {
    display: "Temps partiel",
    value: "partTime",
  },
  {
    display: "Freelance",
    value: "freelance",
  },
  {
    display: "Stage",
    value: "internship",
  },
  {
    display: "Apprentissage",
    value: "apprenticeship",
  },
];

// Composant accordeon flexible
function Section({
  icon,
  label,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-white/10 pt-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <span className="text-gray-500">{icon}</span>
          {label}
        </span>
        <FaChevronDown
          size={10}
          className={`text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="px-1 pt-2 pb-3">{children}</div>}
    </div>
  );
}

interface OffreFilterChangeParams {
  remote?: string | null;
  contract?: string | null;
  minsalary?: number;
  maxsalary?: number;
  experience?: number;
  location?: string | null;
  distance?: number | null;
  language?: string | null;
  age?: number | null;
}

// ===== Composant principal ============================
export default function SideBareFiltre({
  onFilterChange,
}: {
  onFilterChange: (params: OffreFilterChangeParams) => void;
}) {
  // Sections ouvertes
  const [openContrat, setOpenContrat] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openLieu, setOpenLieu] = useState(false);
  const [openSalaire, setOpenSalaire] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);

  // Filtres
  const [activePresentiel, setActivePresentiel] = useState(false);
  const [activeRemote, setActiveRemote] = useState(false);
  const [activeHybride, setActiveHybride] = useState(false);

  // Pour le type contract
  const [TypeSelectionner, setTypeSelectionner] = useState<string | null>(null);

  // Pour le salaire
  const [salaire, setSalaire] = useState([0, 100]);

  const salaireMin = salaire[0];
  const salaireMax = salaire[1];

  // Salaire double curseur affichage
  const [salaireTxt, setSalaireTxt] = useState([20, 80]);
  const salaireMinTxt = Math.round((salaire[0] / 100) * 10000);
  const salaireMaxTxt = Math.round((salaire[1] / 100) * 10000);

  // filtre de distance
  const [openDistance, setOpenDistance] = useState(false);
  const [distance, setDistance] = useState([0]);

  // languagge
  const [openLangue, setOpenLangue] = useState(false);
  const [langueSelectionnee, setLangueSelectionnee] = useState<string | null>(
    null,
  );

  // Experience curseur simple
  const [experience, setExperience] = useState([0]);

  // Dates
  const [startDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  // localisation
  const [locationInput, setLocationInput] = useState("");

  const handleLocationSubmit = () => {
    onFilterChange({ location: locationInput || null });
  };

  useEffect(() => {
    if (endDate) {
      onFilterChange({ age: jourEntreDate });
    }
  }, [endDate]);

  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const jourEntreDate =
    startDate && endDate
      ? Math.round(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            86400000,
        )
      : null;

  //  Chip
  const Chip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 rounded-full px-4 py-1.5
        text-sm border transition-all duration-150 active:scale-95
        ${
          active
            ? "bg-purple-50 border-purple-400 text-purple-800"
            : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/30"
        }
      `}
    >
      {active && (
        <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-purple-400">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M1.5 4L3.2 5.8L6.5 2.2"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      {label}
    </button>
  );

  //pour reset les filtres
  const handleReset = () => {
    setActivePresentiel(false);
    setActiveRemote(false);
    setActiveHybride(false);
    setTypeSelectionner(null);
    setSalaire([0, 100]);
    setExperience([0]);
    setLocationInput("");
    setDistance([0]);
    setLangueSelectionnee(null);
    setEndDate("");

    onFilterChange({
      remote: null,
      contract: null,
      minsalary: 0,
      maxsalary: 100,
      experience: 0,
      location: null,
      distance: null,
      language: null,
      age: null,
    });
  };
  return (
    <div className="px-3 flex flex-col gap-1">
      {/* Quel language  */}
      <Section
        icon={<FaGlobe size={12} />}
        label="Langue"
        open={openLangue}
        onToggle={() => setOpenLangue(!openLangue)}
      >
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Français", value: "fr" },
            { label: "Anglais", value: "en" },
            { label: "Autre", value: "other" },
          ].map(({ label, value }) => (
            <Chip
              key={value}
              label={label}
              active={langueSelectionnee === value}
              onClick={() => {
                const newVal = langueSelectionnee === value ? null : value;
                setLangueSelectionnee(newVal);
                onFilterChange({ language: newVal });
              }}
            />
          ))}
        </div>
      </Section>
      {/*  Type de contrat*/}
      <Section
        icon={<FaBriefcase size={12} />}
        label="Type de contrat"
        open={openContrat}
        onToggle={() => setOpenContrat(!openContrat)}
      >
        <div className="flex flex-wrap gap-2">
          {TypeContrat.map(({ display, value }) => (
            <Chip
              key={value}
              label={display}
              active={TypeSelectionner === value}
              onClick={() => {
                const newVal = TypeSelectionner === value ? null : value;
                setTypeSelectionner(newVal);
                onFilterChange({ contract: newVal });
              }}
            />
          ))}
        </div>
      </Section>

      {/* Lieu de travail*/}
      <Section
        icon={<FaMapMarkerAlt size={12} />}
        label="Lieu de travail"
        open={openLieu}
        onToggle={() => setOpenLieu(!openLieu)}
      >
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "Présentiel",
              value: "no",
              state: activePresentiel,
              set: setActivePresentiel,
            },
            {
              label: "Remote",
              value: "fullTime",
              state: activeRemote,
              set: setActiveRemote,
            },
            {
              label: "Hybride",
              value: "hybrid",
              state: activeHybride,
              set: setActiveHybride,
            },
          ].map(({ label, value, state, set }) => (
            <Chip
              key={label}
              label={label}
              active={state}
              onClick={() => {
                const newState = !state;
                set(newState);

                onFilterChange({
                  remote: newState ? value : null,
                });
              }}
            />
          ))}
        </div>
      </Section>

      {/* Periode */}
      <Section
        icon={<FaCalendarAlt size={12} />}
        label="Période"
        open={openDate}
        onToggle={() => setOpenDate(!openDate)}
      >
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-3">
            {/* Début */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Début
              </span>
              <span className="w-full rounded-lg px-3 py-1.5 text-xs border bg-white/5 border-white/10 text-gray-300 focus:border-purple-700/50 focus:bg-purple-950/20">
                {new Date().toLocaleDateString("fr-FR")}
              </span>
            </div>

            {/* Fin */}
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Fin
              </span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className={`
                  w-full rounded-lg px-3 py-1.5 text-xs border outline-none
                  transition-all cursor-pointer [color-scheme:dark]
                  ${
                    endDate
                      ? "bg-purple-950/50 border-purple-800/60 text-purple-300"
                      : "bg-white/5 border-white/10 text-gray-300 focus:border-purple-700/50 focus:bg-purple-950/20"
                  }
                `}
              />
            </div>
          </div>

          {/* Resume */}
          {endDate && jourEntreDate && jourEntreDate > 0 ? (
            <p className="text-[11px] text-purple-400">
              Période de {jourEntreDate} jour{jourEntreDate > 1 ? "s" : ""}
            </p>
          ) : (
            <p className="text-[11px] text-gray-600">
              Sélectionnez une date de fin
            </p>
          )}

          {endDate && (
            <button
              onClick={() => setEndDate("")}
              className="flex items-center gap-1 text-[11px] text-gray-600 hover:text-gray-400 transition-colors w-fit"
            >
              <FaTimes size={10} />
              Effacer
            </button>
          )}
        </div>
      </Section>

      {/*  Salaire */}
      <Section
        icon={<FaEuroSign size={12} />}
        label="Salaire"
        open={openSalaire}
        onToggle={() => setOpenSalaire(!openSalaire)}
      >
        <div className="flex flex-col gap-4 px-1">
          {/* Valeurs */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300 bg-purple-950/50 border border-purple-800/40 rounded-md px-2 py-0.5">
              {salaireMinTxt.toLocaleString("fr-FR")} €
            </span>
            <span className="text-xs text-gray-600">-</span>
            <span className="text-xs text-purple-300 bg-purple-950/50 border border-purple-800/40 rounded-md px-2 py-0.5">
              {salaireMaxTxt.toLocaleString("fr-FR")} €
            </span>
          </div>

          {/* Slider */}
          <Slider.Root
            value={salaire}
            onValueChange={(value) => {
              setSalaire(value);
              onFilterChange({
                minsalary: value[0],
                maxsalary: value[1],
              });
            }}
            min={0}
            max={100}
            step={1}
            className="relative flex items-center w-full h-5"
          >
            <Slider.Track className="bg-white/10 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-purple-500 h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-purple-500 border-2 border-purple-300 rounded-full cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50" />
            <Slider.Thumb className="block w-4 h-4 bg-purple-500 border-2 border-purple-300 rounded-full cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50" />
          </Slider.Root>

          {/* Echelle */}
          <div className="flex justify-between text-[10px] text-gray-600">
            <span>0 €</span>
            <span>2 500 €</span>
            <span>5 000 €</span>
            <span>10 000 €</span>
          </div>
        </div>
      </Section>

      {/* Experience */}
      <Section
        icon={<FaStar size={12} />}
        label="Années d'expérience"
        open={openExperience}
        onToggle={() => setOpenExperience(!openExperience)}
      >
        <div className="flex flex-col gap-4 px-1">
          {/* Valeur courante */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-300 bg-purple-950/50 border border-purple-800/40 rounded-md px-2 py-0.5">
              {experience[0] === 9
                ? "9+ ans"
                : `${experience[0]} an${experience[0] > 1 ? "s" : ""}`}
            </span>
            {experience[0] === 0 && (
              <span className="text-[10px] text-gray-600">
                Débutant accepté
              </span>
            )}
          </div>

          {/* Slider */}
          <Slider.Root
            value={experience}
            onValueChange={(e) => {
              setExperience(e);
              onFilterChange({ experience: e[0] });
            }}
            min={0}
            max={9}
            step={1}
            className="relative flex items-center w-full h-5"
          >
            <Slider.Track className="bg-white/10 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-purple-500 h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-purple-500 border-2 border-purple-300 rounded-full cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50" />
          </Slider.Root>

          {/* Graduation */}
          <div className="flex justify-between text-[10px] text-gray-600">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, "9+"].map((n) => (
              <span
                key={n}
                className={
                  experience[0] === n || (n === "9+" && experience[0] === 9)
                    ? "text-purple-400 font-medium"
                    : ""
                }
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section
        icon={<FaMapMarkerAlt size={12} />}
        label="Distance"
        open={openDistance}
        onToggle={() => setOpenDistance(!openDistance)}
      >
        <div className="flex flex-col gap-4 px-1 ">
          <div className="border border-white/15 rounded-2xl flex items-center">
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLocationSubmit()}
              placeholder="Ville, région..."
              className="bg-transparent text-white placeholder-[#717171] text-sm flex-1 outline-none p-3"
            />
            <CiSearch
              onClick={handleLocationSubmit}
              className="text-white/60 text-xl mr-5 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-300 bg-purple-950/50 border border-purple-800/40 rounded-md px-2 py-0.5">
              {distance[0] === 0 ? "Toute distance" : `${distance[0]} km`}
            </span>
          </div>

          <Slider.Root
            value={distance}
            onValueChange={(val) => {
              setDistance(val);
              onFilterChange({ distance: val[0] === 0 ? null : val[0] });
            }}
            min={0}
            max={100}
            step={5}
            className="relative flex items-center w-full h-5"
          >
            <Slider.Track className="bg-white/10 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-purple-500 h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-purple-500 border-2 border-purple-300 rounded-full cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50" />
          </Slider.Root>

          <div className="flex justify-between text-[10px] text-gray-600">
            <span>0</span>
            <span>25 km</span>
            <span>50 km</span>
            <span>75 km</span>
            <span>100 km</span>
          </div>
        </div>
      </Section>

      <div className="mt-5 flex justify-center">
        <button
          onClick={handleReset}
          className="text-sm text-gray-400 border border-white/15 px-4 py-2 rounded-full hover:border-white/30 transition-colors"
        >
          Reset Filtre
        </button>
      </div>
    </div>
  );
}
