'use client'
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link';

export default function UserPermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para visualizar el diseño
  const staffMembers = [
    { id: 1, name: 'Carlos Mendoza', email: 'carlos@royalsuper.com', role: 'Admin', canCreate: true, lastActivity: 'Hace 2 horas', initials: 'CM' },
    { id: 2, name: 'Ana Silva', email: 'ana.s@royalsuper.com', role: 'Vendedor', canCreate: true, lastActivity: 'Hace 1 día', initials: 'AS' },
    { id: 3, name: 'Roberto Gomez', email: 'roberto@royalsuper.com', role: 'Vendedor', canCreate: false, lastActivity: 'Hace 3 días', initials: 'RG' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header local del Dashboard */}
      <header className="border-b border-gray-800 bg-[#111111] sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">shield_person</span>
            </div>
            <h2 className="text-lg font-black tracking-tighter uppercase italic">
              Royal<span className="text-red-600">Super</span> Admin
            </h2>
          </div>
          
          <div className="flex items-center gap-4 text-gray-400">
            <span className="material-symbols-outlined hover:text-blue-500 cursor-pointer">notifications</span>
            <div className="size-10 rounded-full bg-gradient-to-tr from-blue-600 to-red-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">AD</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto py-8 px-4 lg:px-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-gray-500">
          <span className="text-sm font-medium">Configuración</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-blue-500 text-sm font-bold">Permisos y Usuarios</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black leading-tight tracking-tight uppercase italic">
              Gestión de <span className="text-blue-600">Permisos</span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl">
              Administra los niveles de acceso internos y controla quién puede registrar nuevos clientes en la red de Royal Super.
            </p>
          </div>
          <Link href="config/new-user" className="flex min-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-xl h-12 px-6 bg-red-600 text-white text-base font-bold transition-all hover:bg-red-700 active:scale-95 shadow-lg shadow-red-900/20">
            <span className="material-symbols-outlined">person_add</span>
            <span className="truncate uppercase tracking-tighter">Nuevo Usuario</span>
          </Link>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="flex w-full items-center rounded-xl h-12 bg-[#111111] border border-gray-800 focus-within:border-blue-600 px-4 transition-all">
              <span className="material-symbols-outlined text-gray-500 mr-2">search</span>
              <input 
                className="flex w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 text-base" 
                placeholder="Buscar por nombre, email o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 rounded-xl bg-[#111111] border border-gray-800 text-sm font-bold text-white h-12 hover:border-blue-600 transition-colors">
            <span className="material-symbols-outlined text-blue-500">filter_list</span>
            Filtros
          </button>
        </div>

        {/* Contenedor de Tabla */}
        <div className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-gray-800">
                  <th className="px-6 py-4 text-gray-400 text-xs font-black uppercase tracking-widest">Miembro del Staff</th>
                  <th className="px-6 py-4 text-gray-400 text-xs font-black uppercase tracking-widest">Rol Asignado</th>
                  <th className="px-6 py-4 text-gray-400 text-xs font-black uppercase tracking-widest text-center">Crear Clientes</th>
                  <th className="px-6 py-4 text-gray-400 text-xs font-black uppercase tracking-widest">Última Actividad</th>
                  <th className="px-6 py-4 text-gray-400 text-xs font-black uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {staffMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-blue-600/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-blue-500 font-bold uppercase italic shadow-inner">
                          {member.initials}
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{member.name}</div>
                          <div className="text-gray-500 text-xs">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                        member.role === 'Admin' ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={member.canCreate} className="sr-only peer" readOnly />
                        <div className="relative w-11 h-6 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 after:shadow-md"></div>
                      </label>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-sm font-medium">
                      {member.lastActivity}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-gray-600 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#111111] rounded-2xl border border-gray-800 hover:border-red-600/50 transition-all group">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <span className="material-symbols-outlined">verified_user</span>
              <h4 className="font-black text-sm uppercase italic">Control Total</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Los administradores tienen acceso completo al sistema, incluyendo eliminación de datos y gestión de roles de otros usuarios.
            </p>
          </div>
          
          <div className="p-5 bg-[#111111] rounded-2xl border border-gray-800 hover:border-blue-600/50 transition-all group">
            <div className="flex items-center gap-2 mb-3 text-blue-600">
              <span className="material-symbols-outlined">group_add</span>
              <h4 className="font-black text-sm uppercase italic">Gestión de Clientes</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              El permiso de "Crear Clientes" permite al staff registrar nuevos perfiles y asignar beneficios de lealtad.
            </p>
          </div>

          <div className="p-5 bg-[#111111] rounded-2xl border border-gray-800 hover:border-gray-600 transition-all group">
            <div className="flex items-center gap-2 mb-3 text-gray-400">
              <span className="material-symbols-outlined">security</span>
              <h4 className="font-black text-sm uppercase italic">Auditoría</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cada cambio de permiso es registrado para cumplimiento de seguridad. Revisa los cambios en el log de actividad.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-gray-900 mt-12 text-center">
        <p className="text-xs text-gray-600 font-bold tracking-widest uppercase italic">
          © 2026 ROYAL<span className="text-red-600">SUPER</span> VENEZUELA - PANEL DE CONTROL
        </p>
      </footer>
    </div>
  );
}