
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { DisasterZone, ZoneType } from '../types';
import { DISASTER_ZONES } from '../constants';
import { MapPin, Info, AlertTriangle } from 'lucide-react';

const RecenterMap: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

const MapSection: React.FC = () => {
  const [activeZone, setActiveZone] = useState<DisasterZone | null>(null);
  const [center, setCenter] = useState<[number, number]>([40.7128, -74.0060]);

  const getZoneColor = (type: ZoneType) => {
    switch (type) {
      case ZoneType.RED: return '#ef4444';
      case ZoneType.YELLOW: return '#eab308';
      case ZoneType.GREEN: return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative min-h-[400px]">
        <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {DISASTER_ZONES.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.coordinates}
              radius={zone.radius}
              pathOptions={{
                fillColor: getZoneColor(zone.type),
                color: getZoneColor(zone.type),
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.35,
              }}
              eventHandlers={{
                click: () => setActiveZone(zone),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-lg">{zone.name}</h3>
                  <p className="text-sm text-gray-600">{zone.description}</p>
                </div>
              </Popup>
            </Circle>
          ))}
          <RecenterMap coords={center} />
        </MapContainer>
        
        <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Red: High Danger
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Yellow: Relief Zone
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-80 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Zone Intelligence
          </h2>
          
          {activeZone ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className={`p-3 rounded-lg flex items-start gap-2 ${activeZone.type === ZoneType.RED ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">{activeZone.name}</h4>
                  <p className="text-sm opacity-90">{activeZone.description}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Safety Instructions</h4>
                <ul className="space-y-2">
                  {activeZone.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => setActiveZone(null)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
              <MapPin className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Click on a zone circle on the map to view detailed safety protocols.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSection;
