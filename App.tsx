
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  Heart, 
  PhoneCall, 
  MoreHorizontal, 
  Languages,
  AlertTriangle,
  Menu,
  X,
  Camera,
  Globe
} from 'lucide-react';
import MapSection from './components/MapSection';
import NewsFeed from './components/NewsFeed';
import EmergencyServices from './components/EmergencyServices';
import VolunteerDonation from './components/VolunteerDonation';
import PlaceSearch from './components/PlaceSearch';
import IncidentReporting from './components/IncidentReporting';
import IndiaExplorer from './components/IndiaExplorer';
import AdminDashboard from './components/AdminDashboard';
import { LANGUAGES, EMERGENCY_CONTACTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'report' | 'explorer' | 'services' | 'support' | 'admin'>('map');
  const [showSOS, setShowSOS] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    let timer: any;
    if (showSOS && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showSOS, countdown]);

  const handleSOS = () => {
    setShowSOS(true);
    setCountdown(5);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 2016 Era Top Navigation Bar */}
      <nav className="bg-[#2c3e50] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <ShieldAlert className="w-8 h-8 text-white" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">RescueNet</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Government Services Portal</span>
              </div>
              
              <div className="hidden lg:flex ml-10 space-x-4">
                {[
                  { id: 'map', label: 'Surveillance Zones' },
                  { id: 'report', label: 'Report Incident' },
                  { id: 'explorer', label: 'India Explorer' },
                  { id: 'services', label: 'Emergency Services' },
                  { id: 'support', label: 'Volunteer' },
                  { id: 'admin', label: 'Admin Panel' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`px-3 py-2 text-sm font-medium hover:bg-[#34495e] transition-colors border-b-2 ${activeTab === item.id ? 'border-blue-400 bg-[#34495e]' : 'border-transparent'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs border border-gray-600 px-3 py-1 rounded">
                <Languages className="w-3 h-3" />
                <select 
                  className="bg-transparent focus:outline-none cursor-pointer"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-[#2c3e50]">{l.name}</option>)}
                </select>
              </div>
              <button 
                onClick={handleSOS}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 font-bold text-sm uppercase tracking-wider"
              >
                SOS Emergency
              </button>
              <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#34495e] text-white p-4 space-y-2">
          {['map', 'report', 'explorer', 'services', 'support', 'admin'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setIsMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm font-bold uppercase ${activeTab === tab ? 'bg-blue-600' : ''}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* SOS Modal Overlay */}
      {showSOS && (
        <div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-6">
          <div className="bg-white rounded p-10 max-w-sm w-full text-center">
            <h2 className="text-3xl font-black text-red-600 mb-4">EMERGENCY ALERT</h2>
            <div className="text-5xl font-black mb-6">{countdown}</div>
            <p className="text-gray-600 mb-8">Location data will be broadcasted to local authorities upon timer completion.</p>
            <button 
              onClick={() => setShowSOS(false)}
              className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold uppercase tracking-widest"
            >
              Cancel Alert
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <h2 className="section-header text-2xl uppercase">
              {activeTab === 'map' && "Surveillance & Active Disaster Zones"}
              {activeTab === 'report' && "Incident Reporting & Assessment"}
              {activeTab === 'explorer' && "Indian Regional Intelligence"}
              {activeTab === 'services' && "Local Emergency Facilities"}
              {activeTab === 'support' && "Volunteer & Donation Portal"}
              {activeTab === 'admin' && "System Administration Dashboard"}
            </h2>

            <div className="min-h-[600px]">
              {activeTab === 'map' && (
                <div className="space-y-6">
                  <PlaceSearch />
                  <div className="border border-gray-300 shadow-sm">
                    <MapSection />
                  </div>
                </div>
              )}
              {activeTab === 'report' && <IncidentReporting />}
              {activeTab === 'explorer' && <IndiaExplorer />}
              {activeTab === 'services' && <EmergencyServices />}
              {activeTab === 'support' && <VolunteerDonation />}
              {activeTab === 'admin' && <AdminDashboard />}
            </div>
          </div>

          {/* Sidebar News & Quick Contacts */}
          <aside className="space-y-6">
            <NewsFeed />
            
            <div className="card-flat overflow-hidden">
              <div className="bg-[#2c3e50] text-white px-4 py-3 font-bold text-sm uppercase">Emergency Contact List</div>
              <div className="p-4 space-y-3">
                {EMERGENCY_CONTACTS.map((contact, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold text-gray-500">{contact.label}</span>
                    <a href={`tel:${contact.number}`} className="text-blue-600 font-bold hover:underline">{contact.number}</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-flat p-4 text-center">
              <h3 className="font-bold text-gray-800 mb-2">Resource Status</h3>
              <div className="w-full bg-gray-200 h-4 rounded-sm overflow-hidden mb-2">
                <div className="bg-green-500 h-full w-[84%]"></div>
              </div>
              <p className="text-[10px] font-bold text-gray-400">Shelter Capacity: 84% OCCUPIED</p>
            </div>
          </aside>
        </div>
      </main>

      {/* 2016 Era Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 py-8 text-center mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Contact Us</a>
            </div>
            <span>© 2016-2024 RescueNet Disaster Management Authority. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
