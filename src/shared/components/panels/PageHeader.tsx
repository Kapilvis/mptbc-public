import "./PageHeader.css";

interface Props {
  header: string;
  subHeader?: string;
}

export default function PageHeader(props: Props) {
  return (
    <div>
      <h1 className="page-title">{props.header}</h1>
      {/* {props.subHeader ? (
        <p className="page-subtitle">{props.subHeader}</p>
      ) : undefined} */}
    </div>
  );
}
