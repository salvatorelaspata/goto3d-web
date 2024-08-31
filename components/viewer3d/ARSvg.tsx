"use client";
import Link from "next/link";

export const ARSvg = ({ usdzUrl }: { usdzUrl: string }) => {
  return (
    <Link href={usdzUrl}>
      <svg
        className="cursor-pointer rounded-sm bg-palette1"
        viewBox="0 0 512 512"
        height="32px"
        width="32px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="201.14 64 256 32 310.86 64"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        />
        <line
          x1="256"
          y1="32"
          x2="256"
          y2="112"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
        <polyline
          points="310.86 448 256 480 201.14 448"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="256"
          y1="480"
          x2="256"
          y2="400"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
        <polyline
          points="64 207.51 64 144 117.15 112.49"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="64"
          y1="144"
          x2="131.29"
          y2="184"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
        <polyline
          points="448 304.49 448 368 394.85 399.51"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="448"
          y1="368"
          x2="380.71"
          y2="328"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
        <polyline
          points="117.15 400 64 368 64 304.49"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="64"
          y1="368"
          x2="130.64"
          y2="328"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
        <polyline
          points="394.85 112.49 448 144 448 207.51"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
        <line
          x1="448"
          y1="144"
          x2="380.71"
          y2="184"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
        <polyline
          points="256 320 256 256 310.86 224"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
        <line
          x1="256"
          y1="256"
          x2="201.14"
          y2="224"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="24"
        />
      </svg>
    </Link>
  );
};
