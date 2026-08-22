import Modal from "shared/components/popups/Modal";
import Grid from "shared/components/grid/Grid";
import { Chart } from "primereact/chart";

interface Props<T extends Record<string, unknown> = Record<string, unknown>> {
  visible: boolean;
  onHide: () => void;
  title: string;
  data: T[];
  columns: Controls.ColumnProps<T>[];
  chartType?: "bar" | "doughnut";
  chartLabels?: string[];
  chartDataVals?: number[];
  chartLabel?: string;
}

export const DemandBreakdownModal = <T extends Record<string, unknown>>({
  visible,
  onHide,
  title,
  data,
  columns,
  chartType,
  chartLabels,
  chartDataVals,
  chartLabel,
}: Props<T>) => {
  const chartData =
    chartLabels && chartDataVals
      ? {
          labels: chartLabels,
          datasets: [
            {
              label: chartLabel || "Demand",
              data: chartDataVals,
              backgroundColor:
                chartType === "doughnut"
                  ? ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
                  : "#3b82f6",
            },
          ],
        }
      : null;

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: chartType === "doughnut" ? 1 : 1.5,
    plugins: {
      legend: { display: chartType === "doughnut" },
    },
  };

  return (
    <Modal visible={visible} onHide={onHide} header={title} size="large">
      <div
        className={
          chartType ? "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2" : "mb-2"
        }
      >
        {chartType && chartData && (
          <div className="h-64 flex justify-center items-center">
            <Chart
              type={chartType}
              data={chartData}
              options={chartOptions}
              className="w-full h-full max-w-sm"
            />
          </div>
        )}
        <div>
          <Grid data={data} columns={columns} paginator={false} />
        </div>
      </div>
    </Modal>
  );
};
