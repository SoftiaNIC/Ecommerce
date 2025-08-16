'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Dashboard() {
  const { data, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Acceso Restringido
            </h1>
            <p className="text-gray-600 text-sm">
              Debes iniciar sesión para ver esta página
            </p>
          </div>

          <div className="bg-white rounded-lg border border-pink-100 shadow-lg p-6 text-center">
            <button
              onClick={() => signIn()}
              className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenida de vuelta, {data.user.name}! 💕
          </h2>
          <p className="text-gray-600">
            Aquí puedes gestionar tu cuenta y ver tu actividad en Solecito Crochet
          </p>
        </div>

        {/* Admin Panel for Admins and SuperAdmins */}
        {((data.user as any)?.role === 'ADMIN' || (data.user as any)?.role === 'SUPERADMIN') && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">👑</span>
              <h3 className="text-lg font-semibold text-gray-900">Panel de Administración</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Gestiona productos y configuraciones de la tienda
            </p>
            <Link
              href="/dashboard/products"
              className="inline-flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <span>🛍️</span>
              <span>Gestionar Productos</span>
            </Link>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-white rounded-lg border border-pink-100 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                <span className="text-lg">👤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nombre:</span> {data.user.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {data.user.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Rol:</span> {(data.user as any).role || 'Cliente'}
              </p>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg border border-pink-100 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                <span className="text-lg">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mis Pedidos</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Revisa el estado de tus pedidos recientes
            </p>
            <button className="text-pink-500 hover:text-pink-600 font-medium text-sm hover:underline transition-colors">
              Ver todos los pedidos →
            </button>
          </div>

          {/* Favorites Card */}
          <div className="bg-white rounded-lg border border-pink-100 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                <span className="text-lg">💖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Favoritos</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Productos que más te gustan
            </p>
            <button className="text-pink-500 hover:text-pink-600 font-medium text-sm hover:underline transition-colors">
              Ver favoritos →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-pink-100 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/products" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">🛍️</span>
              <span className="font-medium text-gray-700">Ver Productos</span>
            </Link>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-gray-700">Mi Carrito</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">📞</span>
              <span className="font-medium text-gray-700">Contacto</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">⚙️</span>
              <span className="font-medium text-gray-700">Configuración</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}