import React from "react";

interface Props {
  children: React.ReactNode,
  ariaLabelledby: string,
  erApen: boolean,
}

const Dropdown = ({erApen, ariaLabelledby, children}: Props) => {
  return erApen ? <div
    role='dialog'
    aria-modal='true'
    aria-labelledby={ariaLabelledby}
    className="Dropdown-panel"
  >
    {children}
  </div> : null
}

export default Dropdown
