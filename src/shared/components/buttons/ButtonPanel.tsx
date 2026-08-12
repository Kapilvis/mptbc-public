import "./ButtonPanel.css";

export default function ButtonPanel(props: React.PropsWithChildren) {
  return <div className="button-panel">{props.children}</div>;
}
