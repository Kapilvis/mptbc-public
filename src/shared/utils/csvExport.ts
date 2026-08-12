export function exportToCSV<T>(
  data: T[],
  columns: Controls.ColumnProps<T>[],
  filename = "export.csv",
) {
  // Only export columns that have a field defined
  const exportableColumns = columns.filter((col) => col.field);

  if (exportableColumns.length === 0) return;

  const headers = exportableColumns.map((col) =>
    String(col.header ?? col.field),
  );
  const csvRows: string[] = [];

  // Add headers row
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","));

  // Add data rows
  for (const item of data) {
    const row = exportableColumns.map((col) => {
      if (!col.field) return '""';
      const rawValue = item[col.field];

      let valueStr = "";
      if (rawValue !== undefined && rawValue !== null) {
        if (typeof rawValue === "boolean") {
          valueStr = rawValue ? "Yes" : "No";
        } else if (rawValue instanceof Date) {
          valueStr = rawValue.toLocaleDateString();
        } else if (typeof rawValue === "object") {
          valueStr = JSON.stringify(rawValue);
        } else {
          valueStr = String(rawValue);
        }
      }

      // Escape double quotes in CSV values
      return `"${valueStr.replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(","));
  }

  // Create Blob with UTF-8 BOM so Excel opens it with correct encoding
  const csvContent = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToExcel<T>(
  data: T[],
  columns: Controls.ColumnProps<T>[],
  title = "Grid Data",
  filename = "export.xls",
) {
  // Only export columns that have a field defined
  const exportableColumns = columns.filter((col) => col.field);

  if (exportableColumns.length === 0) return;

  const numColumns = exportableColumns.length + 1;
  const headers = [
    "Sr. No.",
    ...exportableColumns.map((col) => String(col.header ?? col.field)),
  ];

  // Generate headers HTML
  const headerCells = headers
    .map((h) => `<th class="col-header">${h}</th>`)
    .join("");

  // Generate data rows HTML
  const dataRowsHtml = data
    .map((item, index) => {
      const srNoCell = `<td style="text-align: center;">${index + 1}</td>`;
      const cells = exportableColumns
        .map((col) => {
          if (!col.field) return "<td></td>";
          const rawValue = item[col.field];

          let valueStr = "";
          if (rawValue !== undefined && rawValue !== null) {
            if (typeof rawValue === "boolean") {
              valueStr = rawValue ? "Yes" : "No";
            } else if (rawValue instanceof Date) {
              valueStr = rawValue.toLocaleDateString();
            } else if (typeof rawValue === "object") {
              valueStr = JSON.stringify(rawValue);
            } else {
              valueStr = String(rawValue);
            }
          }

          // HTML escape
          const escapedVal = valueStr
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

          return `<td>${escapedVal}</td>`;
        })
        .join("");
      return `<tr>${srNoCell}${cells}</tr>`;
    })
    .join("\n");

  // Get current date time string in 12-hour format
  const dateTimeStr = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Construct HTML Excel content with Excel-specific worksheets options for gridlines
  const excelTemplate = `
<html xmlns:o="urn:schemas-microsoft-excel:office:office" xmlns:x="urn:schemas-microsoft-excel:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${title.substring(0, 30).replace(/[\\\\\\/?*\\[\\]]/g, "") || "Sheet1"}</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    table { border-collapse: collapse; }
    td, th { border: 0.5pt solid #cccccc; padding: 6px; font-family: Arial, sans-serif; font-size: 10pt; }
    .main-header { font-weight: bold; font-size: 14pt; background-color: #2a1250; color: #ffffff; text-align: center; height: 35px; }
    .sub-header { font-weight: bold; font-size: 11pt; background-color: #ede9f8; color: #2a1250; text-align: center; height: 25px; }
    .col-header { font-weight: bold; font-size: 10pt; background-color: #f1f5f9; text-align: left; }
  </style>
</head>
<body>
  <table>
    <!-- First Row: Title Header -->
    <tr>
      <th class="main-header" colspan="${numColumns}">Madhya Pradesh Textbook Corporation</th>
    </tr>
    <!-- Second Row: Form details | Date Time -->
    <tr>
      <td class="sub-header" colspan="${numColumns}">${title} | ${dateTimeStr}</td>
    </tr>
    <!-- Column Headers -->
    <tr>
      ${headerCells}
    </tr>
    <!-- Data Rows -->
    ${dataRowsHtml}
  </table>
</body>
</html>
  `;

  const blob = new Blob([excelTemplate], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const fileDateTimeStr = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}-${ampm}`;

  const lastDotIndex = filename.lastIndexOf(".");
  const baseName =
    lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
  const extension =
    lastDotIndex !== -1 ? filename.substring(lastDotIndex) : ".xls";
  const finalFilename = `${baseName}_${fileDateTimeStr}${extension}`;

  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", finalFilename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
