import Chart from "../components/Chart/Chart"
import InfoCards from "./M-DemoPages/InfoCards"
import RecentOrdersTB from "./M-DemoPages/RecentOrdersTB"
const DashBoardPage = () => {
    return ( 
        <>
        <div className="w-[100%] p-2 pl-12 flex flex-col justify-center bg-[#f4f1e9]">

        <InfoCards />
      <div className="flex justify-around items-center mt-5">

        <Chart />
        <RecentOrdersTB />
      </div>
        </div>
        </>
     );
}
 
export default DashBoardPage;