import fitz  # PyMuPDF
import pandas as pd
import re
import os

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    all_text = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        all_text.append(text)
    
    return all_text

def parse_text(text):
    data = []
    lines = text.split('\n')
    capture = False
    current_part = {}
    
    for line in lines:
        # Debug: Print each line to understand its content
        print(f"Processing line: {line}")
        
        if "KALAS PART #:" in line:
            capture = True
            if current_part:  # Save previous part data if any
                data.append(current_part)
            current_part = {
                "KALAS PART #": line.split("KALAS PART #:")[1].strip(),
                "Customer Part #": "",
                "Description": "",
                "Rev": "",
                "Release": "",
                "UM": "",
                "Item": "",
                "Agreement": "",
                "Material": "",
                "Wt": "",
                "Unit": "",
                "Ref": "",
                "Sales": ""
            }
            continue
        
        if capture and ("Page" in line or line.strip() == ""):
            capture = False
            continue
        
        if capture and current_part:
            # Populate fields based on identified patterns
            for key in current_part.keys():
                if key in line:
                    current_part[key] = line.split(f"{key}:")[1].strip()
    
    if current_part:  # Save last part data
        data.append(current_part)
    
    return data

def main(pdf_path, output_csv):
    try:
        # Step 2: Extract text from the PDF
        all_text = extract_text_from_pdf(pdf_path)
        
        # Step 3: Parse the extracted text
        parsed_data = []
        for text in all_text:
            parsed_data.extend(parse_text(text))
        
        # Step 4: Organize the data into a DataFrame
        columns = ["KALAS PART #", "Customer Part #", "Description", "Rev", "Release", "UM", "Item", "Agreement", "Material", "Wt", "Unit", "Ref", "Sales"]
        df = pd.DataFrame(parsed_data, columns=columns)
        
        # Step 5: Save the DataFrame to a CSV file
        df.to_csv(output_csv, index=False)
        print(f"Data has been successfully extracted and saved to {output_csv}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    pdf_path = '/workspaces/openai-cookbook/examples/data/example_pdfs/Anixter Canada July-24 (1).pdf'
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    output_csv = f"{base_name}.csv"
    main(pdf_path, output_csv)