import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { AddButton } from "shared/components/buttons/AddButton";
import { CloseButton } from "shared/components/buttons/CloseButton";
import "./MappingList.css";

interface ListProps {
  title: string;
  formTitle?: string;
  content: React.ReactNode;
  isCreating?: boolean;
  onToggleCreate?: (open: boolean) => void;
  showAddButton?: boolean;
  createForm?: React.ReactNode;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function MappingList({
  title,
  formTitle,
  content,
  isCreating,
  onToggleCreate,
  showAddButton = true,
  createForm,
  searchTerm,
  onSearchChange,
}: ListProps) {
  return (
    <aside className="mapping-list">
      {isCreating && onToggleCreate && (
        <section className="mapping-list-form-section">
          <header className="mapping-list-form-header">
            <span className="mapping-list-form-title">
              {formTitle || `New ${title}`}
            </span>
            <CloseButton onClick={() => onToggleCreate(false)} />
          </header>
          <div className="mapping-list-form-body">{createForm}</div>
        </section>
      )}
      <section className="mapping-list-section">
        <span className="mapping-list-title">{title}</span>
        {!isCreating && (
          <header className="mapping-list-toolbar">
            {onSearchChange && (
              <IconField
                iconPosition="right"
                className="mapping-list-search-wrapper"
              >
                <InputText
                  value={searchTerm}
                  placeholder="Search..."
                  className="mapping-list-search-input p-inputtext-sm"
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <InputIcon className="pi pi-search mapping-list-search-icon" />
              </IconField>
            )}
            {showAddButton && onToggleCreate && (
              <AddButton onClick={() => onToggleCreate(true)} />
            )}
          </header>
        )}
        {content}
      </section>
    </aside>
  );
}
