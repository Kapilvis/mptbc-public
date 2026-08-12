declare namespace ChildDirectory {
  interface AgeGroupBase {
    name: string;
  }
  interface AgeGroupItem extends AgeGroupBase {
    ageGroupId: number;
    isActive: boolean;
  }
  type AgeGroupForm = AgeGroupBase;

  interface SchemeBase {
    name: string;
    localName?: string;
  }

  interface SchemeItem extends SchemeBase {
    schemeId: number;
    isActive: boolean;
  }
  type SchemeForm = SchemeBase;

  interface HealthIssueBase {
    name: string;
    localName?: string;
  }

  interface HealthIssueItem extends HealthIssueBase {
    healthIssueId: number;
    isActive: boolean;
  }
  type HealthIssueForm = HealthIssueBase;
  interface ImmunizationStatusBase {
    name: string;
    localName?: string;
  }

  interface ImmunizationStatusItem extends ImmunizationStatusBase {
    immunizationStatusId: number;
    isActive: boolean;
  }
  type ImmunizationStatusForm = ImmunizationStatusBase;
}
