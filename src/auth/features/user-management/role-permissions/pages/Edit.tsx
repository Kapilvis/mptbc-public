import { useMemo, useState } from "react";
import CheckboxGrid, {
  type CheckboxGridItem,
} from "shared/components/forms/CheckboxGrid";

interface EditProps {
  data: UserManagement.RolePermissionItem[];
  searchParams: UserManagement.RolePermissionForm;
  onSave: (payload: UserManagement.RolePermissionSave) => void;
  isSaving: boolean;
}

export default function Edit({
  data,
  searchParams,
  onSave,
  isSaving,
}: EditProps) {
  // Compute initial state purely from the data provided at mount time
  const initialSet = useMemo(
    () => new Set(data.filter((i) => i.isGranted).map((i) => i.featureValue)),
    [data],
  );

  const [grantedValues, setGrantedValues] = useState<string[]>(() => [
    ...initialSet,
  ]);

  const currentSet = new Set(grantedValues);
  const hasChanges =
    currentSet.size !== initialSet.size ||
    grantedValues.some((v) => !initialSet.has(v));

  const handleSave = () => {
    if (!hasChanges) return;

    onSave({
      roleName: searchParams.roleName,
      domain: searchParams.domain,
      action: searchParams.action,
      addedFeatures: grantedValues.filter((f) => !initialSet.has(f)),
      removedFeatures: [...initialSet].filter((f) => !currentSet.has(f)),
    });
  };

  const gridItems: CheckboxGridItem[] = data.map((item) => ({
    label: item.featureName,
    value: item.featureValue,
  }));

  return (
    <div
      className="p-3 overflow-y-auto overflow-x-hidden"
      style={{ maxHeight: "65vh" }}
    >
      <CheckboxGrid
        items={gridItems}
        value={grantedValues}
        onChange={setGrantedValues}
        columns={3}
        onSave={handleSave}
        isSaving={isSaving}
        saveLabel="Save Permissions"
        saveDisabled={!hasChanges}
      />
    </div>
  );
}
