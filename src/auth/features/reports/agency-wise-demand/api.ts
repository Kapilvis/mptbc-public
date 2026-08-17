import { class1To4Data, class5To8Data, class9To12Data } from "./data";

export const getAgencyDemandReport = async (
  params: Reports.AgencyDemandReportFilter,
): Promise<Reports.AgencyDemandReportItem[]> => {
  await new Promise((res) => setTimeout(res, 150));

  let sourceData: Reports.AgencyDemandReportItem[] = [];
  if (params.tier === "class1to4") {
    sourceData = class1To4Data;
  } else if (params.tier === "class5to8") {
    sourceData = class5To8Data;
  } else {
    sourceData = class9To12Data;
  }

  return sourceData.filter((item) => {
    if (
      params.depotName &&
      params.depotName !== "All" &&
      item.depotName !== params.depotName
    ) {
      return false;
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      return (
        item.depotName.toLowerCase().includes(q) ||
        item.districtName.toLowerCase().includes(q)
      );
    }
    return true;
  });
};
