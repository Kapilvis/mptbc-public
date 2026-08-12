import { useEffect } from "react";
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { PubSubService } from "services";

export function useFormServerError<T extends FieldValues>(form: {
  setError: UseFormReturn<T>["setError"];
}) {
  useEffect(() => {
    const handler = (errors: Api.ValidationError[]) => {
      errors.forEach((error) => {
        const fieldName =
          error.field.charAt(0).toLowerCase() + error.field.slice(1);

        form.setError(fieldName as Path<T>, {
          type: "custom",
          message: error.text,
        });
      });
    };

    PubSubService.subscribe("@event/api-validation-error", handler);
    return () => {
      PubSubService.unsubscribe("@event/api-validation-error", handler);
    };
  }, [form]);
}
