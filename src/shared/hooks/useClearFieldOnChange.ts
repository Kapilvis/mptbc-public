import { useEffect, useRef } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

/**
 * Clears a form field when the given upstream dependency changes.
 * Designed for cascading select components — the field self-resets
 * when its parent selection is changed.
 *
 * `setValue` and `name` are automatically available via the `register()` spread.
 */
export function useClearFieldOnChange<TForm extends FieldValues>(
  dependency: number | undefined,
  name: Path<TForm> | undefined,
  setValue: UseFormSetValue<TForm> | undefined,
) {
  const prevDep = useRef(dependency);

  useEffect(() => {
    if (
      prevDep.current !== undefined &&
      prevDep.current !== null &&
      prevDep.current !== 0 &&
      prevDep.current !== dependency &&
      name &&
      setValue
    ) {
      setValue(name, null as PathValue<TForm, typeof name>);
    }
    prevDep.current = dependency;
  }, [dependency, name, setValue]);
}
