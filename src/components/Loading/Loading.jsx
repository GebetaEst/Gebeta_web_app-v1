const Loading = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.8s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.7s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.6s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.5s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        {/* <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.1s]"></div> */}
      </div>
    </div>
  );
};

const InlineLoadingDots = () => {
  return (
    // Container for the dots. Using flex to arrange them horizontally.
    <div className="flex items-center space-x-1 p-2">
      {/* 
        Each dot is a small, rounded element.
        w-2 h-2: Small size for inline display.
        bg-blue-500: Blue background color.
        rounded-full: Makes it a circle.
        animate-pulse: Tailwind's built-in pulse animation (fades in and out).
        animation-delay: Custom delay for each dot to create a staggered effect.
      */}
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      {/* Visually hidden text for accessibility */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { Loading, InlineLoadingDots };
