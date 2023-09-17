import React from "react";
import Confetti from "react-dom-confetti";

interface ConfettiWrapperProps {
  active: boolean;
  config: object;
}

const ConfettiWrapper: React.FC<ConfettiWrapperProps> = ({
  active,
  config,
}) => {
  return (
    <div className="confetti-wrapper">
      <Confetti active={active} config={config} />
    </div>
  );
};

export default ConfettiWrapper;
