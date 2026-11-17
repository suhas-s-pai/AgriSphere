import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  MapPin,
  Sprout,
  Calendar,
  Droplets,
  Plus,
  Layers,
  Phone,
  CheckCircle2,
  Clock,
  Edit2,
  X,
  AlertCircle,
  Navigation,
  Trash2,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';

const FARM_STORAGE_KEY = 'agrisphere_registered_farm_v1';

const defaultPlots = [
  {
    id: 'plot-1',
    name: 'North Field Plot A',
    area: '2.5 Acres',
    crop: 'Maize (Hybrid 900M)',
    stage: 'Vegetative Growth (Day 45)',
    soil: 'Medium Black Soil',
    irrigation: 'Drip System',
    status: 'Healthy',
    statusColor: 'bg-emerald-100 text-emerald-800',
    nextTask: 'Urea top dressing due in 3 days',
  },
  {
    id: 'plot-2',
    name: 'South Field Plot B',
    area: '1.5 Acres',
    crop: 'Groundnut (TMV-2)',
    stage: 'Pegging / Pod Formation (Day 52)',
    soil: 'Red Loamy Soil',
    irrigation: 'Sprinkler System',
    status: 'Good Condition',
    statusColor: 'bg-emerald-100 text-emerald-800',
    nextTask: 'Gypsum application next week',
  },
  {
    id: 'plot-3',
    name: 'East Garden Plot C',
    area: '1.5 Acres',
    crop: 'Tomato (S-22 Hybrid)',
    stage: 'Fruiting & Ripening',
    soil: 'Loamy Soil',
    irrigation: 'Drip System',
    status: 'Blight Monitored',
    statusColor: 'bg-amber-100 text-amber-800',
    nextTask: 'Preventive neem oil spray tomorrow morning',
  },
];

const FarmPage = () => {
  const { latitude, longitude, formattedName, isGps, city, district, state } = useLocationContext();

  const [farmData, setFarmData] = useState(() => {
    try {
      const saved = localStorage.getItem(FARM_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      farmerName: 'Ramesh Patil',
      farmName: 'Patil Agricultural Holding',
      surveyNumber: 'Survey No. 142/2',
      village: city || district || 'Rural Farm',
      totalArea: '5.5 Acres',
      waterSource: 'Borewell & Drip Irrigation',
      soilType: 'Medium Black & Loam',
      coordinates: [15.8642, 74.5218],
      plots: defaultPlots,
    };
  });

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);
  const [newPlot, setNewPlot] = useState({
    name: '',
    area: '',
    crop: '',
    soil: 'Black Soil',
    irrigation: 'Drip',
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FARM_STORAGE_KEY, JSON.stringify(farmData));
    } catch (e) {
      console.warn('Failed to persist farm data:', e);
    }
  }, [farmData]);

  const handleLocationPicked = (newCoords) => {
    setFarmData((prev) => ({
      ...prev,
      coordinates: newCoords,
    }));
  };

  const handlePinToCurrentGps = () => {
    if (latitude != null && longitude != null) {
      setFarmData((prev) => ({
        ...prev,
        coordinates: [latitude, longitude],
        village: city || district || prev.village,
      }));
      setIsEditingLocation(false);
    }
  };

  const handleAddPlot = (e) => {
    e.preventDefault();
    if (!newPlot.name || !newPlot.crop) return;

    const addedPlot = {
      id: `plot-${Date.now()}`,
      name: newPlot.name,
      area: newPlot.area || '1.0 Acre',
      crop: newPlot.crop,
      stage: 'Initial Sowing Stage',
      soil: newPlot.soil,
      irrigation: newPlot.irrigation,
      status: 'Active',
      statusColor: 'bg-emerald-100 text-emerald-800',
      nextTask: 'Initial irrigation & seedling monitoring',
    };

    setFarmData((prev) => ({
      ...prev,
      plots: [...prev.plots, addedPlot],
    }));

    setNewPlot({ name: '', area: '', crop: '', soil: 'Black Soil', irrigation: 'Drip' });
    setShowAddPlotModal(false);
  };

  const handleDeletePlot = (plotId) => {
    setFarmData((prev) => ({
      ...prev,
      plots: prev.plots.filter((p) => p.id !== plotId),
    }));
  };

  const farmMarkers = [
    {
      id: 'farmer-registered-farm',
      title: `${farmData.farmName} (${farmData.totalArea})`,
      type: 'Registered Farm Holding',
      position: farmData.coordinates,
      color: '#15803D',
      address: `${farmData.surveyNumber}, ${farmData.village}`,
      description: `Plots: ${farmData.plots.map((p) => p.crop).join(', ')}. Soil: ${farmData.soilType}.`,
    },
  ];

  if (latitude != null && longitude != null) {
    farmMarkers.push({
      id: 'user-current-gps',
      title: `📍 Your Current Location (${formattedName})`,
      type: isGps ? 'Live GPS Location' : 'Selected Location',
      position: [latitude, longitude],
      color: '#0284C7',
      description: `Current viewing location: ${formattedName}`,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Warehouse className="w-3.5 h-3.5" />
            <span>Farm Records & Field Management</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">My Farm</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Registered land property, plot boundaries, crop schedules, and genuine agricultural records.
          </p>
        </div>

        <button
          onClick={() => setShowAddPlotModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#15803D] text-white text-xs sm:text-sm font-semibold hover:bg-[#14532D] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Plot
        </button>
      </div>

      {/* Disambiguation Banner: Current GPS vs Registered Farm */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-700">
          <Navigation className="w-4 h-4 text-[#15803D] shrink-0" />
          <div>
            <span className="font-bold text-[#14532D]">Current Location: </span>
            <span className="text-slate-600">{formattedName}</span>
            <span className="mx-2 text-slate-300">•</span>
            <span className="font-bold text-[#14532D]">Registered Farm Property: </span>
            <span className="text-slate-600">
              {farmData.coordinates[0].toFixed(4)}°N, {farmData.coordinates[1].toFixed(4)}°E ({farmData.village})
            </span>
          </div>
        </div>

        {latitude != null && longitude != null && (
          <button
            onClick={handlePinToCurrentGps}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-[#DCFCE7] text-[#14532D] font-bold text-xs hover:bg-emerald-200 transition-colors shrink-0 cursor-pointer"
            title="Set registered farm pin to current coordinates"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Pin Farm to Current Location</span>
          </button>
        )}
      </div>

      {/* Farm Profile Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Farmer Profile</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">{farmData.farmerName}</h3>
          <p className="text-xs text-[#64748B] mt-0.5">{farmData.surveyNumber}, {farmData.village}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Farm Holding</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">{farmData.totalArea}</h3>
          <p className="text-xs text-[#64748B] mt-0.5">{farmData.plots.length} Active Field Plots</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Water Source</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">{farmData.waterSource}</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Reliable seasonal supply</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Soil Classification</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">{farmData.soilType}</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Tested & Documented</p>
        </div>
      </div>

      {/* Farm Location & Interactive Map Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#14532D]">Farm Geographic Location</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Coordinates: {farmData.coordinates[0].toFixed(4)}° N, {farmData.coordinates[1].toFixed(4)}° E ({farmData.village})
            </p>
          </div>

          <button
            onClick={() => setIsEditingLocation(!isEditingLocation)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isEditingLocation
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-[#F8FAF6] text-[#15803D] border border-slate-200 hover:bg-[#DCFCE7]'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditingLocation ? 'Done Adjusting Location' : 'Adjust Farm Pin on Map'}
          </button>
        </div>

        {isEditingLocation && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Click anywhere on the map to reposition your registered farm property marker.</span>
          </div>
        )}

        {/* Map */}
        <LeafletMap
          center={farmData.coordinates}
          zoom={13}
          markers={farmMarkers}
          allowLocationPick={isEditingLocation}
          onLocationSelect={handleLocationPicked}
          pickedLocation={isEditingLocation ? farmData.coordinates : null}
          height="380px"
        />
      </div>

      {/* Registered Plots Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#14532D]">Registered Field Plots ({farmData.plots.length})</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Active crops, growth progress, and scheduled field actions.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmData.plots.map((plot) => (
            <div
              key={plot.id}
              className="bg-[#F8FAF6] rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-[#15803D] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#1F2937]">{plot.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plot.statusColor}`}>
                      {plot.status}
                    </span>
                    <button
                      onClick={() => handleDeletePlot(plot.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                      title="Remove plot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 space-y-1 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Planted Crop:</span>
                    <span className="font-semibold text-[#1F2937]">{plot.crop}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Plot Area:</span>
                    <span className="font-semibold text-[#1F2937]">{plot.area}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Soil & Irrigation:</span>
                    <span className="text-[#1F2937]">{plot.soil} • {plot.irrigation}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Growth Stage:</span>
                    <span className="text-[#14532D] font-medium">{plot.stage}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 text-xs">
                <span className="text-[11px] font-semibold text-[#64748B]">Upcoming Task:</span>
                <p className="text-xs text-[#1F2937] mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                  {plot.nextTask}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Plot Modal */}
      {showAddPlotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowAddPlotModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1F2937]">Register New Farm Plot</h3>
              <button
                onClick={() => setShowAddPlotModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlot} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Plot Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Canal Plot D"
                  value={newPlot.name}
                  onChange={(e) => setNewPlot({ ...newPlot, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Area (Acres)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5 Acres"
                    value={newPlot.area}
                    onChange={(e) => setNewPlot({ ...newPlot, area: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Current Crop</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sugarcane"
                    value={newPlot.crop}
                    onChange={(e) => setNewPlot({ ...newPlot, crop: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Soil Type</label>
                  <select
                    value={newPlot.soil}
                    onChange={(e) => setNewPlot({ ...newPlot, soil: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D] bg-white"
                  >
                    <option>Black Soil</option>
                    <option>Red Loamy Soil</option>
                    <option>Clay Loam</option>
                    <option>Sandy Loam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">Irrigation Method</label>
                  <select
                    value={newPlot.irrigation}
                    onChange={(e) => setNewPlot({ ...newPlot, irrigation: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#15803D] bg-white"
                  >
                    <option>Drip System</option>
                    <option>Sprinkler</option>
                    <option>Flood / Furrow</option>
                    <option>Rainfed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlotModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white font-medium hover:bg-[#14532D] cursor-pointer"
                >
                  Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmPage;
