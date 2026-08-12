interface MosaicCardProps {
  title: string;
  subTitle?: string | string[];
  isActive?: boolean;
  onStatusToggle?: () => void;
  disabled?: boolean;
  onDelete?: () => void;
  children?: ReactNode;
}
interface MosaicItemProps<T> {
  item: T;
  isAdding?: boolean;
  isEditing?: boolean;
  isFormOpen?: boolean;
  actionContent?: ReactNode;
  editContent?: ReactNode;
  renderContent: (item: T) => ReactNode;
  onEdit: (item: T, event: React.MouseEvent) => void;
  onClose?: () => void;
}

interface MosaicPanelProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  renderContent: (item: T) => React.ReactNode;
  CreateForm?: React.ComponentType<{
    onSave: () => void;
    onCancel?: () => void;
  }>;
  EditForm?: React.ComponentType<{
    data: T;
    onSave: () => void;
    onCancel?: () => void;
  }>;
  isLoading?: boolean;
}

interface MappingPanelProps {
  sidebarTitle: string;
  sidebarFormTitle?: string;
  sidebarContent: React.ReactNode;
  mainTitle?: string;
  isCreating?: boolean;
  onToggleCreate?: (open: boolean) => void;
  showAddButton?: boolean;
  createForm?: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isSaving?: boolean;
  saveLabel?: string;
  disableSubmit?: boolean;
  hideSaveButton?: boolean;
}
