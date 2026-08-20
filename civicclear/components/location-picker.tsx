"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const defaultCenter = { lat: 28.6139, lng: 77.209 };

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  lat?: number | null;
  lng?: number | null;
  addressText?: string;
};

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 15));
  }, [lat, lng, map]);
  return null;
}

async function reverseGeocode(lat: number, lng: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { display_name?: string };
  return data.display_name ?? null;
}

export function LocationPicker({ lat, lng, addressText }: Props) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    lat != null && lng != null ? { lat, lng } : null,
  );
  const [address, setAddress] = useState(addressText ?? "");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const center = useMemo(
    () => position ?? defaultCenter,
    [position],
  );

  async function applyPoint(nextLat: number, nextLng: number) {
    setPosition({ lat: nextLat, lng: nextLng });
    setBusy(true);
    setNote(null);
    try {
      const named = await reverseGeocode(nextLat, nextLng);
      if (named) setAddress(named);
      else setNote("Could not look up the street name. Type the address below.");
    } catch {
      setNote("Could not look up the street name. Type the address below.");
    } finally {
      setBusy(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setNote("Location is not available in this browser. Pick on the map or type an address.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void applyPoint(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setBusy(false);
        setNote("Could not get GPS. Pick a point on the map or type an address.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="lat" value={position?.lat ?? ""} />
      <input type="hidden" name="lng" value={position?.lng ?? ""} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label>Location</Label>
        <Button type="button" variant="outline" size="sm" onClick={useMyLocation}>
          Use my location
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line/80">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-64 w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={(nextLat, nextLng) => void applyPoint(nextLat, nextLng)} />
          {position ? (
            <>
              <Marker position={[position.lat, position.lng]} icon={markerIcon} />
              <Recenter lat={position.lat} lng={position.lng} />
            </>
          ) : null}
        </MapContainer>
      </div>

      <p className="text-xs text-ink-muted">
        Tap the map to drop a pin{busy ? " · looking up address…" : ""}.
      </p>
      {note ? <p className="text-xs text-status-pending">{note}</p> : null}

      <div>
        <Label htmlFor="addressText">Address</Label>
        <Input
          id="addressText"
          name="addressText"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Street, area, landmark"
          required
        />
      </div>
    </div>
  );
}
