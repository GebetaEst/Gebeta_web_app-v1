import {useNavigation}  from '../../contexts/NavigationContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Users,
  BarChart2,
  Settings,
  UtensilsCrossed
} from 'lucide-react';


const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Menu', path: '/menu', icon: <Utensils size={18} /> },
  { label: 'Orders', path: '/orders', icon: <ShoppingCart size={18} /> },
  { label: 'Customers', path: '/customers', icon: <Users size={18} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={18} /> },
];

const ManagerSidebar = () => {
  const { activeNav, setActiveNav } = useNavigation("");
   
  return (
    <aside className="w-60 min-h-screen  bg-[url('/src/assets/images/sidebar-bg3.png')] bg-cover bg-center  bg-cardBackground shadow-md p-6 border-[0.5px] border-gray sticky top-0 left-0 motion-preset-slide-right motion-duration-1500 font-noto">
      <div className="text-lg font-bold pb-5 flex items-center justify-center  space-x-1 border-b border-[#e2b96c] mb-8">
        <UtensilsCrossed size={45} color="white" className="bg-primary rounded-md p-1"/>
        <span>Gebeታ Management</span>
      </div>

      <nav className="space-y-3" >
        {navItems.map((item) => (
          <span
            key={item.path}
            className={`flex items-center  space-x-3 px-3 py-2 rounded-xl font-medium transition-all duration-100 scroll-smooth cursor-pointer ${
              activeNav === item.label
                ? 'bg-gradient-to-r from-gray-50 to-gray-300   border-l-4 border-l-gray-600 border-gray-200 drop-shadow'
                : 'motion-text-out-slate-100 '
            }`}
            
            data-nav={item.label}
            onClick={() => setActiveNav(item.label)}
          >
            {item.icon}
            <span>{item.label}</span>
          </span>
        ))}
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
