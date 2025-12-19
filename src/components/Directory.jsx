import React, { useState } from 'react';
import { Search, MapPin, Filter, Building2, Stethoscope } from 'lucide-react';

export default function Directory({ doctors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const WA_NUMBER = "60166062534"; 

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty).filter(Boolean))];

  const generateId = (name) => {
    if (!name) return 'unknown';
    return name.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/^-+|-+$/g, '');   
  };

  const getStateFromLocation = (fullAddress) => {
    if (!fullAddress) return null;
    const lowerAddr = fullAddress.toLowerCase();
    if (lowerAddr.includes('kuala lumpur') || lowerAddr.includes('kl')) return 'Kuala Lumpur';
    if (lowerAddr.includes('selangor') || lowerAddr.includes('subang') || lowerAddr.includes('petaling')) return 'Selangor';
    if (lowerAddr.includes('penang') || lowerAddr.includes('pulau pinang') || lowerAddr.includes('georgetown')) return 'Penang';
    if (lowerAddr.includes('johor')) return 'Johor';
    if (lowerAddr.includes('melaka')) return 'Melaka';
    return 'Malaysia';
  };

  // ⚡ NEW: Helper to split specialty string
  const parseSpecialty = (raw) => {
    if (!raw) return { main: '', sub: '' };
    
    // Split by "Subspesialis:" or "Subspesialis" or just a comma if formatted that way
    // Regex explanation: Looks for comma followed by optional space, then "Subspesialis" followed by optional colon
    const parts = raw.split(/,\s*subspesialis:?|subspesialis:?/i);
    
    return {
      main: parts[0] ? parts[0].trim() : '',
      sub: parts[1] ? parts[1].trim() : ''
    };
  };

  const filteredDoctors = doctors.filter(doctor => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      doctor.name?.toLowerCase().includes(term) ||
      doctor.hospital?.toLowerCase().includes(term) ||
      doctor.specialty?.toLowerCase().includes(term) ||
      doctor.location?.toLowerCase().includes(term)
    );
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="w-full">
      {/* === SEARCH & FILTER BAR === */}
      <div className="bg-white p-2 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search specialist, hospital..."
            className="w-full pl-12 pr-4 py-3 bg-transparent rounded-xl focus:outline-none focus:bg-slate-50 transition-colors text-slate-800 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-px md:h-10 bg-slate-100 md:w-px my-auto"></div>
        <div className="relative min-w-[220px]">
          <select
            className="w-full px-4 py-3 bg-transparent rounded-xl focus:outline-none focus:bg-slate-50 cursor-pointer text-slate-600 font-medium"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map((spec, idx) => (
              <option key={idx} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* === RESULTS GRID === */}
      {filteredDoctors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => {
            const docId = generateId(doctor.name);
            const waLink = `https://wa.me/${WA_NUMBER}?text=Hi Ocha, I would like to book an appointment with ${doctor.name}`;
            const stateName = getStateFromLocation(doctor.location);
            
            // Extract split specialties
            const { main, sub } = parseSpecialty(doctor.specialty);

            return (
              <div key={index} className="bg-white rounded-[20px] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                
                {/* Header: Image & Info */}
                <div className="flex items-start gap-5 mb-5">
                  <div className="relative shrink-0">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-50 shadow-sm bg-slate-100"
                      onError={(e) => { e.target.src = 'https://placehold.co/100?text=Dr'; }} 
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Verified Specialist"></div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight mb-1 truncate">
                      {doctor.name}
                    </h3>
                    
                    {/* === SPLIT SPECIALTY DISPLAY === */}
                    <div className="mb-3">
                        <p className="text-[10px] font-bold text-[#276CA1] uppercase tracking-widest">
                        {main}
                        </p>
                        {sub && (
                        <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                            {sub}
                        </p>
                        )}
                    </div>
                    
                    <div className="space-y-1.5 border-t border-slate-50 pt-2">
                       <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{doctor.hospital}</span>
                       </div>
                       {stateName && (
                         <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="truncate font-medium text-slate-600">{stateName}</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-5 border-t border-slate-50 flex gap-3">
                  <a 
                    href={`/doctor/${docId}`}
                    className="w-[35%] py-2.5 flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold rounded-xl transition-all text-xs"
                  >
                    Profile
                  </a>
                  
                  <a 
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[65%] py-2.5 flex items-center justify-center bg-[#276CA1] hover:bg-[#1f5682] text-white font-bold rounded-xl transition-all text-xs shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium mb-4">No specialists found.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedSpecialty('All'); }}
            className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}