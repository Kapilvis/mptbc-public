import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/components/buttons";

interface FormSectionProps {
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  icon,
  title,
  subtitle,
  children,
}) => (
  <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6 mb-6">
    <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-100">
      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
        <i className={`${icon} text-lg`} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export default function PrinterRegistration() {
  const { t: baseT } = useTranslation();
  const t = (key: string) => baseT(key, { lng: "en" });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Details
    printerName: "",
    firmRegistrationNo: "",
    printerType: "",
    gstinNo: "",
    panNo: "",
    establishmentYear: "",
    // Address Details
    addressLine1: "",
    addressLine2: "",
    state: "Madhya Pradesh",
    district: "",
    city: "",
    pinCode: "",
    // Capacity & Technical Details
    assessedCapacity: "",
    permittedCapacity: "",
    ratesApproved: "",
    allocatedJob: "",
    machineDetails: "",
    // Bank Profile
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    // Emergency Contact & Remarks
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyRelation: "",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      printerName: "",
      firmRegistrationNo: "",
      printerType: "",
      gstinNo: "",
      panNo: "",
      establishmentYear: "",
      addressLine1: "",
      addressLine2: "",
      state: "Madhya Pradesh",
      district: "",
      city: "",
      pinCode: "",
      assessedCapacity: "",
      permittedCapacity: "",
      ratesApproved: "",
      allocatedJob: "",
      machineDetails: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyRelation: "",
      remarks: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("printing.registration.header")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("printing.registration.subHeader")}
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => navigate("/printing/printer-registration")}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-300 transition-all cursor-pointer"
          >
            <i className="pi pi-arrow-left text-xs" />
            <span>{t("printing.registration.back_to_list")}</span>
          </button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* 1. Basic & Firm Details */}
        <FormSection
          icon="pi pi-building"
          title={t("printing.registration.sections.firm_profile.title")}
          subtitle={t("printing.registration.sections.firm_profile.subTitle")}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.printer_name")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="printerName"
                value={formData.printerName}
                onChange={handleChange}
                placeholder="e.g. M/s Ajanta Packaging"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.firm_registration_no")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firmRegistrationNo"
                value={formData.firmRegistrationNo}
                onChange={handleChange}
                placeholder="Enter Firm Reg. No."
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.printer_type")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="printerType"
                value={formData.printerType}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="">
                  {t("printing.registration.fields.select_category")}
                </option>
                <option value="Category A">
                  {t("printing.registration.fields.category_a")}
                </option>
                <option value="Category B">
                  {t("printing.registration.fields.category_b")}
                </option>
                <option value="Category C">
                  {t("printing.registration.fields.category_c")}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.gstin_no")}
              </label>
              <input
                type="text"
                name="gstinNo"
                value={formData.gstinNo}
                onChange={handleChange}
                placeholder="15-character GSTIN"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.pan_no")}
              </label>
              <input
                type="text"
                name="panNo"
                value={formData.panNo}
                onChange={handleChange}
                placeholder="10-character PAN"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.establishment_year")}
              </label>
              <input
                type="text"
                name="establishmentYear"
                value={formData.establishmentYear}
                onChange={handleChange}
                placeholder="e.g. 2012"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </FormSection>

        {/* 2. Address & Geography Details */}
        <FormSection
          icon="pi pi-map-marker"
          title={t("printing.registration.sections.address_details.title")}
          subtitle={t(
            "printing.registration.sections.address_details.subTitle",
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.address_line1")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Industrial Plot No., Street / Area Name"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.address_line2")}
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Landmark, Industrial Area / Zone Name"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.state")}
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.district")}
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="">
                  {t("printing.registration.fields.select_district")}
                </option>
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Gwalior">Gwalior</option>
                <option value="Jabalpur">Jabalpur</option>
                <option value="Ujjain">Ujjain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.city")}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter Town/City name"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.pin_code")}
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="6-digit ZIP/PIN Code"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </FormSection>

        {/* 3. Printing Capacity & Infrastructure */}
        <FormSection
          icon="pi pi-cog"
          title={t("printing.registration.sections.technical_profile.title")}
          subtitle={t(
            "printing.registration.sections.technical_profile.subTitle",
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.assessed_capacity")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="assessedCapacity"
                value={formData.assessedCapacity}
                onChange={handleChange}
                placeholder="e.g. 50,000 books / day"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.permitted_capacity")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="permittedCapacity"
                value={formData.permittedCapacity}
                onChange={handleChange}
                placeholder="e.g. 40,000 books / day"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.rates_approved")}
              </label>
              <input
                type="text"
                name="ratesApproved"
                value={formData.ratesApproved}
                onChange={handleChange}
                placeholder="₹ Rate Amount"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.allocated_job")}
              </label>
              <input
                type="text"
                name="allocatedJob"
                value={formData.allocatedJob}
                onChange={handleChange}
                placeholder="e.g. Group A / Title 1-4"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("printing.registration.fields.machine_details")}
            </label>
            <textarea
              name="machineDetails"
              value={formData.machineDetails}
              onChange={handleChange}
              rows={2}
              placeholder="Specify offset printing machines, binding units, cutting units, and web machine details"
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
            />
          </div>
        </FormSection>

        {/* 4. Bank Account Profile */}
        <FormSection
          icon="pi pi-credit-card"
          title={t("printing.registration.sections.bank_profile.title")}
          subtitle={t("printing.registration.sections.bank_profile.subTitle")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.bank_name")}
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter Official Bank Name"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.account_number")}
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter Savings/Current Account No"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.ifsc_code")}
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="11-character bank code"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t("printing.registration.fields.branch_name")}
              </label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                placeholder="Enter Bank Branch Address Location"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </FormSection>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 flex items-center justify-end gap-3 shadow-xs">
          <Button
            type="button"
            label={t("printing.registration.reset_form")}
            icon="refresh"
            onClick={handleReset}
          />
          <Button
            type="submit"
            label={t("printing.registration.save_profile")}
            icon="save"
          />
        </div>
      </form>
    </div>
  );
}
