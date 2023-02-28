import React from "react";

interface Props {
  children: React.ReactNode,
  ariaLabel: string,
  friKomponent: boolean,
  erApen: boolean,
}

const Dropdown = ({erApen, ariaLabel, friKomponent,  children}: Props) => {
  return erApen ? <div
    role='dialog'
    aria-label={ariaLabel}
    className={`Dropdown-panel ${!friKomponent ? "Dropdown-panel-Bedriftsmeny" : ""}`}
  >
    {children}
  </div> : null
}

export default Dropdown
