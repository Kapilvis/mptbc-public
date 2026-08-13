import React, { useState } from "react";
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
            Printer Registration / मुद्रक पंजीकरण
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to register a new printing press profile.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => navigate("/printing/printer-registration")}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-300 transition-all cursor-pointer"
          >
            <i className="pi pi-arrow-left text-xs" />
            <span>Back to List / वापस सूचि</span>
          </button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* 1. Basic & Firm Details */}
        <FormSection
          icon="pi pi-building"
          title="Firm & Printer Profile"
          subtitle="Basic identity, tax details, and press categorization."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Printer / Press Name <span className="text-red-500">*</span>
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
                Firm Registration Number <span className="text-red-500">*</span>
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
                Printer Category / Type <span className="text-red-500">*</span>
              </label>
              <select
                name="printerType"
                value={formData.printerType}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="">Select Category</option>
                <option value="Category A">Category A (श्रेणी अ)</option>
                <option value="Category B">Category B (श्रेणी ब)</option>
                <option value="Category C">Category C (श्रेणी स)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                GSTIN Number
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
                PAN Number
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
                Establishment Year
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
          title="Address & Geography Details"
          subtitle="Provide registered factory and communication address markers."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Address Line 1 <span className="text-red-500">*</span>
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
                Address Line 2
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
                State
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
                District
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="">Select District</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Gwalior">Gwalior</option>
                <option value="Jabalpur">Jabalpur</option>
                <option value="Ujjain">Ujjain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                City / Town
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
                PIN Code
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
          title="Printing Capacity & Technical Profile"
          subtitle="Assess machine infrastructure, capacity limits, and approved job rates."
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Assessed Printing Capacity{" "}
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
                Approved Permitted Capacity{" "}
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
                Rates Approved (per 1000 copies)
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
                Printing Job Allotted
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
              Machine & Equipment Infrastructure Details
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
          title="Bank Account Profile"
          subtitle="Bank details required for billing, security deposit, and payment transfers."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Bank Name
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
                Account Number
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
                IFSC Code
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
                Branch Name & Location
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
            label="Reset Form"
            icon="refresh"
            onClick={handleReset}
          />
          <Button type="submit" label="Save Printer Profile" icon="save" />
        </div>
      </form>
    </div>
  );
}
