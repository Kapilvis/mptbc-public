import React from "react";
import { Building2 } from "lucide-react";
import mpMapSvg from "../../../assets/mp-division-map.svg";

/* ─── 8 Depot Badges Configuration ─── */
interface DepotBadge {
  name: string;
  count: number;
  top: string;
  left: string;
}

const DEPOT_BADGES: DepotBadge[] = [
  { name: "ग्वालियर", count: 11, top: "34%", left: "36%" },
  { name: "रीवा", count: 16, top: "25%", left: "64%" },
  { name: "सागर", count: 17, top: "48%", left: "74%" },
  { name: "भोपाल", count: 7, top: "50%", left: "48%" },
  { name: "इंदौर", count: 9, top: "48%", left: "17%" },
  { name: "उज्जैन", count: 10, top: "54%", left: "20%" },
  { name: "खंडवा", count: 19, top: "70%", left: "28%" },
  { name: "जबलपुर", count: 13, top: "71%", left: "62%" },
];

export const MpDivisionMap: React.FC = () => {
  return (
    <div className="mptbc-map-wrapper-large">
      <div className="mptbc-map-container-large">
        <img
          src={mpMapSvg}
          alt="Madhya Pradesh Division Map"
          className="mptbc-map-svg-large"
        />

        {/* 8 Depot Floating Overlay Badges */}
        {DEPOT_BADGES.map((badge, idx) => (
          <div
            key={idx}
            className="mptbc-depot-badge"
            style={{ top: badge.top, left: badge.left }}
          >
            <div className="mptbc-badge-icon-box">
              <Building2 className="mptbc-badge-icon" />
            </div>
            <span className="mptbc-badge-name">{badge.name}</span>
            <span className="mptbc-badge-count">({badge.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MpDivisionMap;
