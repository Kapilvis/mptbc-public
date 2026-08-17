import { useRef, useState } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import InputBlock from "./InputBlock";
import { Button } from "../buttons";

interface FileUploadProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: string;
  onChange?: (value: string | null) => void;
  accept?: string;
}

function InnerFileUpload<TForm extends FieldValues>({
  id,
  name,
  value,
  errorMessage,
  label,
  onChange,
  required,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  disabled,
}: FileUploadProps<TForm>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Extract display name from value path
  const getFileName = (val?: string) => {
    if (!val) return "";
    const parts = val.split("/");
    return parts[parts.length - 1];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload by passing a mock URL
      onChange?.(`/uploads/${file.name}`);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange?.(`/uploads/${file.name}`);
    }
  };

  return (
    <InputBlock
      label={label}
      id={id ?? name}
      errorMessage={errorMessage}
      required={required}
    >
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-50/30"
            : errorMessage
              ? "border-red-300 bg-red-50/10"
              : "border-gray-300 hover:border-indigo-400 bg-white"
        } ${disabled ? "opacity-60 pointer-events-none bg-gray-50" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          id={id ?? name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {value ? (
          <div className="flex items-center justify-between gap-3 bg-gray-50 p-2 rounded border border-gray-200">
            <div className="flex items-center gap-2 overflow-hidden">
              <i className="pi pi-file text-indigo-500 text-lg shrink-0" />
              <span className="text-xs text-gray-700 font-medium truncate">
                {getFileName(value)}
              </span>
            </div>
            <Button
              type="button"
              icon="trash"
              variant="danger"
              size="small"
              onClick={handleClear}
              disabled={disabled}
              className="shrink-0"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-2">
            <i className="pi pi-cloud-upload text-gray-400 text-2xl mb-2" />
            <p className="text-xs text-gray-600 mb-1">
              Drag and drop certificate or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-600 hover:text-indigo-700 font-semibold focus:outline-none"
              >
                browse
              </button>
            </p>
            <p className="text-[10px] text-gray-400">
              Supported files: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>
        )}
      </div>
    </InputBlock>
  );
}

export default function FileUpload<TForm extends FieldValues>({
  name,
  control,
  errorMessage,
  onChange,
  ...rest
}: FileUploadProps<TForm>) {
  if (!control || !name) {
    return (
      <InnerFileUpload<TForm>
        name={name}
        errorMessage={errorMessage}
        onChange={onChange}
        {...rest}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => (
        <InnerFileUpload<TForm>
          errorMessage={formState.errors[name]?.message?.toString()}
          {...rest}
          {...field}
          onChange={(val) => {
            field.onChange(val);
            onChange?.(val);
          }}
        />
      )}
    />
  );
}
