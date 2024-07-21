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

    // Validate the header row
    if (!headerValues || !headerValues[0] || headerValues[0].some(value => value === null || value === "" || typeof value !== "string")) {
      console.log("Header row is empty or contains invalid values.");
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

    // Update the used range after column removal
    usedRange = sheet.getUsedRange();
    rowCount = usedRange.getRowCount();
    columnCount = usedRange.getColumnCount();
    console.log(`Updated Used Range - Rows: ${rowCount}, Columns: ${columnCount}`);

    // Standardize seat and cart color descriptions
    let seatColumn: ExcelScript.Range | null = getColumnByName(sheet, "SEAT COLOR");
    let cartColorColumn: ExcelScript.Range | null = getColumnByName(sheet, "Cart Color");

    if (seatColumn && cartColorColumn) {
      let seatValues: (string | number | boolean)[][] = seatColumn.getValues();
      let cartColorValues: (string | number | boolean)[][] = cartColorColumn.getValues();

      for (let i = 1; i < rowCount; i++) {
        let seatValue: string = (seatValues[i][0] as string).toLowerCase();
        if (seatValue.includes("black")) seatValues[i][0] = "Black";
        else if (seatValue.includes("standard")) seatValues[i][0] = "Black";
        else if (seatValue.includes("char")) seatValues[i][0] = "Charcoal";
        else if (seatValue.includes("rust")) seatValues[i][0] = "Rust";
        else if (seatValue.includes("brown")) seatValues[i][0] = "Brown";
        else if (seatValue.includes("pebble")) seatValues[i][0] = "Pebble";
        else if (seatValue.includes("gold")) seatValues[i][0] = "Gold";
        else if (seatValue.includes("gray")) seatValues[i][0] = "Charcoal";
        else if (seatValue.includes("no seat") || seatValue.includes("??")) seatValues[i][0] = "None";

        let cartColorValue: string = (cartColorValues[i][0] as string).toLowerCase();
        if (cartColorValue.includes("red")) cartColorValues[i][0] = "Ruby Red";
        else if (cartColorValue.includes("white")) cartColorValues[i][0] = "Pearl White";
        else if (cartColorValue.includes("black")) cartColorValues[i][0] = "Jet Black";
        else if (cartColorValue.includes("navy")) cartColorValues[i][0] = "Cobalt Blue";
        else if (cartColorValue.includes("charcoal")) cartColorValues[i][0] = "Slate Gray";
        else if (cartColorValue.includes("matte")) cartColorValues[i][0] = "Tiffany Matte Blue";
        else if (cartColorValue.includes("green")) cartColorValues[i][0] = "Titanium Green";
        else if (cartColorValue === "blue") cartColorValues[i][0] = "Cobalt Blue";
        else if (cartColorValue.includes("grey")) cartColorValues[i][0] = "Slate Gray";
        else if (cartColorValue.includes("silv")) cartColorValues[i][0] = "Silver";
        else if (cartColorValue.includes("brown")) cartColorValues[i][0] = "Jet Black";
        else if (cartColorValue.includes("lake")) cartColorValues[i][0] = "Tiffany Matte Blue";
      }

      seatColumn.setValues(seatValues);
      cartColorColumn.setValues(cartColorValues);
      console.log("Standardized seat and cart color descriptions");
    } else {
      console.log("SEAT COLOR or Cart Color column not found.");
    }

    console.log(`Sheet ${sheet.getName()} - Data cleaning and preprocessing completed.`);
  } catch (error) {
    console.log("Error encountered: ", error);
  }
}

// Helper function to get the last non-blank column index in a range
function getLastNonBlankColumnIndex(range: ExcelScript.Range): number {
  let values = range.getValues();
  if (!values || !values[0]) {
    throw new Error("Range values are null or invalid.");
  }
  let rowValues = values[0];
  for (let i = rowValues.length - 1; i >= 0; i--) {
    if (rowValues[i] !== null && rowValues[i] !== "") {
      return i;
    }
  }
  return -1;
}

// Helper function to get a column by its name
function getColumnByName(sheet: ExcelScript.Worksheet, columnName: string): ExcelScript.Range | null {
  let headerRow: ExcelScript.Range = sheet.getRange("1:1");
  let values = headerRow.getValues();
  if (!values || !values[0]) {
    console.log(`Header values for column name ${columnName} are null or invalid.`);
    return null;
  }
  let headerValues = values[0];
  for (let i = 0; i < headerValues.length; i++) {
    if (headerValues[i] === columnName) {
      return sheet.getRangeByIndexes(0, i, sheet.getUsedRange().getRowCount(), 1);
    }
  }
  console.log(`Column name ${columnName} not found.`);
  return null;
}
