import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Crosshair,
  ExternalLink,
  Layers3,
  MapPin,
  Navigation,
  Search,
  Warehouse,
  Wheat,
} from 'lucide-react';

const CENTER = [15.8497, 74.4977];

const locations = [
  {
    id: 'apmc',
    type: 'APMC / Mandi',
    title: 'APMC Market · Belagavi',
    description: 'Use this point as the market discovery entry for APMC and mandi services.',
    position: [15.8583, 74.5062],
    color: '#1b8048',
  },
  {
    id: 'storage',
    type: 'Cold Storage',
    title: 'Cold Storage & Warehouse',
    description: 'Storage discovery point. Connect the backend directory here later.',
    position: [15.8424, 74.5124],
    color: '#2563eb',
  },
  {
    id: 'inputs',
    type: 'Agri Inputs',
    title: 'Agri Input Dealers & Nurseries',
    description: 'Find seed, fertilizer and nursery resources around the selected area.',
    position: [15.8531, 74.4868],
    color: '#d97706',
  },
  {
    id: 'kvk',
    type: 'KVK / Extension',
    title: 'Krishi Vigyan Kendra',
    description: 'Extension and expert-support discovery point for farmers.',
    position: [15.8277, 74.5211],
    color: '#7c3aed',
  },
];

const categories = [
  { id: 'all', label: 'All places', icon: Layers3 },
  { id: 'APMC / Mandi', label: 'Markets', icon: Wheat },
  { id: 'Cold Storage', label: 'Storage', icon: Warehouse },
  { id: 'Agri Inputs', label: 'Agri inputs', icon: MapPin },
  { id: 'KVK / Extension', label: 'KVKs', icon: Navigation },
];

const loadLeaflet = () => new Promise((resolve, reject) => {
  if (window.L) {
    resolve(window.L);
    return;
  }

  const existingScript = document.querySelector('script[data-leaflet="true"]');
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(window.L), { once: true });
    existingScript.addEventListener('error', reject, { once: true });
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.dataset.leaflet = 'true';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.async = true;
  script.dataset.leaflet = 'true';
  script.onload = () => resolve(window.L);
  script.onerror = reject;
  document.body.appendChild(script);
});

const MapsPage = () => {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [locationMessage, setLocationMessage] = useState('Belagavi, Karnataka');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const filteredLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return locations.filter((place) => {
      const categoryMatch = activeCategory === 'all' || place.type === activeCategory;
      const queryMatch = !query || `${place.title} ${place.type} ${place.description}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapElement.current || mapRef.current) return;

        const map = L.map(mapElement.current, { zoomControl: true, scrollWheelZoom: true }).setView(CENTER, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);
        mapRef.current = map;
        setMapReady(true);
      })
      .catch(() => setMapReady(false));

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredLocations.forEach((place) => {
      const icon = window.L.divIcon({
        className: 'agri-map-marker',
        html: `<span style="--marker-color:${place.color}">${place.type === 'APMC / Mandi' ? 'M' : place.type === 'Cold Storage' ? 'S' : place.type === 'Agri Inputs' ? 'A' : 'K'}</span>`,
        iconSize: [40, 40],
        iconAnchor: [20, 38],
        popupAnchor: [0, -38],
      });

      const marker = window.L.marker(place.position, { icon }).addTo(mapRef.current);
      marker.bindPopup(`
        <div style="min-width:210px">
          <strong style="font-size:14px">${place.title}</strong>
          <div style="margin-top:5px;color:#64748b;font-size:12px;line-height:1.5">${place.description}</div>
        </div>
      `);
      marker.on('click', () => setSelectedPlace(place));
      markersRef.current.push(marker);
    });

    if (filteredLocations.length) {
      const bounds = window.L.latLngBounds(filteredLocations.map((place) => place.position));
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [filteredLocations]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not supported by this browser.');
      return;
    }

    setLocationMessage('Finding your location...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (mapRef.current && window.L) {
          mapRef.current.setView([coords.latitude, coords.longitude], 14);
          window.L.circleMarker([coords.latitude, coords.longitude], {
            radius: 9,
            color: '#ffffff',
            weight: 3,
            fillColor: '#1b8048',
            fillOpacity: 1,
          }).addTo(mapRef.current).bindPopup('You are here').openPopup();
        }
        setLocationMessage('Showing your current location');
      },
      () => setLocationMessage('Location permission was not granted.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openDirections = (place) => {
    const [lat, lng] = place.position;
    window.open(`https://www.openstreetmap.org/directions?from=&to=${lat}%2C${lng}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[70vh] pb-16">
      <section className="bg-agri-800 text-white">
        <div className="website-section py-14 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-agri-100">
                Maps & Nearby
              </span>
            </div>
            <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl">Find agricultural services near you.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-agri-100 sm:text-base sm:leading-7">
              Explore markets, storage facilities, agri-input resources and KVK support on an interactive OpenStreetMap view.
            </p>
          </div>
        </div>
      </section>

      <section className="website-section py-10 sm:py-12">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-agri-600">Explore nearby</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Agriculture map</h2>
            <p className="mt-2 text-sm text-slate-500">{locationMessage}</p>
          </div>
          <button
            type="button"
            onClick={useMyLocation}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-agri-200 bg-white px-4 py-3 text-sm font-extrabold text-agri-700 shadow-sm hover:bg-agri-50"
          >
            <Crosshair className="h-4 w-4" /> Use my location
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-100 p-4 sm:p-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search APMC, storage, agri inputs or KVK..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-agri-400 focus:bg-white focus:ring-4 focus:ring-agri-100"
                />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const active = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-extrabold transition ${active ? 'bg-agri-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-agri-50 hover:text-agri-700'}`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative h-[430px] sm:h-[520px]">
              <div ref={mapElement} className="h-full w-full" />
              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 p-6 text-center">
                  <div>
                    <MapPin className="mx-auto h-8 w-8 text-agri-600" />
                    <p className="mt-3 text-sm font-extrabold text-slate-800">Loading interactive map...</p>
                    <p className="mt-1 text-xs text-slate-500">The map uses OpenStreetMap and Leaflet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] xl:sticky xl:top-28">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Map results</p>
                <h3 className="mt-1 text-lg font-black text-slate-950">Nearby resources</h3>
              </div>
              <span className="rounded-full bg-agri-50 px-2.5 py-1 text-xs font-black text-agri-700">{filteredLocations.length}</span>
            </div>

            <div className="mt-5 space-y-3">
              {filteredLocations.length ? filteredLocations.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlace(place);
                    mapRef.current?.setView(place.position, 15);
                    markersRef.current.find((marker) => marker.getLatLng().lat === place.position[0] && marker.getLatLng().lng === place.position[1])?.openPopup();
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${selectedPlace?.id === place.id ? 'border-agri-300 bg-agri-50' : 'border-slate-200 bg-white hover:border-agri-200 hover:bg-agri-50/40'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-700">{place.type.split(' ')[0][0]}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900">{place.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{place.description}</p>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No locations match your search.</div>
              )}
            </div>

            {selectedPlace && (
              <div className="mt-4 rounded-2xl bg-agri-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-agri-700">Selected location</p>
                <p className="mt-1 text-sm font-black text-slate-900">{selectedPlace.title}</p>
                <button
                  type="button"
                  onClick={() => openDirections(selectedPlace)}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-agri-700 hover:text-agri-900"
                >
                  Get directions <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['OpenStreetMap', 'Open map data for exploring roads and nearby places.'],
            ['Live location', 'Use your browser location to center the map around you.'],
            ['API-ready', 'The seeded points can later be replaced with your team database/API data.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-extrabold text-slate-900">{title}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MapsPage;
