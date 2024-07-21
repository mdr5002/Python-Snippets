function main(workbook: ExcelScript.Workbook) {
  try {
    // Rename sheets to WS1, WS2, etc.
    let sheets: ExcelScript.Worksheet[] = workbook.getWorksheets();
    sheets.forEach((sheet: ExcelScript.Worksheet, index: number) => {
      sheet.setName(`WS${index + 1}`);
      console.log(`Renamed sheet ${index + 1} to WS${index + 1}`);
    });

    // Hardcode the sheet name for now (change this to the sheet you want to process)
    let selectedSheetName: string = "WS1";
    console.log(`Selected sheet name: ${selectedSheetName}`);

    // Validate the selected sheet name
    if (!selectedSheetName || !sheets.map(sheet => sheet.getName()).includes(selectedSheetName)) {
      console.log("Invalid or no sheet selected. Process cancelled.");
      return;
    }

    // Get the selected worksheet
    let sheet: ExcelScript.Worksheet = workbook.getWorksheet(selectedSheetName);

    // Clear any existing filters
    sheet.getAutoFilter()?.clearCriteria();
    console.log("Cleared existing filters");

    // Get the header row and determine the last non-blank cell
    let headerRow: ExcelScript.Range = sheet.getRange("1:1");
    let headerValues = headerRow.getValues();

    if (!headerValues || !headerValues[0]) {
      console.log("Header row is empty or invalid.");
      return;
    }

    let lastHeaderColumnIndex: number = getLastNonBlankColumnIndex(headerRow);
    console.log(`Last non-blank column index: ${lastHeaderColumnIndex}`);

    let totalColumns: number = lastHeaderColumnIndex + 1;
    console.log(`Total columns based on header row: ${totalColumns}`);

    // Get the used range of the sheet
    let usedRange: ExcelScript.Range = sheet.getUsedRange();
    let rowCount: number = usedRange.getRowCount();
    let columnCount: number = usedRange.getColumnCount();
    console.log(`Initial Used Range - Rows: ${rowCount}, Columns: ${columnCount}`);

    // Get all values once to improve performance
    let values: (string | number | boolean)[][] = usedRange.getValues();

    // Clean and preprocess values
    for (let i = 0; i < columnCount; i++) {
      for (let j = 0; j < rowCount; j++) {
        if (typeof values[j][i] === 'string') {
          values[j][i] = (values[j][i] as string).trim();
        }
        if (values[j][i] === null || values[j][i] === "") {
          values[j][i] = "-";
        }
      }
    }

    // Set the cleaned values back to the used range
    usedRange.setValues(values);
    console.log("Set cleaned values back to the used range");

    // Remove unnecessary columns based on the header row
    for (let i = columnCount - 1; i >= totalColumns; i--) {
      sheet.getRange().getColumn(i).delete(ExcelScript.DeleteShiftDirection.left);
      console.log(`Deleted column: ${i + 1}`);
    }