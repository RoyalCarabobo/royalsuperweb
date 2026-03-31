'use client';
import { useEffect, useState } from 'react';
import { StatsServices } from '@/services/stats';
import Link from 'next/link';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  UserPlus,
  ChevronRight,
} from 'lucide-react';
import OrderDetailModal from '@/components/OrderDetailModal';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [sellerPerformance, setSellerPerformance] = useState([]);
  const [stats, setStats] = useState({
    totalVentas: 0,
    pedidosPendientes: 0,
    stockBajo: 0,
    vendedoresActivos: 0,
    clientesPendientes: 0
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        // Carga masiva de datos desde tus servicios
        const [total, pending, stock, sellers, ordersData, performanceData, pendingClients] = await Promise.all([
          StatsServices.getTotalOrders(),
          StatsServices.getPendingOrders(),
          StatsServices.getLowStock(),
          StatsServices.getActiveSellers(),
          StatsServices.getRecentOrders(),
          StatsServices.getSellerPerformance(),
          StatsServices.getPendingClients()
        ]);

        setStats({
          totalVentas: total.count || 0,
          pedidosPendientes: pending.count || 0,
          stockBajo: stock.count || 0,
          vendedoresActivos: sellers.count || 0,
          clientesPendientes: pendingClients.count || 0,
        });

        setRecentOrders(ordersData.data || []);

        // Procesamiento de rendimiento de vendedores
        const processedPerformance = performanceData.data?.map(seller => ({
          name: seller.nombre_completo || seller.full_name,
          // Ajustamos a 'monto_total' que es el nombre en tu tabla 'pedidos'
          totalSales: seller.pedidos?.reduce((acc, curr) => acc + (Number(curr.monto_total) || 0), 0) || 0
        })).sort((a, b) => b.totalSales - a.totalSales);

        setSellerPerformance(processedPerformance || []);
      } catch (error) {
        console.error('Error al cargar datos del dashboard', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
        <div className='text-white text-xl animate-pulse font-black italic uppercase tracking-tighter'>
          Sincronizando con <span className='text-blue-600'>Royal Super Oil</span>
        </div>
      </div>
    );
  }

  // --- SUBCOMPONENTES ---
  function StatCard({ title, value, color, icon: Icon }) {
    const colors = {
      blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      red: 'text-red-500 bg-red-500/10 border-red-500/20',
      green: 'text-green-500 bg-green-500/10 border-green-500/20',
      yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    };
    return (
      <div className={`p-6 rounded-3xl border ${colors[color]} bg-[#141414] shadow-2xl transition-transform hover:scale-[1.02]`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${colors[color].split(' ')[1]}`}>
            <Icon size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Live</span>
        </div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">{title}</p>
        <h4 className="text-3xl font-black text-white italic mt-1">{value}</h4>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
            Panel <span className="text-blue-600">Administrativo</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Control Global Royal Super Oil</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/inventario" className="bg-[#1a1a1a] text-white border border-gray-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">
            Inventario
          </Link>
          <Link href="/dashboard/admin/ventas" className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
            Ver Pedidos
          </Link>
        </div>
      </header>

      {/* Alerta de Clientes Pendientes */}
      {stats.clientesPendientes > 0 && (
        <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl">
              <UserPlus size={24} />
            </div>
            <div>
              <p className="text-white font-black italic uppercase text-sm">
                {stats.clientesPendientes} Aliados esperando aprobación
              </p>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mt-1">Requiere verificación de RIF y Fachada de local</p>
            </div>
          </div>
          <Link href="/dashboard/admin/clientsAdmin" className="w-full md:w-auto bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all text-center">
            Gestionar Ahora
          </Link>
        </div>
      )}

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Ventas" value={stats.totalVentas} color="blue" icon={TrendingUp} />
        <StatCard title="Por Aprobar" value={stats.pedidosPendientes} color="orange" icon={Clock} />
        <StatCard title="Stock Bajo" value={stats.stockBajo} color="red" icon={AlertTriangle} />
        <StatCard title="Vendedores" value={stats.vendedoresActivos} color="green" icon={Users} />
        <StatCard title="Nuevos Aliados" value={stats.clientesPendientes} color="yellow" icon={UserPlus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Tabla de Pedidos */}
        <div className="lg:col-span-2 bg-[#141414] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]/50">
            <h3 className="font-black italic uppercase text-sm tracking-widest text-white">Pedidos Recientes</h3>
            <Link href="/dashboard/admin/ventas" className="text-[10px] font-black uppercase text-blue-500 hover:text-white transition-colors">Ver Historial</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/50 text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Cliente / Vendedor</th>
                  <th className="px-8 py-5 text-center">Monto</th>
                  <th className="px-8 py-5 text-center">Estado</th>
                  <th className="px-8 py-5 text-right">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800/50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-600/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-white uppercase italic">
                        {order.clientes?.razon_social || "Cliente no registrado"}
                      </p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                        Vendedor: {order.usuarios?.nombre_completo || "Sistema"}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-blue-500 italic">
                        ${Number(order.monto_total || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${order.status_logistico === 'pendiente'
                        ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}>
                        {order.status_logistico || 'Recibido'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-white transition-colors"
                      >
                        Revisar <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Vendedores */}
        <div className="bg-[#141414] rounded-[2.5rem] border border-gray-800 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-blue-500" size={20} />
            <h3 className="font-black italic uppercase text-sm tracking-widest text-white">Ranking Mensual</h3>
          </div>
          <div className="space-y-8">
            {sellerPerformance.map((seller, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Puesto {index + 1}</span>
                    <span className="text-sm font-black text-white uppercase italic">{seller.name}</span>
                  </div>
                  <span className="text-sm font-black text-blue-500">${seller.totalSales.toLocaleString()}</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-gray-800">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)] ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-blue-400' : 'bg-gray-700'
                      }`}
                    style={{ width: `${Math.min((seller.totalSales / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <OrderDetailModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </div >
  );
}