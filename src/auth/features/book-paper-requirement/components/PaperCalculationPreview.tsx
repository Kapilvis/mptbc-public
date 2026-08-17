import { Card } from "shared/components/panels";

interface Props {
  innerPaperMt: number;
  coverPaperMt: number;
}

export default function PaperCalculationPreview({
  innerPaperMt,
  coverPaperMt,
}: Props) {
  return (
    <Card className="border border-gray-100 shadow-sm mt-4 bg-gray-50/50">
      <div className="p-2">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Live Calculation Preview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col p-4 bg-white rounded-lg border border-gray-200/60 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Inner Paper Requirement
            </span>
            <span className="text-2xl font-bold text-blue-600 font-mono mt-1">
              {innerPaperMt.toFixed(3)} MT
            </span>
            <span className="text-[10px] text-gray-400 mt-1">
              Based on formula: (Books × Pages / 8000) × 1.03 × Pages GSM Ream
              Weight / 1000
            </span>
          </div>

          <div className="flex flex-col p-4 bg-white rounded-lg border border-gray-200/60 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Cover Paper Requirement
            </span>
            <span className="text-2xl font-bold text-emerald-600 font-mono mt-1">
              {coverPaperMt.toFixed(3)} MT
            </span>
            <span className="text-[10px] text-gray-400 mt-1">
              Based on formula: (Books × Cover GSM Ream Weight × 1.02) / 2000000
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
