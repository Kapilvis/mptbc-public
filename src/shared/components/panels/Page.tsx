import "./Page.css";

interface PageProps extends React.PropsWithChildren {
  header?: string;
  subHeader?: string;
  showHeaderActions?: boolean;
  heroIcon?: string;
  heroImageSrc?: string;
  showHeroIllustration?: boolean;
}

export default function Page({
  header,
  subHeader,
  showHeaderActions = false,
  heroIcon = "pi pi-building",
  heroImageSrc,
  showHeroIllustration = false,
  children,
}: PageProps) {
  const hasHeader = Boolean(header || subHeader);
  const shouldShowIllustration = showHeroIllustration && Boolean(heroImageSrc);

  return (
    <div className="main-page">
      {hasHeader && (
        <header
          className={`page-heading ${
            shouldShowIllustration ? "page-heading-with-visual" : ""
          }`}
        >
          {shouldShowIllustration && (
            <div
              className="page-heading-visual"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${heroImageSrc})`,
              }}
            >
              <span className="page-heading-hotspot hotspot-one" />
              <span className="page-heading-hotspot hotspot-two" />
              <span className="page-heading-hotspot hotspot-three" />
              <span className="page-heading-hotspot hotspot-four" />
            </div>
          )}

          <div className="page-heading-content">
            {shouldShowIllustration && (
              <div className="page-heading-icon">
                <i className={heroIcon} />
              </div>
            )}

            <div className="page-heading-text">
              {header && <h1>{header}</h1>}
              {/* {subHeader && <p>{subHeader}</p>} */}
            </div>
          </div>

          {showHeaderActions && (
            <div id="page-header-actions" className="page-heading-actions" />
          )}
        </header>
      )}

      <div className="page-content">{children}</div>
    </div>
  );
}
