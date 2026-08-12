import "./InputBlock.css";

export default function InputBlock(
  props: React.PropsWithChildren<Controls.InputBlockProps>,
) {
  return (
    <div className={`input-block ${props.errorMessage ? "has-error" : ""}`}>
      {props.label ? (
        <label htmlFor={props.id}>
          <span>
            {props.label}
            {props.subLabel ? (
              <span className="sub-label">{props.subLabel}</span>
            ) : null}
          </span>
          {props.required ? <span className="required">*</span> : undefined}
        </label>
      ) : null}
      <div className="input-wrapper">
        {props.children}
        {props.errorMessage ? (
          <div className="floating-error">
            <span className="floating-error-text">{props.errorMessage}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
