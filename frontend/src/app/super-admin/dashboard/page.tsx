'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { ShieldCheck, User, Building } from 'lucide-react';

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const [serverProfile, setServerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setServerProfile(res.data);
      } catch (err: any) {
        setError('No se pudo cargar la información segura del servidor.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Control Global</h1>
        <p className="text-gray-500 mt-2 font-medium">Bienvenido, valida el estado del ecosistema Meys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-600">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Estado Sistema</p>
            <p className="text-xl font-bold text-gray-900">100% Activo</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl text-blue-600">
            <Building size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tenants</p>
            <p className="text-xl font-bold text-gray-900">0 Empresas</p>
          </div>
        </div>
      </div>

      {/* Multi-Tenant Security Check Block */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-10">
        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Validación de Seguridad Multi-Tenant</h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              Confirmación de enlace Backend ↔ Frontend 
            </p>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
             <div className="flex justify-center py-8">
               <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
             </div>
          ) : error ? (
            <div className="text-red-700 bg-red-50 p-4 rounded-xl text-sm font-medium border border-red-200 flex items-center gap-3">
               <span>⚠️</span> {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <User size={14}/> ID de Sesión
                </p>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                   <p className="text-gray-800 font-mono text-sm break-all">
                     {serverProfile?.id}
                   </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Building size={14}/> Company ID
                </p>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                   <span className={`inline-flex items-center font-mono py-1 px-3 rounded-lg text-sm font-bold shadow-sm ${
                        serverProfile?.companyId === null 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                          : 'bg-white text-gray-800'
                      }`}>
                     {serverProfile?.companyId === null ? 'NULL (Acceso Super Admin)' : serverProfile?.companyId}
                   </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <User size={14}/> Identidad Confirmada
                </p>
                <p className="text-gray-900 font-bold text-lg">{serverProfile?.email}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldCheck size={14}/> Rol de Seguridad
                </p>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  {serverProfile?.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
