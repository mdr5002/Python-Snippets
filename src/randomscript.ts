function main(workbook: ExcelScript.Workbook) {
    let selectedSheet = workbook.getActiveWorksheet();
    let firstRow = selectedSheet.getRange("1:1");
    let extendedRangeRightFromA1 = selectedSheet.getRange("A1").getExtendedRange(ExcelScript.KeyboardDirection.right);

    // Auto fit columns for all cells and specific ranges
    selectedSheet.getRange().getFormat().autofitColumns();
    selectedSheet.getRange("A:A").getFormat().autofitColumns();

    // Formatting for the first row
    firstRow.getFormat().autofitColumns();
    firstRow.getFormat().getFont().setBold(true);
    firstRow.getFormat().setHorizontalAlignment(ExcelScript.HorizontalAlignment.center);
    firstRow.getFormat().setVerticalAlignment(ExcelScript.VerticalAlignment.center);
    firstRow.getFormat().setWrapText(false);
    firstRow.getFormat().setTextOrientation(0);
    firstRow.getFormat().setRowHeight(28.2);

// Formatting for extended range from A1
extendedRangeRightFromA1.getFormat().setHorizontalAlignment(ExcelScript.HorizontalAlignment.center);
extendedRangeRightFromA1.getFormat().setVerticalAlignment(ExcelScript.VerticalAlignment.center);
extendedRangeRightFromA1.getFormat().setWrapText(true);
extendedRangeRightFromA1.getFormat().setTextOrientation(0);

// Attempt to set bottom border style and weight, ensuring the border object is not null
const bottomBorder = extendedRangeRightFromA1.getFormat().getRangeBorder(ExcelScript.BorderIndex.edgeBottom);
if (bottomBorder) {
    bottomBorder.setStyle(ExcelScript.BorderLineStyle.continuous);
    bottomBorder.setWeight(ExcelScript.BorderWeight.thin);
}

// Remove other borders by ensuring the border object is not null before setting style
[
    ExcelScript.BorderIndex.diagonalDown,
    ExcelScript.BorderIndex.diagonalUp,
    ExcelScript.BorderIndex.edgeLeft,
    ExcelScript.BorderIndex.edgeTop,
    ExcelScript.BorderIndex.edgeRight,
    ExcelScript.BorderIndex.insideVertical,
    ExcelScript.BorderIndex.insideHorizontal
].forEach(borderIndex => {
    const border = extendedRangeRightFromA1.getFormat().getRangeBorder(borderIndex);
    if (border) {
        border.setStyle(ExcelScript.BorderLineStyle.none);
    }
        // Addition
        al specific column adjustments
    selectedSheet.getRange("C:C").getFormat().setHorizontalAlignment(ExcelScript.HorizontalAlignment.right);
    selectedSheet.getRange("C:C").getFormat().setTextOrientation(0);
    selectedSheet.getRange("C:C").getFormat().setIndentLevel(0);
}
});

