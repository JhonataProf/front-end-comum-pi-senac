import React, { useContext, useState } from 'react';
import {
  FiDisc,
  FiEdit3,
  FiHome,
  FiLogOut,
  FiMenu,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const RestrictedLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext não está disponível');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { usuario, verificarLogin } = authContext;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems: MenuItem[] = [
    { path: '/admin/home', label: 'Home', icon: <FiHome /> },
    { path: '/admin/logout', label: 'Logout', icon: <FiLogOut /> },
    { path: '/admin/novo-prato', label: 'Novo Prato', icon: <FiDisc /> },
    { path: '/admin/usuarios', label: 'Usuários', icon: <FiUsers /> },
    { path: '/admin/pedidos', label: 'pedidos', icon: <FiEdit3 /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-blue-600 text-white transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64`}
      >
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-bold">Meu Sistema</span>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none lg:hidden"
          >
            <FiMenu size={24} />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="flex items-center gap-4 p-4 hover:bg-blue-500 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden lg:block">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* TopBar */}
        <div className="bg-white shadow p-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 focus:outline-none lg:hidden"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-xl font-bold">Área Restrita</h1>
          <div className="relative group">
            <button className="flex items-center gap-2 bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 focus:outline-none">
              <FiUser size={24} />
            </button>
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-4 border-b">
                <p className="text-sm font-bold">{usuario?.email}</p>
                <p className="text-sm text-gray-500">{usuario?.role}</p>
              </div>
              <a
                href="/user/details"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Detalhes do Usuário
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RestrictedLayout;
