import React from "react";

interface IsDisplayProps {
  display: boolean;
  children: React.ReactNode;
}

const IsDisplay: React.FC<IsDisplayProps> = ({ display, children }) => {
  return display ? <>{children}</> : null;
};

export default IsDisplay;
