"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const iconViolet = L.divIcon({
  html: `<div style="width:14px;height:14px;background:#8308D4;border-radius:50%;border:2px solid white;"></div>`,
  className: "",
  iconAnchor: [7, 7],
});

const iconBleu = L.divIcon({
  html: `<div style="width:14px;height:14px;background:#3B82F6;border-radius:50%;border:2px solid white;"></div>`,
  className: "",
  iconAnchor: [7, 7],
});

// Ce composant force la carte à se recentrer quand location change (on utilise de base paris et un zoom mais faudra changer)
function RecenterMap({ location }: { location: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(location, map.getZoom());
  }, [location]);
  return null;
}

export default function MapView({
  location,
  distance,
  points,
  onMarkerClick,
}: {
  location: [number, number];
  distance: number | null;
  points: { id: number; lat: number; lon: number }[];
  onMarkerClick: (id: number) => void;
}) {
  return (
    <MapContainer
      center={location}
      zoom={10}
      className="w-full h-full rounded-xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Marker de la recherche */}
      <Marker position={location} icon={iconBleu} />

      <RecenterMap location={location} />

      {/* .Map pour afficher tout les markers des postes */}
      {(distance ?? 0) > 0 &&
        points.map((point, i) => (
          <Marker
            key={i}
            position={[point.lat, point.lon]}
            icon={iconViolet}
            eventHandlers={{
              click: () => onMarkerClick(point.id),
            }}
          />
        ))}

      {/* Cercle de distance */}
      {distance && (
        <Circle
          center={location}
          radius={distance * 1000}
          pathOptions={{
            color: "#8308D4",
            fillColor: "#8308D4",
            fillOpacity: 0.1,
          }}
        />
      )}
    </MapContainer>
  );
}
