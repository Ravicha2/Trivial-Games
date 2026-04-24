import { useState, useEffect } from 'react';

export default function     () {

  const [position, setPosition] = useState({ x: 0, y: 50 });

  useEffect(() => {
    const tickRate = 50; // milliseconds

    const gameLoop = setInterval(() => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + 5, // Move right by 5 pixels
        y: prevPosition.y      // Keep Y the same
      }));

    }, tickRate);

    return () => clearInterval(gameLoop);
    
  }, []); // Empty dependency array: We only want to start the engine once

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