import React from "react";

interface Props {
  children: React.ReactNode,
  ariaLabel: string,
  erApen: boolean,
}

const Dropdown = ({erApen, ariaLabel, children}: Props) => {
  return erApen ? <div
    role='dialog'
    aria-label={ariaLabel}
    className="Dropdown-panel"
  >
    {children}
  </div> : null
}

export default Dropdown
