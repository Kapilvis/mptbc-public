import {
  type FieldValues,
  type Path,
  type Resolver,
  useForm,
} from "react-hook-form";

export function useAppForm<TForm extends FieldValues>({
  resolver,
  defaultValues,
  context,
}: {
  resolver?: Resolver<TForm, unknown, TForm>;
  defaultValues?: Forms.FetchDataFunc<TForm>;
  context?: unknown;
}) {
  const {
    control,
    handleSubmit,
    setValue,
    register: _, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...rest
  } = useForm<TForm>({
    mode: "onSubmit",
    resolver,
    defaultValues,
    context,
    shouldFocusError: false,
  });

  return {
    register(key: Path<TForm>) {
      return {
        control,
        name: key,
        setValue,
      };
    },
    control,
    handleSubmit,
    setValue,
    ...rest,
  };
}
