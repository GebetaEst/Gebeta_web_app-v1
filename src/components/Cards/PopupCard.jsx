
const PopupCard = ({children , ...props}) => {
    return ( <>
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-black/50 z-50 flex items-center justify-center font-noto ">
          <div className=" bg-[#f4f1e9] transition-all ease-out rounded-lg p-8 motion-scale-in-[0.19] motion-translate-x-in-[-15%] motion-translate-y-in-[-18%] motion-opacity-in-[0%] motion-rotate-in-[6deg] motion-blur-in-[5px] motion-duration-[0.35s] motion-duration-[0.53s]/scale motion-duration-[0.53s]/translate motion-duration-[0.63s]/rotate" {...props}>
            <div className=" pb-2 border-gray">
              {children}
            </div>
            
          </div>
        </div>
    </> );
}
 
export default PopupCard;