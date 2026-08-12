import { Grid } from "../../grid";
import { PAGE_ROWS } from "./constants";

interface GridPanelListProps<T> extends Controls.GridProps<T> {
  globalFilter: string;
  first: number;
  onPage: (first: number) => void;
  onEdit?: (item: T) => void;
}

export function GridPanelList<T>({
  data,
  globalFilter,
  first,
  onPage,
  onEdit,
  ...gridProps
}: GridPanelListProps<T>) {
  return (
    <Grid
      data={data ?? []}
      globalFilter={globalFilter}
      {...gridProps}
      paginator
      rows={PAGE_ROWS}
      first={first}
      onPage={onPage}
      onEdit={onEdit}
    />
  );
}
