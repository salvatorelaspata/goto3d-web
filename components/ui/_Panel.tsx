import React from "react";

interface PanelProps {
  children: React.ReactNode;
  inline?: boolean;
}

export const Panel: React.FC<PanelProps> = ({ children, inline }) => (
  <div className={`bg-palette3 p-4 rounded-lg shadow-lg ${inline && "flex"}`}>
    {children}
  </div>
);
