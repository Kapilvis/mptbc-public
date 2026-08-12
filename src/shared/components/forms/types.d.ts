import type {
  Control,
  FieldValues,
  Path,
  RefCallBack,
  UseFormSetValue,
} from "react-hook-form";

declare global {
  namespace Controls {
    /** Props for linking React-Hook-Form with Inputs. */
    interface FormProps<TForm extends FieldValues> {
      control?: Control<TForm>;
      name?: Path<TForm>;
      onBlur?: () => void;
      ref?: RefCallBack;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue?: UseFormSetValue<any>;
    }

    /** Props for the wrapper inside which inputs are placed. */
    interface InputBlockProps {
      id?: string;
      label?: string;
      subLabel?: string;
      errorMessage?: string;
      required?: boolean;
    }

    /**Common props for inputs */
    interface InputProps {
      disabled?: boolean;
      ref?: RefCallBack;
      autoFocus?: boolean;
      placeholder?: string;
      loading?: boolean;
    }

    interface RadioProps {
      label?: string;
      name?: string;
    }
  }
}
