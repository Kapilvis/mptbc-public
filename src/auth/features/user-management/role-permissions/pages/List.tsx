import { useState } from "react";
import { ToastService } from "services";
import { Card } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import RolePermissionForm from "../components/RolePermissionForm";
import {
  useSaveRolePermissionsMutation,
  useSearchRolePermissionsQuery,
} from "../queries";
import Edit from "./Edit";

export default function List() {
  const [searchParams, setSearchParams] =
    useState<UserManagement.RolePermissionForm | null>(null);

  const { mutateAsync: saveAsync, isPending: isSaving } =
    useSaveRolePermissionsMutation();

  const handleSave = async (payload: UserManagement.RolePermissionSave) => {
    try {
      const result = await saveAsync(payload);
      if (result) {
        ToastService.success("Role permissions updated successfully");
      }
    } catch {
      ToastService.error("Failed to update role permissions");
    }
  };

  const { data = [], isFetching } = useSearchRolePermissionsQuery(
    searchParams?.roleName ?? "",
    searchParams?.domain ?? "",
    searchParams?.action ?? "",
  );
  const pageTitle = usePageTitle();
  return (
    <Page
      header={pageTitle}
      subHeader="Create and manage user role permissions across domains."
      showHeaderActions
    >
      <Card>
        <RolePermissionForm
          onSearch={setSearchParams}
          onReset={() => setSearchParams(null)}
          isLoading={isFetching}
        />
      </Card>

      {searchParams && (
        <div className="mt-3">
          {isFetching ? (
            <Card>
              <div className="flex items-center justify-center gap-2 p-4">
                <i className="pi pi-spin pi-spinner" />
                <span>Loading permissions…</span>
              </div>
            </Card>
          ) : data.length === 0 ? (
            <Card>
              <div className="flex items-center justify-center gap-2 p-4 text-gray-500">
                <i className="pi pi-info-circle" />
                <span>No permissions found for this role and domain.</span>
              </div>
            </Card>
          ) : (
            <Card title={`Permissions Found: ${data.length}`}>
              <Edit
                data={data}
                searchParams={searchParams}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </Card>
          )}
        </div>
      )}
    </Page>
  );
}
