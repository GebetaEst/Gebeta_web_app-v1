import {useNavigation}  from '../../contexts/NavigationContext';
import useUserStore from '../../Store/UseStore';
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
  { label: 'Orders', path: '/orders', icon: <ShoppingCart size={18} />, hasNotifications: true },
  { label: 'Customers', path: '/customers', icon: <Users size={18} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={18} /> },
];

const ManagerSidebar = () => {
  const { activeNav, setActiveNav } = useNavigation("");
  const { newOrderAlert } = useUserStore();
   
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
          className={`flex items-center  text-[#000000] space-x-3 px-3 py-2 rounded-xl font-medium transition-all duration-100 scroll-smooth cursor-pointer relative ${
            activeNav === item.label
              ? 'bg-gradient-to-r backdrop-blur-lg bg-black/5 border-[#0a0602] border-l-4 border-l-[#c94435] drop-shadow'
              : 'motion-text-out-slate-100 '
          }`}
            
            data-nav={item.label}
            onClick={() => setActiveNav(item.label)}
          >
            {item.icon}
            <span>{item.label}</span>
            
            {/* Notification badge for Orders */}
            {item.hasNotifications && newOrderAlert && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </span>
        ))}
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
