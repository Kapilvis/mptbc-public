import { Button } from "../buttons";
import "./ButtonColumn.css";

interface ButtonColumnProps {
  caption: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

export default function ButtonColumn(props: ButtonColumnProps) {
  return (
    <Button
      type="button"
      icon={props.icon}
      label={props.caption}
      onClick={props.onClick}
      size="small"
      className={["button-column-btn", props.className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
