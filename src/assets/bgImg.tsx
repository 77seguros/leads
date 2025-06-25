import * as React from "react"
interface SvgComponentProps extends React.SVGProps<SVGSVGElement> { }

const BGImg: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={486}
    height={486}
    fill="none"
    {...props}
  >
    <circle cx={243} cy={243} r={243} fill="#0376E8" />
    <circle cx={229} cy={249} r={229} fill="#FFF" />
    <circle cx={219} cy={243} r={209} fill="#0376E8" />
  </svg>
)
export default BGImg
