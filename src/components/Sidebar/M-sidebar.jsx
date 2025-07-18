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
    <aside className="w-60 min-h-screen bg-cardBackground shadow-md p-6 border-[0.5px] border-gray sticky top-0 left-0 motion-preset-slide-right motion-duration-1500 font-noto">
      <div className="text-xl font-bold pb-8 flex items-center justify-center  space-x-1 border-b-[0.5px] border-gray mb-8">
        <UtensilsCrossed size={40} color="white" className="bg-primary rounded-md p-1"/>
        <span>Gbeታ Management</span>
      </div>

      <nav className="space-y-3" >
        {navItems.map((item) => (
          <span
            key={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl font-medium transition-all duration-100 scroll-smooth cursor-pointer motion-preset-expand motion-duration-700 ${
              activeNav === item.label
                ? 'bg-gradient-to-r from-gray-200 to-gray-300  border-l-4 border-l-gray-600 border-gray-200 drop-shadow'
                : 'text-primary '
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
