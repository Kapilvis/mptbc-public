interface StatusButtonProps {
  value: boolean;
  onClick: () => void;
  className?: string;
}

export default function StatusButton({
  value,
  onClick,
  className,
}: StatusButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold border transition-all duration-200 cursor-pointer
        ${
          value
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300"
        }
        ${className || ""}`}
    >
      <i
        className={`pi ${value ? "pi-check" : "pi-times"} ${value ? "text-emerald-500" : "text-rose-500"} text-[0.6rem]`}
      />
      {value ? "Active" : "Inactive"}
    </button>
  );
}
