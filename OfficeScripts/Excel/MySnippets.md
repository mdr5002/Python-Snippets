```ts
/** Get all the column labels as an array. */
function getColLabels(sheet: ExcelScript.Worksheet) {
  return sheet.getUsedRange().getRow(0).getValues()[0];
}
```

---

```ts
function main(workbook: ExcelScript.Workbook) {
    // Get the current worksheet
    let sheet = workbook.getActiveWorksheet();

    // Clear all filters
    let tables = sheet.getTables();
    tables.forEach(table => {
        let filter = table.getAutoFilter();
        if (filter) {
            filter.clearCriteria();
            filter.remove
        }
    });
}
```
