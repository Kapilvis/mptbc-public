declare namespace Data {
  type WithId<T, K extends string = "id", V = number> = T & { [P in K]?: V };
  type DataItem<TId = string> = { id: TId; name: string };
}
