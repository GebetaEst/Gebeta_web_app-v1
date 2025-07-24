import {useNavigation}  from '../../contexts/NavigationContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Users,
  BarChart2,
  Settings,
  UtensilsCrossed,
  ScrollText,
  IdCard
} from 'lucide-react';


const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Lists', path: '/lists', icon: <ScrollText size={18} /> },
  // { label: 'Orders', path: '/orders', icon: <ShoppingCart size={18} /> },
  // { label: 'Menu', path: '/menu', icon: <Utensils size={18} /> },
  { label: 'Customers', path: '/customers', icon: <Users size={18} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart2 size={18} /> },
];

const AdminSidebar = () => {
  const { activeNav, setActiveNav } = useNavigation("");
   
  return (
    <aside className="w-60 min-h-screen bg-gray-50 border-r  shadow-lg p-6  sticky top-0 left-0 motion-preset-slide-right motion-duration-1500 font-noto">
     
      <div className="text-xl font-bold pb-8 flex items-center justify-center  space-x-1 border-b-[0.5px] border-[#e0cda9] mb-8 ">
        <UtensilsCrossed size={40} color="white" className="bg-primary rounded-md p-1"/>
        <span>Gbeታ Admin</span>
      </div>

      <nav className="space-y-3 " >
        {navItems.map((item) => (
          <span
            key={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl font-medium transition-all duration-100 scroll-smooth cursor-pointer motion-preset-expand motion-duration-1000 ${
              activeNav === item.label
                ? 'bg-gradient-to-r from-gray-50 to-gray-300   border-l-4 border-l-gray-600 border-gray-200 drop-shadow'
                : 'text-[#4b382a]  '
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

export default AdminSidebar;
