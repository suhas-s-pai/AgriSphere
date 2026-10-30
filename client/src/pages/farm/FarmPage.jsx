import React, { useState } from 'react';
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
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

// Initial farm plots data
const initialPlots = [
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
  const [farmLocation, setFarmLocation] = useState([15.8642, 74.5218]);
  const [plots, setPlots] = useState(initialPlots);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);
  const [newPlot, setNewPlot] = useState({
    name: '',
    area: '',
    crop: '',
    soil: 'Black Soil',
    irrigation: 'Drip',
  });

  const farmMarkers = [
    {
      id: 'farmer-plot',
      title: 'Ramesh Patil Farm (5.5 Acres)',
      type: 'Registered Farm',
      position: farmLocation,
      color: '#15803D',
      address: 'Survey No. 142/2, Sambra Road, Belagavi Rural',
      contact: '+91 98451 22910',
      description: 'Cultivating Maize (2.5 ac), Groundnut (1.5 ac), and Tomato (1.5 ac).',
    },
  ];

  const handleLocationPicked = (newCoords) => {
    setFarmLocation(newCoords);
  };

  const handleAddPlot = (e) => {
    e.preventDefault();
    if (!newPlot.name || !newPlot.crop) return;

    setPlots([
      ...plots,
      {
        id: `plot-${Date.now()}`,
        name: newPlot.name,
        area: newPlot.area || '1.0 Acre',
        crop: newPlot.crop,
        stage: 'Initial Sowing Stage',
        soil: newPlot.soil,
        irrigation: newPlot.irrigation,
        status: 'Recently Added',
        statusColor: 'bg-emerald-100 text-emerald-800',
        nextTask: 'First irrigation cycle scheduled',
      },
    ]);

    setNewPlot({ name: '', area: '', crop: '', soil: 'Black Soil', irrigation: 'Drip' });
    setShowAddPlotModal(false);
  };

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
            Track registered field plots, crop schedules, farm location marker, and field activity logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddPlotModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#15803D] text-white text-xs sm:text-sm font-semibold hover:bg-[#14532D] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Plot
        </button>
      </div>

      {/* Farm Profile Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Farmer Profile</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">Ramesh Patil</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Sambra Road, Belagavi</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Farm Holding</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">5.5 Acres</h3>
          <p className="text-xs text-[#64748B] mt-0.5">3 Active Field Plots</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Water Source</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">Borewell & Drip</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Reliable seasonal supply</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Soil Classification</p>
          <h3 className="text-base font-bold text-[#1F2937] mt-1">Medium Black & Loam</h3>
          <p className="text-xs text-[#64748B] mt-0.5">pH 7.2 (Near Neutral)</p>
        </div>
      </div>

      {/* Farm Location & Interactive Map Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#14532D]">Farm Geographic Location</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Coordinates: {farmLocation[0].toFixed(4)}° N, {farmLocation[1].toFixed(4)}° E (Belagavi Rural)
            </p>
          </div>

          <button
            onClick={() => setIsEditingLocation(!isEditingLocation)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
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
            <span>Click anywhere on the map to reposition your farm plot marker.</span>
          </div>
        )}

        {/* Map */}
        <LeafletMap
          center={farmLocation}
          zoom={13}
          markers={farmMarkers}
          allowLocationPick={isEditingLocation}
          onLocationSelect={handleLocationPicked}
          pickedLocation={isEditingLocation ? farmLocation : null}
          height="380px"
        />
      </div>

      {/* Registered Plots Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#14532D]">Registered Field Plots ({plots.length})</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Active crops, growth progress, and scheduled field actions.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plots.map((plot) => (
            <div
              key={plot.id}
              className="bg-[#F8FAF6] rounded-xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-[#15803D] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#1F2937]">{plot.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plot.statusColor}`}>
                    {plot.status}
                  </span>
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
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
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
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white font-medium hover:bg-[#14532D]"
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
