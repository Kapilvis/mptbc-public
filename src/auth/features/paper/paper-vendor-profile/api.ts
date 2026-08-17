import { MOCK_PAPER_VENDORS } from "./data";

let paperVendorsState: PaperVendor.Item[] = [...MOCK_PAPER_VENDORS];

export async function getPaperVendors(
  filter?: PaperVendor.Filter,
): Promise<PaperVendor.Item[]> {
  await new Promise((res) => setTimeout(res, 200));
  let list = [...paperVendorsState];

  if (filter?.academicYear) {
    list = list.filter((v) => v.academicYear === filter.academicYear);
  }
  if (filter?.paperMillName) {
    list = list.filter((v) =>
      v.paperMillName
        .toLowerCase()
        .includes(filter.paperMillName!.toLowerCase()),
    );
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (v) =>
        v.vendorName.toLowerCase().includes(q) ||
        v.paperMillName.toLowerCase().includes(q) ||
        v.contactNo.includes(q) ||
        v.emailId.toLowerCase().includes(q),
    );
  }

  return list;
}

export async function getPaperVendorById(
  id: number,
): Promise<PaperVendor.Item | undefined> {
  await new Promise((res) => setTimeout(res, 150));
  return paperVendorsState.find((v) => v.vendorId === id);
}

export async function createPaperVendor(
  form: PaperVendor.VendorForm,
): Promise<PaperVendor.Item> {
  await new Promise((res) => setTimeout(res, 300));
  const newId = Math.max(0, ...paperVendorsState.map((v) => v.vendorId)) + 1;
  const approvedTon = Number(form.approvedTon || 0);
  const suppliedTon = Number(form.suppliedTon || 0);
  const balanceTon = Math.max(0, approvedTon - suppliedTon);
  const ratePerMt = Number(form.ratePerMt || 0);
  const totalRateAmount = approvedTon * ratePerMt;

  const newVendor: PaperVendor.Item = {
    vendorId: newId,
    vendorName: form.vendorName,
    paperMillName: form.paperMillName,
    address: form.address,
    contactNo: form.contactNo,
    emailId: form.emailId,
    academicYear: form.academicYear,
    approvedTon,
    suppliedTon,
    balanceTon,
    ratePerMt,
    totalRateAmount,
    securityDeposit: Number(form.securityDeposit || 0),
    agreementDocUrl:
      form.agreementDocUrl ||
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    isActive: true,
    status: "Active",
    createdDate: new Date().toISOString().split("T")[0],
  };

  paperVendorsState = [newVendor, ...paperVendorsState];
  return newVendor;
}

export async function updatePaperVendor(
  id: number,
  form: PaperVendor.VendorForm,
): Promise<PaperVendor.Item> {
  await new Promise((res) => setTimeout(res, 300));
  const idx = paperVendorsState.findIndex((v) => v.vendorId === id);
  if (idx === -1) throw new Error("Paper Vendor not found");

  const approvedTon = Number(form.approvedTon || 0);
  const suppliedTon = Number(
    form.suppliedTon || paperVendorsState[idx].suppliedTon,
  );
  const balanceTon = Math.max(0, approvedTon - suppliedTon);
  const ratePerMt = Number(form.ratePerMt || 0);
  const totalRateAmount = approvedTon * ratePerMt;

  const updated: PaperVendor.Item = {
    ...paperVendorsState[idx],
    vendorName: form.vendorName,
    paperMillName: form.paperMillName,
    address: form.address,
    contactNo: form.contactNo,
    emailId: form.emailId,
    academicYear: form.academicYear,
    approvedTon,
    suppliedTon,
    balanceTon,
    ratePerMt,
    totalRateAmount,
    securityDeposit: Number(form.securityDeposit || 0),
    agreementDocUrl:
      form.agreementDocUrl || paperVendorsState[idx].agreementDocUrl,
  };

  paperVendorsState[idx] = updated;
  return updated;
}

export async function togglePaperVendorStatus(
  id: number,
  isActive: boolean,
): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 150));
  const item = paperVendorsState.find((v) => v.vendorId === id);
  if (item) {
    item.isActive = isActive;
    item.status = isActive ? "Active" : "Inactive";
    return true;
  }
  return false;
}

export async function deletePaperVendor(id: number): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 200));
  paperVendorsState = paperVendorsState.filter((v) => v.vendorId !== id);
  return true;
}
