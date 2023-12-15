import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  ariaLabel: string,
  friKomponent: boolean,
  erApen: boolean,
}

const Dropdown = ({erApen, ariaLabel, friKomponent,  children, ...divProperties}: Props) => {
  return erApen ? <div
    role='menu'
    aria-label={ariaLabel}
    className={`Dropdown-panel ${!friKomponent ? "Dropdown-panel-Bedriftsmeny" : ""}`}
    {...divProperties}
  >
    {children}
  </div> : null
}

export default Dropdown
