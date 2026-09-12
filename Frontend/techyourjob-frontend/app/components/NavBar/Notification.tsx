"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";
import { LuFilePlus, LuFileX, LuUserPen, LuBell } from "react-icons/lu";

type NotifType = "entreprise" | "offre" | "refus" | "modification" | "autre";

interface Notification {
  id: number;
  type: NotifType;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const ICON_MAP: Record<
  NotifType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  entreprise: {
    icon: <BsBuildings size={15} />,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  offre: {
    icon: <LuFilePlus size={15} />,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
  },
  refus: {
    icon: <LuFileX size={15} />,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  modification: {
    icon: <LuUserPen size={15} />,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  autre: {
    icon: <LuBell size={15} />,
    color: "text-gray-400",
    bg: "bg-white/10",
  },
};

export default function Notifications({
  isOpen,
  onClose,
  notifications,
}: Props) {
  // pourn savoir si on passse sur une nouvelle

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (!isOpen) return null;
  return (
    <div className="absolute top-12 right-0 z-50 w-80 bg-[#242424] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-white text-sm font-bold">Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={18} />
        </button>
      </div>

      {/* Liste */}
      <div className="flex flex-col max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-8">
            Aucune notification
          </p>
        ) : (
          notifications.map((notif) => {
            const { icon, color, bg } = ICON_MAP[notif.type] ?? ICON_MAP.autre;
            return (
              <div
                onMouseEnter={() => setHoveredId(notif.id)}
                onMouseLeave={() => setHoveredId(null)}
                key={notif.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                  !notif.lu ? "bg-white/[0.03]" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${bg} ${color}`}
                >
                  {icon}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white text-xs font-semibold truncate">
                      {notif.titre}
                    </span>
                    {!notif.lu && hoveredId !== notif.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-400 text-xs leading-snug mt-0.5">
                    {notif.message}
                  </p>
                  <span className="text-gray-600 text-[10px] mt-1">
                    {notif.date}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
