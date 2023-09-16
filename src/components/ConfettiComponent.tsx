import React from "react";
import Confetti from "react-dom-confetti";

interface ConfettiComponentProps {
  active: boolean;
  config: object;
}

const ConfettiComponent: React.FC<ConfettiComponentProps> = ({
  active,
  config,
}) => {
  return (
    <div className="confetti-wrapper">
      <Confetti active={active} config={config} />
    </div>
  );
};

export default ConfettiComponent;
