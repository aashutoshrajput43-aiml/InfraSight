import React, { useEffect, useRef } from "react";
import L from "leaflet";

const INDORE_CENTER = [22.7196, 75.8577];

// Create priority pill divIcon
function createPriorityIcon(color, score) {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border-radius: 50%;
        border: 2.5px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: 800;
        font-family: Inter, sans-serif;
      ">${score}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function getColorForScore(score) {
  if (score >= 80) return "#ef4444"; // red
  if (score >= 65) return "#f97316"; // orange
  if (score >= 50) return "#eab308"; // yellow
  return "#22c55e"; // green
}

export function AdminIssueMap({ issues = [], selectedIssue = null, onSelectIssue }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletInstance.current) {
      leafletInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(INDORE_CENTER, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(leafletInstance.current);

      markersLayer.current = L.layerGroup().addTo(leafletInstance.current);
    }

    return () => {
      // Keep instance alive or cleanup
    };
  }, []);

  useEffect(() => {
    if (!leafletInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    issues.forEach((iss) => {
      const color = getColorForScore(iss.priority_score || 50);
      const icon = createPriorityIcon(color, Math.round(iss.priority_score || 50));
      const marker = L.marker([iss.latitude, iss.longitude], { icon });

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; padding: 2px;">
          <b style="font-size: 13px; text-transform: capitalize;">${iss.type?.replace("_", " ")}</b>
          <div style="color: #64748b; margin: 2px 0;">${iss.address || iss.area}</div>
          <div style="margin-top: 4px;">Priority: <b style="color:${color}">${Math.round(iss.priority_score)} / 100</b></div>
          <div style="font-size: 11px; color: #0284c7; font-weight: 600; margin-top: 3px;">
            ${iss.report_count} citizen report(s)
          </div>
        </div>
      `);

      marker.on("click", () => {
        if (onSelectIssue) onSelectIssue(iss);
      });

      marker.addTo(markersLayer.current);
    });
  }, [issues, onSelectIssue]);

  return <div ref={mapRef} className="w-full h-full min-h-[460px] rounded-[14px]" />;
}

export function HeatmapView({ points = [], mode = "heatmap", onSelectIssue }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const heatLayer = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletInstance.current) {
      leafletInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(INDORE_CENTER, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(leafletInstance.current);

      heatLayer.current = L.layerGroup().addTo(leafletInstance.current);
      markersLayer.current = L.layerGroup().addTo(leafletInstance.current);
    }
  }, []);

  useEffect(() => {
    if (!leafletInstance.current || !heatLayer.current || !markersLayer.current) return;

    heatLayer.current.clearLayers();
    markersLayer.current.clearLayers();

    // Render Heatmap density gradient circles
    if (mode === "heatmap" || mode === "both") {
      points.forEach((p) => {
        const weight = p.weight || (p.score ? p.score / 100 : 0.6);
        const radius = 350 + weight * 450;
        const hue = Math.round((1 - weight) * 120); // 0 red, 120 green
        const circle = L.circle([p.lat, p.lng], {
          radius,
          color: "transparent",
          fillColor: `hsl(${hue}, 95%, 48%)`,
          fillOpacity: 0.38,
        });
        circle.addTo(heatLayer.current);
      });
    }

    // Render Markers
    if (mode === "markers" || mode === "both") {
      points.forEach((p) => {
        const color = getColorForScore(p.score || 50);
        const icon = createPriorityIcon(color, Math.round(p.score || 50));
        const marker = L.marker([p.lat, p.lng], { icon });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px;">
            <b style="font-size: 13px; text-transform: capitalize;">${p.type?.replace("_", " ")}</b>
            <div style="color: #64748b;">${p.area}</div>
            <div>Priority Score: <b style="color:${color}">${Math.round(p.score || 50)}</b></div>
          </div>
        `);
        marker.addTo(markersLayer.current);
      });
    }
  }, [points, mode]);

  return <div ref={mapRef} className="w-full h-full min-h-[480px] rounded-[14px]" />;
}

export function SinglePinMap({ lat = 22.7289, lng = 75.8732, onPositionChange }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletInstance.current) {
      leafletInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(leafletInstance.current);

      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="font-size: 28px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      markerRef.current = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(leafletInstance.current);

      markerRef.current.on("dragend", (e) => {
        const pos = e.target.getLatLng();
        if (onPositionChange) onPositionChange(pos.lat, pos.lng);
      });

      leafletInstance.current.on("click", (e) => {
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        }
        if (onPositionChange) onPositionChange(e.latlng.lat, e.latlng.lng);
      });
    }
  }, [lat, lng, onPositionChange]);

  return <div ref={mapRef} className="w-full h-full min-h-[140px] rounded-lg" />;
}
