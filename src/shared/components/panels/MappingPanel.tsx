import { MainContent } from "./MainContent";
import { MappingList } from "./MappingList";
import "./MappingPanel.css";

export function MappingPanel({
  sidebarTitle,
  sidebarFormTitle,
  sidebarContent,
  mainTitle,
  isCreating,
  onToggleCreate,
  showAddButton = true,
  createForm,
  onSubmit,
  children,
  searchTerm,
  onSearchChange,
  isSaving = false,
  saveLabel = "Save",
  disableSubmit = false,
  hideSaveButton = false,
}: MappingPanelProps) {
  return (
    <form onSubmit={onSubmit} className="mapping-panel-form">
      <div className="mapping-panel-grid">
        <MappingList
          title={sidebarTitle}
          formTitle={sidebarFormTitle}
          content={sidebarContent}
          isCreating={isCreating}
          onToggleCreate={onToggleCreate}
          showAddButton={showAddButton}
          createForm={createForm}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        <MainContent
          title={mainTitle}
          isSaving={isSaving}
          saveLabel={saveLabel}
          isCreating={isCreating}
          disabled={disableSubmit}
          hideSaveButton={hideSaveButton}
        >
          {children}
        </MainContent>
      </div>
    </form>
  );
}
