import React, { useState } from 'react';
import { Search, Building2, Globe, Calendar } from 'lucide-react';

export default function Directory({ doctors }) {
    const [filterSpecialty, setFilterSpecialty] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const specialties = ['All', ...new Set(doctors.map(d => d.specialty).filter(s => s && s !== "Unknown"))];
    
    const filtered = doctors.filter(d => {
        const matchesSpec = filterSpecialty === 'All' || d.specialty === filterSpecialty;
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSpec && matchesSearch;
    });

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl text-slate-900 mb-4">Find a Specialist</h1>
                <p className="text-slate-500">{doctors.length} Verified Specialists</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 mb-8 max-w-4xl mx-auto">
                <input type="text" placeholder="Search..." className="flex-1 px-4 py-2 bg-slate-50 border rounded-lg" onChange={e => setSearchTerm(e.target.value)} />
                <select className="w-64 px-4 py-2 bg-slate-50 border rounded-lg" onChange={e => setFilterSpecialty(e.target.value)}>
                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(doc => (
                    <div key={doc.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition">
                        <div className="flex gap-4 mb-4">
                            <img src={doc.image} className="w-16 h-16 rounded-full bg-slate-100 object-cover" />
                            <div>
                                <h3 className="font-bold text-lg">{doc.name}</h3>
                                <p className="text-indigo-600 text-sm">{doc.specialty}</p>
                            </div>
                        </div>
                         <a href={`/doctor/${doc.id}`} className="block w-full py-2 bg-indigo-50 text-indigo-600 text-center rounded-lg hover:bg-indigo-600 hover:text-white transition">View Profile</a>
                    </div>
                ))}
            </div>
        </div>
    );
}