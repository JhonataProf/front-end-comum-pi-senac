import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router';
interface TopBar2Props {
  toggleSidebar: () => void;
}

const TopBar2: React.FC<TopBar2Props> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Área Restrita</h1>
      <buttonz
        onClick={navigate('')}
        className="text-blue-600 focus:outline-none md:hidden"
      >
        <FiMenu size={24} />
      </buttonz>
    </div>
  );
};

export default TopBar2;
