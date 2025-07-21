import {useState, useEffect} from 'react'
import { useNavigation } from '../../contexts/NavigationContext';
import AdminDashboardLayout from '../../Layouts/A-dashboardLayout';
import Order from '../../pages/M-DemoPages/Order';
import Menu from '../../pages/M-DemoPages/menus';
import Analytics from '../../pages/M-DemoPages/Analytics';
import Settings from '../../pages/M-DemoPages/Settings';
import DashBoardPage from '../../pages/DashBoardPage';
import AllList from '../../pages/A-DemoPages/AllList';
import ACustomers from '../../pages/A-DemoPages/A-customers';
const AdminNav = () => {
  const { activeNav } = useNavigation();
  // console.log(activeNav)
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    switch (activeNav) {
      case 'Dashboard':
        setActiveComponent(<DashBoardPage />);
        break;
      case 'Lists':
        setActiveComponent(<AllList/>);
        break;
      case 'Orders':
        setActiveComponent(<Order />);
        break;
      case 'Menu':
        setActiveComponent(<Menu />);
        break;
      case 'Customers':
        setActiveComponent(<ACustomers />);
        break;
      case 'Analytics':
        setActiveComponent(<Analytics />);
        break;
      case 'Settings':
        setActiveComponent(<Settings />);
        break;
      default:
        setActiveComponent(null);
    }
  }, [activeNav]);

  return (
    <AdminDashboardLayout>
   
   {activeComponent}
    </AdminDashboardLayout>
  );
};

export default AdminNav;
