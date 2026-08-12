import { Button, ButtonPanel } from "shared/components/buttons";
import "./MainContent.css";

interface MainContentProps {
  title?: string;
  children: React.ReactNode;
  isSaving?: boolean;
  saveLabel?: string;
  isCreating?: boolean;
  disabled?: boolean;
  hideSaveButton?: boolean; // Add to interface
}

export function MainContent({
  title,
  children,
  isSaving,
  saveLabel,
  isCreating,
  disabled,
  hideSaveButton, // Destructure the prop
}: MainContentProps) {
  return (
    <main className="main-content">
      <div className="main-content-body">
        {title && <h2 className="main-content-title">{title}</h2>}
        {children}
      </div>

      {/* Conditionally render the entire footer area */}
      {!hideSaveButton && (
        <div className="main-content-footer">
          <ButtonPanel>
            <Button
              label={isSaving ? "Saving..." : saveLabel}
              icon="save"
              type="submit"
              disabled={isSaving || isCreating || disabled}
            />
          </ButtonPanel>
        </div>
      )}
    </main>
  );
}
