

---

You are tasked with cleaning and preprocessing a dataset to ensure accuracy and repeatability. Follow the steps below to transform the data according to the specified rules:

Important Fields and Values:

Serial Number: Must be 12 characters long with a hyphen ("-").
Model: Allowed values are "2N", "4L", "4N", "6L", "6N", "2L".
LSV/PTV: Allowed values are "PTV", "LSV".
Battery: Allowed values are "105", "210".
Body Color: Allowed values are "Pearl White", "Titanium Green", "Tiffany Matte Blue", "Lunar Silver", "Ruby Red", "Jet Black", "Cobalt Blue", "Slate Gray".
Seat Cover: Allowed values are "-", "Brown", "Pebble", "Charcoal", "Gold", "Rust", "Black".
Sheet Structure:

Order Details Sheet: Contains columns like PO Number, Model, LSV/PTV, Battery, Body Color, Seat Cover, etc.
Dealer List Sheet: Contains dealer information for lookups. Match the dealer name or address with what is on the Lookup Table and return the dealer number (format: A###).
The dealer table is in the first sheet.  do not format the this sheet as you need it for Dealer info
Steps for Data Cleaning and Preprocessing:

Initial Setup:

Load the original dataset and the dealer lookup information.
Ensure headers are correctly identified and loaded.
Data Standardization and Cleaning:

Convert all text to uppercase and remove leading/trailing whitespace.
Standardize body color and seat cover names using the provided mappings.
Ensure all date columns are in the correct format (%d-%m-%Y).
Use the lookup table to add dealer numbers based on dealer names.
Remove unnecessary and entirely empty columns.
Creating a Comprehensive List:

Track all unique serial numbers across all sheets.
Compile a comprehensive list of unique serial numbers and their properties.
Verification and Saving:

Manually inspect and verify the standardized values.
Save the cleaned and standardized dataset to a new Excel file.
Mapping for Body Colors:

If contains "MATTE", "LAKE", "CK10": "Tiffany Matte Blue".
If contains "NAVY", "CK03", (non-classified with "BLUE" after these): "Cobalt Blue".
If contains "BLACK", "CK04": "Jet Black".
If contains "GREEN", "SILVER GREEN", "CK06": "Titanium Green".
If contains "RED", "CK02": "Ruby Red".
If contains "SILVER", "CK05": "Lunar Silver".
If contains "CHARCOAL", "CK07": "Slate Gray".
If contains "WHITE", "CK01": "Pearl White".
Mapping for Seat Covers:

Remove all appearances of "COBRA".
If contains "STANDARD", "BLACK": "Black".
If contains "RUST": "Rust".
If contains "GOLD": "Gold".
If contains "PEBBLE": "Pebble".
If contains "CHARCOAL": "Charcoal".
If contains "BROWN": "Brown".
All else: "-".

Python Implementation Example:

```python
import pandas as pd

# Load the datasets
orders_df = pd.read_excel("mirror_log.xlsx")
dealer_df = pd.read_excel("CleanTemp.xlsx")

# Function to clean and standardize data
def clean_data(df, dealer_lookup):
    df.columns = df.columns.str.upper().str.strip()
    
    # Trim and uppercase all text fields
    df = df.applymap(lambda x: x.strip().upper() if isinstance(x, str) else x)
    
    # Standardize body colors
    body_color_map = {
        "*MATTE*": "TIFFANY MATTE BLUE",
        "*LAKE*": "TIFFANY MATTE BLUE",
        "*CK10*": "TIFFANY MATTE BLUE",
        "*NAVY*": "COBALT BLUE",
        "*CK03*": "COBALT BLUE",
        "*BLUE*": "COBALT BLUE",
        "*BLACK*": "JET BLACK",
        "*CK04*": "JET BLACK",
        "*GREEN*": "TITANIUM GREEN",
        "*SILVER GREEN*": "TITANIUM GREEN",
        "*CK06*": "TITANIUM GREEN",
        "*RED*": "RUBY RED",
        "*CK02*": "RUBY RED",
        "*SILVER*": "LUNAR SILVER",
        "*CK05*": "LUNAR SILVER",
        "*CHARCOAL*": "SLATE GRAY",
        "*CK07*": "SLATE GRAY",
        "*WHITE*": "PEARL WHITE",
        "*CK01*": "PEARL WHITE"
    }
    
    for key, value in body_color_map.items():
        df['BODY COLOR'] = df['BODY COLOR'].str.replace(key, value, regex=True)
    
    # Standardize seat covers
    seat_cover_map = {
        "*COBRA*": "",
        "*STANDARD*": "BLACK",
        "*BLACK*": "BLACK",
        "*RUST*": "RUST",
        "*GOLD*": "GOLD",
        "*PEBBLE*": "PEBBLE",
        "**CHARCOAL**": "CHARCOAL",
        "**BROWN**": "BROWN"
    }
    
    for key, value in seat_cover_map.items():
        df['SEAT COVER'] = df['SEAT COVER'].str.replace(key, value, regex=True)
    
    # Lookup dealer number
    df = df.merge(dealer_lookup[['DEALER NAME', 'DEALER NUMBER']], left_on='DEALER', right_on='DEALER NAME', how='left')
    
    # Remove unnecessary columns
    df.drop(columns=['DEALER NAME'], inplace=True)
    
    # Remove empty columns
    df.dropna(axis=1, how='all', inplace=True)
    
    return df

# Clean the data
cleaned_df = clean_data(orders_df, dealer_df)

# Save the cleaned data to a new file
cleaned_df.to_excel("cleaned_data.xlsx", index=False)
```
first, review this cleaned up version of what I will send to get a feel for what I am looking for.  
when  you are ready i will upload the file to be cleaned 