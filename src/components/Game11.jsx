import { useState, useEffect } from 'react';

export default function     () {
  // 1. The State: Just tracking X and Y coordinates
  const [position, setPosition] = useState({ x: 0, y: 50 });

  useEffect(() => {
    // 2. The Engine: Setting up the game loop
    const tickRate = 50; // milliseconds

    const gameLoop = setInterval(() => {
      // 3. The Secret Sauce: Functional State Updates
      // We do NOT use `setPosition({ x: position.x + 5 })` here. 
      // Because of closures, `position.x` would ALWAYS be 0 inside this interval.
      // By passing an arrow function to setPosition, React guarantees we are 
      // handed the absolute latest state at the exact moment this executes.
      setPosition((prevPosition) => ({
        x: prevPosition.x + 5, // Move right by 5 pixels
        y: prevPosition.y      // Keep Y the same
      }));

    }, tickRate);

    // 4. The Cleanup: Prevent memory leaks if the component unmounts
    return () => clearInterval(gameLoop);
    
  }, []); // Empty dependency array: We only want to start the engine once

  // 5. The Render: Drawing the board and the moving entity
  return (
    <div className="board" style={{ position: 'relative', width: '500px', height: '120px', background: '#f0f0f0' }}>
      <div 
        className="entity"
        style={{ 
          position: 'absolute', 
          left: `${position.x}px`, 
          top: `${position.y}px`, 
          width: '20px', 
          height: '20px', 
          background: 'blue' 
        }} 
      />
    </div>
  );
}