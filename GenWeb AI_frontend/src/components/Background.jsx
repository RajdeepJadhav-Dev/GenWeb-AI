import React from "react";

const Background = () => {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Rainbow Hue Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500 to-blue-500 opacity-20 blur-3xl mix-blend-screen"></div>
    </div>
  );
};

export default Background;
