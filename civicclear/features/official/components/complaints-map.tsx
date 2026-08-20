"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { ComplaintStatus, ComplaintType, Priority } from "@prisma/client";
import { COMPLAINT_TYPE_LABELS } from "@/features/complaints/labels";
import { PRIORITY_LABELS, statusPinColor } from "@/features/official/workflow";
import { StatusBadge } from "@/features/complaints/components/status-badge";
import { Button } from "@/shared/ui/button";

export type MapComplaint = {
  id: string;
  publicRef: string;
  title: string;
  type: ComplaintType;
  status: ComplaintStatus;
  priority: Priority;
  addressText: string | null;
  lat: number;
  lng: number;
};

function FitBounds({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(
      points.map((p) => [p.lat, p.lng] as [number, number]),
    );
    map.fitBounds(bounds.pad(0.2));
  }, [map, points]);
  return null;
}

function ClusteredPins({
  complaints,
  onSelect,
}: {
  complaints: MapComplaint[];
  onSelect: (id: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
    });

    for (const complaint of complaints) {
      const marker = L.circleMarker([complaint.lat, complaint.lng], {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: statusPinColor(complaint.status),
        fillOpacity: 0.95,
      });
      marker.on("click", () => onSelect(complaint.id));
      group.addLayer(marker);
    }

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map, complaints, onSelect]);

  return null;
}

export function OfficialComplaintsMap({
  complaints,
}: {
  complaints: MapComplaint[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    complaints[0]?.id ?? null,
  );
  const selected =
    complaints.find((c) => c.id === selectedId) ?? complaints[0] ?? null;

  const center = complaints[0]
    ? { lat: complaints[0].lat, lng: complaints[0].lng }
    : { lat: 28.6139, lng: 77.209 };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="-mx-4 overflow-hidden border-y border-line/80 sm:mx-0 sm:rounded-[1.5rem] sm:border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={12}
          scrollWheelZoom
          className="h-[70vh] min-h-[22rem] w-full sm:h-[28rem]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds points={complaints} />
          <ClusteredPins
            complaints={complaints}
            onSelect={setSelectedId}
          />
        </MapContainer>
      </div>

      <aside className="glass-panel rounded-[1.5rem] p-5">
        {selected ? (
          <div className="space-y-3">
            <StatusBadge status={selected.status} />
            <div>
              <p className="text-sm font-semibold text-accent">
                {selected.publicRef}
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold">
                {selected.title}
              </h2>
            </div>
            <p className="text-sm text-ink-muted">
              {COMPLAINT_TYPE_LABELS[selected.type]} ·{" "}
              {PRIORITY_LABELS[selected.priority]} priority
            </p>
            {selected.addressText ? (
              <p className="text-sm text-ink-muted">{selected.addressText}</p>
            ) : null}
            <Button asChild className="w-full">
              <Link href={`/queue/${selected.id}`}>Open complaint</Link>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">
            No mapped complaints match these filters. Reports need a map pin to
            appear here.
          </p>
        )}
      </aside>
    </div>
  );
}
