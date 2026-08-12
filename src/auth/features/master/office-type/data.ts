export const mockOfficeTypes: Master.OfficeTypeList[] = [
  {
    officeTypeId: 1,
    name: "Headquarters",
    localName: "मुख्यालय",
    code: "OT-HQ",
    officeLevelName: "State Level HQ",
    officeLevel: {
      officeLevelId: 1,
      name: "State Level HQ",
      code: "OL-HQ",
      isActive: true,
    },
    isActive: true,
  },
  {
    officeTypeId: 2,
    name: "Regional Directorate",
    localName: "क्षेत्रीय निदेशालय",
    code: "OT-REG",
    officeLevelName: "Divisional Office",
    officeLevel: {
      officeLevelId: 2,
      name: "Divisional Office",
      code: "OL-DIV",
      isActive: true,
    },
    isActive: true,
  },
];
