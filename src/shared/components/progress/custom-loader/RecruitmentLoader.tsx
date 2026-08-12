import "./RecruitmentLoader.css";

export default function RecruitmentLoader() {
  return (
    <div className="recruitment-loader-container">
      <svg
        className="recruitment-svg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for gradients/shadows */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- GROUP 1: THE RESUME (CV) --- */}
        <g className="resume-group">
          {/* Paper Background */}
          <rect
            x="60"
            y="40"
            width="80"
            height="110"
            rx="5"
            ry="5"
            fill="#ffffff"
            stroke="#e2e8f0" // Slate-200
            strokeWidth="2"
            filter="url(#shadow)"
          />

          {/* User Avatar Placeholder */}
          <circle cx="100" cy="70" r="12" fill="#cbd5e1" />
          <path
            d="M 88 90 Q 100 100 112 90 V 90"
            stroke="#cbd5e1"
            strokeWidth="2"
            fill="none"
          />

          {/* Text Lines (Skeleton) */}
          <line
            x1="75"
            y1="105"
            x2="125"
            y2="105"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="75"
            y1="115"
            x2="125"
            y2="115"
            stroke="#e2e8f0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="75"
            y1="125"
            x2="115"
            y2="125"
            stroke="#e2e8f0"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Bottom Section */}
          <line
            x1="75"
            y1="140"
            x2="90"
            y2="140"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="75"
            y1="150"
            x2="125"
            y2="150"
            stroke="#e2e8f0"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* --- GROUP 2: THE MAGNIFYING GLASS (Search) --- */}
        <g className="magnifier-group">
          {/* Glass Handle */}
          <line
            x1="125"
            y1="125"
            x2="145"
            y2="145"
            stroke="#1e293b" // Dark Slate
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Glass Frame */}
          <circle
            cx="115"
            cy="115"
            r="20"
            fill="rgba(59, 130, 246, 0.2)" // Blue transparent glass
            stroke="#2563eb" // Blue-600
            strokeWidth="4"
          />

          {/* Reflection on Glass */}
          <path
            d="M 108 108 Q 115 102 122 108"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* --- GROUP 3: SUCCESS INDICATOR (Optional tick) --- */}
        <g className="status-indicator">
          <circle cx="150" cy="50" r="10" fill="#22c55e" />
          <path
            d="M 145 50 L 148 54 L 155 46"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Optional Text */}
      {/* <div className="loader-text">Scanning Profiles...</div> */}
    </div>
  );
}
