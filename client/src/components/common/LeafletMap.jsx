import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink, Loader2 } from 'lucide-react';

const BELAGAVI_COORDS = [15.8497, 74.4977];

const loadLeafletScript = () => {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const existing = document.querySelector('script[data-leaflet="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.dataset.leaflet = 'true';
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const LeafletMap = ({
  center = BELAGAVI_COORDS,
  zoom = 12,
  markers = [],
  selectedId = null,
  onSelectMarker = null,
  allowLocationPick = false,
  onLocationSelect = null,
  pickedLocation = null,
  height = '420px',
  className = '',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const pickedMarkerRef = useRef(null);
  const [loading, setLoading] = useState(!window.L);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    loadLeafletScript()
      .then((L) => {
        if (!isMounted || !mapContainerRef.current) return;
        setLoading(false);

        // Avoid re-initialization if already exists
        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: center,
            zoom: zoom,
            zoomControl: false,
            attributionControl: true,
          });

          // OpenStreetMap Tile Layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
          }).addTo(map);

          // Custom zoom control in bottom right
          L.control.zoom({ position: 'bottomright' }).addTo(map);

          markersGroupRef.current = L.layerGroup().addTo(map);
          mapInstanceRef.current = map;

          // Location pick listener if enabled
          if (allowLocationPick && onLocationSelect) {
            map.on('click', (e) => {
              const { lat, lng } = e.latlng;
              onLocationSelect([lat, lng]);
            });
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load Leaflet:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync center & zoom when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center?.[0], center?.[1], zoom]);

  // Update Markers
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    markers.forEach((item) => {
      if (!item.position || !Array.isArray(item.position)) return;

      const [lat, lng] = item.position;
      const isSelected = selectedId === item.id;
      const markerColor = item.color || '#15803D';

      // SVG Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${isSelected ? '#14532D' : markerColor};
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: #FFFFFF;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 36 : 30],
        popupAnchor: [0, isSelected ? -36 : -30],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Clean Popup Content
      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px; padding: 2px;">
          ${item.type ? `
            <span style="
              display: inline-block;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              color: ${markerColor};
              background: #F1F5F9;
              padding: 2px 8px;
              border-radius: 4px;
              margin-bottom: 6px;
            ">${item.type}</span>
          ` : ''}
          <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #1F2937;">${item.title || 'Location'}</h4>
          ${item.description ? `<p style="margin: 4px 0 0; font-size: 11px; color: #64748B; line-height: 1.4;">${item.description}</p>` : ''}
          ${item.address ? `<p style="margin: 4px 0 0; font-size: 11px; color: #64748B;">📍 ${item.address}</p>` : ''}
          ${item.contact ? `<p style="margin: 2px 0 0; font-size: 11px; color: #64748B;">📞 ${item.contact}</p>` : ''}
          ${item.rate ? `<p style="margin: 4px 0 0; font-size: 11px; font-weight: 700; color: #15803D;">🏷️ ${item.rate}</p>` : ''}
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="
              font-size: 11px;
              font-weight: 700;
              color: #15803D;
              text-decoration: none;
            ">Get Directions ↗</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (onSelectMarker) {
        marker.on('click', () => onSelectMarker(item));
      }

      markersGroupRef.current.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [markers, selectedId, onSelectMarker]);

  // Update Picked Marker if allowLocationPick
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !allowLocationPick) return;

    if (pickedMarkerRef.current) {
      mapInstanceRef.current.removeLayer(pickedMarkerRef.current);
      pickedMarkerRef.current = null;
    }

    if (pickedLocation && Array.isArray(pickedLocation)) {
      const pinIcon = L.divIcon({
        className: 'picked-map-pin',
        html: `
          <div style="
            background-color: #DC2626;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: #FFFFFF;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      pickedMarkerRef.current = L.marker(pickedLocation, { icon: pinIcon }).addTo(mapInstanceRef.current);
      pickedMarkerRef.current.bindPopup('<b>Selected Location</b><br>Lat: ' + pickedLocation[0].toFixed(4) + ', Lng: ' + pickedLocation[1].toFixed(4)).openPopup();
    }
  }, [pickedLocation, allowLocationPick]);

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 ${className}`}
      style={{ height }}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs text-[#64748B]">
          <Loader2 className="w-6 h-6 animate-spin text-[#15803D] mb-2" />
          <p className="text-xs font-semibold">Loading interactive map...</p>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};

export default LeafletMap;

