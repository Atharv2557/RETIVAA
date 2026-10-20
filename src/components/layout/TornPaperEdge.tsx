"use client";

interface TornPaperEdgeProps {
  /**
   * "down": attached to the bottom of the descending evening charcoal menu sheet
   * "up": attached to the top of the ascending warm ivory page transition wipe
   */
  direction?: "down" | "up";
  color?: string;
  fringeColor?: string;
  className?: string;
}

export function TornPaperEdge({
  direction = "down",
  color = "#191918",
  fringeColor = "#F6EFE3",
  className = "",
}: TornPaperEdgeProps) {
  if (direction === "up") {
    // Upward-pointing organic torn edge for the warm ivory wipe
    return (
      <div
        aria-hidden="true"
        className={`w-full overflow-hidden leading-none pointer-events-none ${className}`}
        style={{ height: "48px" }}
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle warm sandstone fiber shadow / deckle accent */}
          <path
            d="M0,60 L0,32 C38,28 72,36 110,31 C152,25 186,18 228,24 C272,30 308,38 350,33 C395,27 428,17 472,22 C515,28 550,36 594,30 C638,24 672,16 718,22 C762,28 798,37 842,32 C888,26 922,17 968,23 C1012,29 1048,37 1092,31 C1136,25 1170,18 1214,24 C1258,30 1294,38 1338,33 C1378,28 1410,21 1440,25 L1440,60 Z"
            fill="#D7B98E"
            opacity="0.45"
          />
          {/* Main warm ivory torn sheet contour */}
          <path
            d="M0,60 L0,36 C40,32 75,40 115,35 C156,29 190,22 232,28 C276,34 312,42 354,37 C399,31 432,21 476,26 C519,32 554,40 598,34 C642,28 676,20 722,26 C766,32 802,41 846,36 C892,30 926,21 972,27 C1016,33 1052,41 1096,35 C1140,29 1174,22 1218,28 C1262,34 1298,42 1342,37 C1382,32 1414,25 1440,29 L1440,60 Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }

  // Downward-pointing organic torn edge for the evening charcoal descending menu
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none pointer-events-none ${className}`}
      style={{ height: "48px" }}
    >
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Raw ivory deckle paper fiber fringe that peeks out from the torn boundary */}
        <path
          d="M0,0 L0,28 C38,32 72,24 110,29 C152,35 186,42 228,36 C272,30 308,22 350,27 C395,33 428,43 472,38 C515,32 550,24 594,30 C638,36 672,44 718,38 C762,32 798,23 842,28 C888,34 922,43 968,37 C1012,31 1048,23 1092,29 C1136,35 1170,42 1214,36 C1258,30 1294,22 1338,27 C1378,32 1410,39 1440,35 L1440,0 Z"
          fill={fringeColor}
          opacity="0.85"
        />
        {/* Main evening charcoal sheet body contour */}
        <path
          d="M0,0 L0,24 C40,28 75,20 115,25 C156,31 190,38 232,32 C276,26 312,18 354,23 C399,29 432,39 476,34 C519,28 554,20 598,26 C642,32 676,40 722,34 C766,28 802,19 846,24 C892,30 926,39 972,33 C1016,27 1052,19 1096,25 C1140,31 1174,38 1218,32 C1262,26 1298,18 1342,23 C1382,28 1414,35 1440,31 L1440,0 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
