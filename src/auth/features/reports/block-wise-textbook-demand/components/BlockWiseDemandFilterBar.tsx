import React from "react";
import { useActiveClassesQuery } from "auth/features/master/class/queries";
import { DropDownList, TextBox } from "shared/components/forms";
import { Card } from "shared/components/panels";
import {
  ACADEMIC_YEAR_OPTIONS,
  MEDIUM_OPTIONS,
  type DemandReportFilter,
} from "../data";

interface Props {
  filter: DemandReportFilter;
  onChange: (updated: Partial<DemandReportFilter>) => void;
}

export const BlockWiseDemandFilterBar: React.FC<Props> = ({
  filter,
  onChange,
}) => {
  const { data: classesData, isLoading: isClassesLoading } =
    useActiveClassesQuery();

  return (
    <Card className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
        {/* Academic Year Dropdown */}
        <div>
          <DropDownList
            label="Academic Year"
            data={ACADEMIC_YEAR_OPTIONS}
            value={filter.academicYear}
            onChange={(val) =>
              onChange({ academicYear: String(val ?? "2026-2027") })
            }
            textField="label"
            optionValue="value"
          />
        </div>

        {/* Medium Dropdown */}
        <div>
          <DropDownList
            label="Medium"
            data={MEDIUM_OPTIONS}
            value={filter.medium}
            onChange={(val) =>
              onChange({ medium: String(val ?? "Hindi Medium") })
            }
            textField="label"
            optionValue="value"
          />
        </div>

        {/* Class Dropdown using master class query data */}
        <div>
          <DropDownList
            label="Class"
            data={classesData}
            loading={isClassesLoading}
            value={filter.classLabel}
            onChange={(val) =>
              onChange({ classLabel: String(val ?? "Class 9") })
            }
            textField="name"
            optionValue="name"
            placeholder="Select Class"
          />
        </div>

        {/* Search District / Block */}
        <div>
          <TextBox
            label="Search District / Block"
            value={filter.districtSearch}
            onChange={(val) => onChange({ districtSearch: String(val ?? "") })}
            placeholder="Search district, block or bcode..."
            icon="search"
            iconPosition="right"
          />
        </div>
      </div>
    </Card>
  );
};
