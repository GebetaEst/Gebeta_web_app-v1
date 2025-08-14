import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../Cards/Cards';
const Chart = () => {


    const demoData = [
        { month: 'Jan', revenue: 2400 },
        { month: 'Feb', revenue: 1398 },
        { month: 'Mar', revenue: 9800 },
        { month: 'Apr', revenue: 3908 },
        { month: 'May', revenue: 4800 },
        { month: 'Jun', revenue: 3800 },
        { month: 'Jul', revenue: 4300 },
      ];
    return ( 
        <>
        <div className="w-[700px] h-[435px] p-2 bg-white border border-gray rounded-lg font-noto">
      <h2 style={{ textAlign: 'center' }}>Website Analytics Dashboard</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={demoData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333"/>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#000000" 
            strokeWidth={3}
          />
          
        </LineChart>
      </ResponsiveContainer>
    </div>


        </> 
    );
}
 
export default Chart;