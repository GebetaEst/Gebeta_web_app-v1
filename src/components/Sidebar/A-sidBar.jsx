import {useNavigation}  from '../../contexts/NavigationContext';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Users,
  BarChart2,
  Settings,
  UtensilsCrossed,
  ScrollText,
  IdCard,
  Truck 
} from 'lucide-react';


const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Users', path: '/lists', icon:<Users size={20} />  },
  // { label: 'Orders', path: '/orders', icon: <ShoppingCart size={18} /> },
  // { label: 'Menu', path: '/menu', icon: <Utensils size={18} /> },
  { label: 'Restaurants', path: '/customers', icon:<ScrollText size={20} />  },
  { label: 'Delivery Guys', path: '/delivery-guys', icon: <Truck size={20} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

const AdminSidebar = () => {
  const { activeNav, setActiveNav } = useNavigation("");
  //  console.log(activeNav)
  localStorage.setItem("activeNav", activeNav);
  
  


  return (
    <aside className="w-60 min-h-screen bg-gray-50 border-r bg-[url('/src/assets/images/sidebar-bg3.png')] bg-cover bg-center  shadow-lg p-6  sticky top-0 left-0 motion-preset-slide-right motion-duration-1500 font-noto">
     
      <div className="text-xl font-bold pb-8 flex items-center justify-center  space-x-1 border-b-[0.5px] border-[#e0cda9] mb-8 ">
        <UtensilsCrossed size={40} color="white" className="bg-primary rounded-md p-1"/>
        <span>Gbeታ Admin</span>
      </div>

      <nav className="space-y-3 " >
        {navItems.map((item) => (
          <span
            key={item.path}
            className={`flex items-center  text-[#000000] space-x-3 px-3 py-2 rounded-xl font-medium transition-all duration-100 scroll-smooth cursor-pointer ${
              activeNav === item.label
                ? 'bg-gradient-to-r backdrop-blur-lg bg-black/5 border-[#0a0602] border-l-4 border-l-[#c94435] drop-shadow'
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

export default AdminSidebar;
