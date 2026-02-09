
import React, { useState } from 'react';
import { Search, MapPin, Globe, Cloud, Hospital, Shield, Landmark, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { getIndiaLocationDetails, IndiaLocationData } from '../services/geminiService';

const IndiaExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IndiaLocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getIndiaLocationDetails(query);
      setData(result);
    } catch (err) {
      setError("Location query failed. Use specific Indian administrative names.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="card-flat p-8 text-center bg-gray-50 border-gray-300">
        <h2 className="text-xl font-black text-[#2c3e50] mb-2 uppercase tracking-tight">Regional Database Explorer</h2>
        <p className="text-xs text-gray-500 mb-6 font-bold">Search for any Indian administrative region for essential logistical metadata.</p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search City, District or Taluka (e.g., Delhi, Amravati)..."
            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-sm text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 font-bold text-xs uppercase"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Query Database"}
          </button>
        </form>
        {error && <div className="mt-4 text-xs font-bold text-red-600">{error}</div>}
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card-flat p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-[10px] mb-4">
                  <MapPin className="w-3 h-3" /> Census Information
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-2">{data.name}</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">State</p>
                    <p className="text-sm font-bold text-gray-800">{data.state}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">District</p>
                    <p className="text-sm font-bold text-gray-800">{data.district}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">PIN Code</p>
                    <p className="text-sm font-bold text-gray-800">{data.pinCode}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Population</p>
                    <p className="text-sm font-bold text-gray-800">{data.population}</p>
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="card-flat p-5">
                 <h4 className="font-bold text-xs text-gray-800 uppercase mb-4 flex items-center gap-2">
                   <Landmark className="w-4 h-4 text-orange-600" /> Key Sites
                 </h4>
                 <ul className="space-y-1">
                   {data.famousPlaces.map((place, i) => (
                     <li key={i} className="text-xs font-bold text-gray-600 p-2 border-b border-gray-50 last:border-0">• {place}</li>
                   ))}
                 </ul>
               </div>

               <div className="card-flat p-5">
                 <h4 className="font-bold text-xs text-gray-800 uppercase mb-4 flex items-center gap-2">
                   <Globe className="w-4 h-4 text-blue-600" /> Metadata
                 </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                       <span className="text-[9px] font-bold text-gray-400 uppercase">Languages</span>
                       <span className="text-xs font-bold">{data.languages.join(', ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                       <span className="text-[9px] font-bold text-gray-400 uppercase">Weather</span>
                       <span className="text-xs font-bold">{data.weatherOverview}</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-flat bg-red-600 p-5 text-white">
              <h4 className="text-[9px] font-bold uppercase mb-4 tracking-widest text-red-200">National Helplines</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span className="text-[10px] font-bold">General</span>
                  <span className="text-xl font-black">112</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span className="text-[10px] font-bold">Medical</span>
                  <span className="text-xl font-black">108</span>
                </div>
              </div>
            </div>

            <div className="card-flat p-5">
               <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Relief Infrastructure</h4>
               <div className="space-y-4">
                  <div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-2">Hospitals</p>
                    {data.nearbyHospitals.map((h, i) => <p key={i} className="text-[10px] font-bold text-gray-700 mb-1">• {h}</p>)}
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mb-2">Police Stations</p>
                    {data.nearbyPoliceStations.map((p, i) => <p key={i} className="text-[10px] font-bold text-gray-700 mb-1">• {p}</p>)}
                  </div>
               </div>
            </div>
          </div>

          {data.sources && data.sources.length > 0 && (
            <div className="md:col-span-3 card-flat p-4 bg-gray-50 border-gray-200">
              <h4 className="text-[9px] font-bold text-gray-400 uppercase mb-3 px-2">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                {data.sources.map((source, i) => (
                  <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 px-3 py-1 text-[9px] font-bold text-blue-600 hover:border-blue-300">
                    {source.title.substring(0, 30)}...
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IndiaExplorer;
