import React from "react";

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle cx="20" cy="20" r="18" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="4 2" />
      
      {/* Inner circle */}
      <circle cx="20" cy="20" r="10" fill="#1A0F35" stroke="#A855F7" strokeWidth="1" />
      
      {/* S letter */}
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#A855F7"
        fontFamily="Calibri, sans-serif"
      >
        S
      </text>

      {/* Top dot */}
      <circle cx="20" cy="2" r="2" fill="#A855F7" />
      
      {/* Bottom dot */}
      <circle cx="20" cy="38" r="2" fill="#7C3AED" />
      
      {/* Left dot */}
      <circle cx="2" cy="20" r="2" fill="#7C3AED" />
      
      {/* Right dot */}
      <circle cx="38" cy="20" r="2" fill="#A855F7" />
    </svg>
  );
}