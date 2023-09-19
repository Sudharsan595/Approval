import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, Typography, Container, Grid } from "@mui/material";
import ExcelService from "../service/ExcelService";

function Upload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filename, setfilename] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [existingdata, setexistingdata] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (jsonData !== null) {
      handleUpload();
    }
    // eslint-disable-next-line
  }, [jsonData]);

  useEffect(() => {
    ExcelService.getAllFiles().then((res) => {
      setexistingdata(res);
    });
  }, [uploadedFile]);

  const handleFileChange = (event) => {
    setSuccessMessage(null);
    const selectedFile = event.target.files[0];
    setfilename(selectedFile?.name);
    setUploadedFile(selectedFile);
    console.log(selectedFile);

    if (!selectedFile) {
      setErrorMessage("Please select a file.");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      setErrorMessage("Only .xlsx files are allowed.");
      return;
    }

    setErrorMessage(null);

    setfilename(selectedFile.name);
    setUploadedFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log(worksheet);

        const excelData1 = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        const startRow = 0;
        let endRow = 0;

        for (let i = excelData1.length - 1; i >= 0; i--) {
          const rowData = excelData1[i];
          const isRowEmpty = rowData.every((cellValue) => cellValue === "");
          if (!isRowEmpty) {
            endRow = i + 1;
            break;
          }
        }

        const excelData = excelData1.slice(startRow, endRow);

        console.log(excelData.length);
        console.log(excelData);
        if (excelData.length <= 1) {
          setErrorMessage("Excel sheet is empty or has no data.");
          setJsonData(null);
        } else {
          const questionData = transformExcelData(excelData);
          setErrorMessage(null);
          setJsonData(questionData);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };
  const transformExcelData = (excelData) => {
    // const headers = excelData[0];
    const headerKeys = [
      "Base HL File Number",
      "Loan amount Max",
      "Tenor Min",
      "Tenor Max",
      "Net ROI",
      "Net Income",
      "Obligation",
      "Fees Percentage",
      "Fees Amount",
    ];

    const questionData = [];

    excelData.slice(1).forEach((row) => {
      const rowData = {};
      headerKeys.forEach((header, index) => {
        if (header === "base_HL_File_Number") {
          rowData[header] = row[index] ? row[index].toString() : null;
        } else if (header === "loan_amount_Max") {
          rowData[header] = row[index] ? row[index].toString() : null;
        } else {
          rowData[header] = row[index];
        }
      });

      questionData.push(rowData);
    });

    return questionData;
  };

  const handleUpload = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setJsonData(null);
    setfilename(null);
    setUploadedFile(null);

    if (!jsonData || jsonData.length <= 0) {
      setErrorMessage("Excel sheet is empty or has no data.");
    } else {
      const invalidRows = validateExcelData(jsonData);
      if (invalidRows.length > 0) {
        highlightInvalidCells(invalidRows);
      } else {
        jsonData.forEach((i) => {
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["base_HL_File_Number"]: i["Base HL File Number"],
          })["Base HL File Number"];
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["loan_amount_Max"]: i["Loan amount Max"],
          })["Loan amount Max"];
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["tenor_Min"]: i["Tenor Min"],
          })["Tenor Min"];
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["tenor_Max"]: i["Tenor Max"],
          })["Tenor Max"];
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["net_ROI"]: i["Net ROI"],
          })["Net ROI"];
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["net_Income"]: i["Net Income"],
          })["Net Income"];
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["obligation"]: i["Obligation"],
          })["Obligation"];
          delete Object.assign(i, {
            // eslint-disable-next-line
            ["fees_Percentage"]: i["Fees Percentage"],
          })["Fees Percentage"];

          delete Object.assign(i, {
            // eslint-disable-next-line
            ["fees_Amount"]: i["Fees Amount"],
          })["Fees Amount"];
        });
        ExcelService.postExcel(jsonData).then((res) => {
          if (res.length === 0) {
            setUploadedFile(null);
            setfilename(null);
            setJsonData(null);
            setErrorMessage(null);
            setSuccessMessage("Uploaded successfully!");
            fileInputRef.current.value = "";
          } else {
            setSuccessMessage(null);
            fileInputRef.current.value = "";
          }
        });
      }
    }
  };

  const validateExcelData = (data) => {
    const invalidRows = [];
    data.forEach((row, rowIndex) => {
      const baseHLFileNumber = row["Base HL File Number"];
      const loanamount = row["Loan amount Max"];
      const tenormin = row["Tenor Min"];
      const tenormax = row["Tenor Max"];
      const netroi = row["Net ROI"];
      const netincome = row["Net Income"];
      const feesamount = row["Fees Amount"];
      const obligation = row["Obligation"];
      const feespercentage = row["Fees Percentage"];

      // Check if baseHLFileNumber contains special characters
      if (!/^[a-zA-Z0-9]+$/.test(baseHLFileNumber)) {
        invalidRows.push(rowIndex + 2);
      }

      if (!/^[0-9]+$/.test(loanamount) || parseInt(loanamount) === 0) {
        invalidRows.push(rowIndex + 2);
      }

      if (!/^[0-9]+$/.test(tenormin) || parseInt(tenormin) === 0) {
        invalidRows.push(rowIndex + 2);
      }

      if (!/^[0-9]+$/.test(tenormax) || parseInt(tenormax) === 0) {
        invalidRows.push(rowIndex + 2);
      } else if (parseInt(tenormax) < parseInt(tenormin)) {
        invalidRows.push(rowIndex + 2);
      }

      if (!/^[0-9]+(\.[0-9]+)?$/.test(netroi) || parseInt(netroi) === 0) {
        invalidRows.push(rowIndex + 2);
      }

      if (!/^[0-9]+$/.test(netincome) || parseInt(netincome) === 0) {
        invalidRows.push(rowIndex + 2);
      }

      // if (!/^[0-9]+$/.test(feesamount) || parseInt(feesamount) === 0) {
      //   invalidRows.push(rowIndex + 2);
      // }

      if (obligation !== "" && !/^[0-9]+$/.test(obligation)) {
        invalidRows.push(rowIndex + 2);
      }
      if (
        (feesamount !== "" && feespercentage !== "") ||
        (feesamount === "" && feespercentage === "")
      ) {
        invalidRows.push(rowIndex + 2);
      } else if (feesamount !== "" && !/^[0-9]+$/.test(feesamount)) {
        invalidRows.push(rowIndex + 2);
      } else if (
        feespercentage !== "" &&
        (!/^[0-9]+$/.test(feespercentage) || parseInt(feespercentage) === 0)
      ) {
        invalidRows.push(rowIndex + 2);
      }
      // Check for duplicates in existing data
      if (existingdata.includes(baseHLFileNumber)) {
        invalidRows.push(rowIndex + 2);
      }
    });
    return invalidRows;
  };

  const highlightInvalidCells = (invalidRows) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const redFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0000" },
    };

    const yellowFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };

    const boldHeaderStyle = {
      font: { bold: true },
    };

    const headers = Object.keys(jsonData[0]);
    headers.push("errors");
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.fill = yellowFill;
      cell.font = boldHeaderStyle.font;
    });

    // worksheet.columns.forEach((column) => {
    //   column.width = headers.reduce(
    //     (max, header) => Math.max(max, header.length + 2),
    //     0
    //   );
    // });

    // jsonData.forEach((row, rowIndex) => {
    //   if (invalidRows.includes(rowIndex + 2)) {
    //     const existingRow = existingdata.find(
    //       (existingRow) => existingRow === row["Base HL File Number"]
    //     );
    //     if (existingRow) {
    //       row["errors"] = "Existing Data";
    //     }
    //   }
    // });

    const errorMessages = [];
    jsonData.forEach((row, rowIndex) => {
      // console.log(row);
      const worksheetRow = worksheet.addRow(Object.values(row));
      if (invalidRows.includes(rowIndex + 2)) {
        const errors = [];
        headers.forEach((header, index) => {
          const cellValue = row[header];
          if (
            header === "Loan amount Max" ||
            header === "Tenor Min" ||
            header === "Tenor Max" ||
            header === "Net Income"
          ) {
            if (invalidRows.includes(rowIndex + 2)) {
              if (!/^[0-9]+$/.test(cellValue)) {
                worksheetRow.getCell(index + 1).fill = redFill;
                errors.push(`  ${header}: should be in number only`);
              } else if (parseInt(cellValue) === 0) {
                worksheetRow.getCell(index + 1).fill = redFill;
                errors.push(`  ${header}: Should not be zero`);
              }
            }
          }

          if (header === "Obligation") {
            if (cellValue !== "" && !/^[0-9]+$/.test(cellValue)) {
              worksheetRow.getCell(index + 1).fill = redFill;
              errors.push(`  ${header}: should be in number only`);
            }
          }

          if (header === "Fees Amount") {
            if (invalidRows.includes(rowIndex + 2)) {
              if (cellValue === "") {
                // Allow empty cells
                worksheetRow.getCell(index + 1).value = null; // You can set it to null or any other appropriate value
              } else if (!/^[0-9]+$/.test(cellValue)) {
                worksheetRow.getCell(index + 1).fill = redFill;
                errors.push(`  ${header}: should be in number only`);
              } else if (parseInt(cellValue) === 0) {
                worksheetRow.getCell(index + 1).fill = redFill;
                errors.push(`  ${header}: Should not be zero`);
              }
            }
          }

          if (header === "Fees Amount" && cellValue !== "") {
            if (row["Fees Percentage"] !== "") {
              worksheetRow.getCell(
                headers.indexOf("Fees Percentage") + 1
              ).fill = redFill;
              errors.push(
                "Fees Percentage should be empty when Fees Amount has a value"
              );
            }
          } else if (header === "Fees Percentage" && cellValue !== "") {
            if (row["Fees Amount"] !== "") {
              worksheetRow.getCell(headers.indexOf("Fees Amount") + 1).fill =
                redFill;
              errors.push(
                "Fees Amount should be empty when Fees Percentage has a value"
              );
            }
          }

          if (header === "Net ROI") {
            if (invalidRows.includes(rowIndex + 2)) {
              if (!/^[0-9]+(\.[0-9]+)?$/.test(cellValue)) {
                worksheetRow.getCell(index + 1).fill = redFill;
                errors.push(`  ${header}: should be in number `);
              }
            }
          }
          // Check if it's an invalid cell
          if (header === "Base HL File Number") {
            if (invalidRows.includes(rowIndex + 2)) {
              if (!/^[a-zA-Z0-9]+$/.test(cellValue)) {
                worksheetRow.getCell(index + 1).fill = redFill;
                errors.push(`  ${header}: Invalid Cell`);
              } else if (existingdata.includes(cellValue)) {
                worksheetRow.getCell(index + 1).fill = redFill;
                errors.push(`  ${header}: Data Is Already Present`);
              }
            }
          }
          if (header === "Tenor Max") {
            if (parseInt(cellValue) < parseInt(row["Tenor Min"])) {
              worksheetRow.getCell(index + 1).fill = redFill;
              errors.push(`  ${header}: Should not be less than Tenor Min`);
            }
          }
          if (header === "Fees Percentage") {
            if (cellValue === "") {
              // Allow empty cells
              worksheetRow.getCell(index + 1).value = null; // You can set it to null or any other appropriate value
            } else if (!/^[0-9]+(\.[0-9]+)?$/.test(cellValue)) {
              worksheetRow.getCell(index + 1).fill = redFill;
              errors.push(
                `  ${header}: should not have characters and special characters`
              );
            } else if (parseInt(cellValue) === 0) {
              worksheetRow.getCell(index + 1).fill = redFill;
              errors.push(`  ${header}: Should not be zero`);
            } else {
              // Convert the value to a number and round it to 2 decimal places
              const feesPercentage = parseFloat(cellValue);
              const roundedFeesPercentage = parseFloat(
                feesPercentage.toFixed(2)
              );

              // Update the cell value with the rounded fees percentage
              worksheetRow.getCell(index + 1).value = roundedFeesPercentage;
            }
          }

          if (
            header === "Fees Amount" &&
            row["Fees Percentage"] === "" &&
            cellValue === ""
          ) {
            worksheetRow.getCell(index + 1).fill = redFill;
            errors.push("Fees Amount or Fees Percentage should have a value");
          }

          if (
            header === "Fees Percentage" &&
            row["Fees Amount"] === "" &&
            cellValue === ""
          ) {
            worksheetRow.getCell(index + 1).fill = redFill;
            errors.push("Fees Amount or Fees Percentage should have a value");
          }
        });

        worksheetRow.getCell(headers.length).value = errors.join("\n");
        errorMessages.push(...errors);
      }
    });

    if (errorMessages.length > 0) {
      setErrorMessage("There is empty cell in the excel sheet");
    } else {
      setErrorMessage("");
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const newname = filename.replace(".xlsx", "_errorsheet.xlsx");
      saveAs(blob, newname);
    });
  };

  const generateHeadersExcel = () => {
    const headers = [
      "Base HL File Number",
      "Loan amount Max",
      "Tenor Min",
      "Tenor Max",
      "Net ROI",
      "Net Income",
      "Obligation",
      "Fees Percentage",
      "Fees Amount",
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerStyle = {
      font: { bold: true, color: { argb: "000000" } },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEA00" },
      },
    };

    worksheet.addRow(headers);
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;
    });

    // worksheet.columns.forEach((column) => {
    //   column.width = headers.reduce(
    //     (max, header) => Math.max(max, header.length + 2),
    //     0
    //   );
    // });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Eligible_KYC_File.xlsx");
    });
  };

  return (
    <Container maxWidth="xs">
      <Typography
        variant="h4"
        sx={{ fontStyle: "bold", fontFamily: "Helvetica Neue" }}
      >
        Upload Excel File
      </Typography>
      <Grid container mt={10} columnSpacing={20} rowSpacing={3}>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            onClick={generateHeadersExcel}
            style={{ fontSize: "0.7rem", width: "160px" }}
          >
            Download Excel
          </Button>
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            onClick={handleUpload}
            style={{ fontSize: "0.7rem", width: "160px" }}
          >
            Upload
          </Button>
        </Grid> */}
        <Grid item xs={12} sm={4}>
          <label htmlFor="file-input">
            <Button
              variant="contained"
              component="span"
              style={{ fontSize: "0.7rem", width: "160px" }}
            >
              {uploadedFile ? uploadedFile.name : "Upload"}
            </Button>
          </label>
          <input
            id="file-input"
            type="file"
            accept=".xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Grid>
      </Grid>
      {errorMessage && (
        <Typography variant="body1" color="error" sx={{ marginTop: 1 }}>
          {errorMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography variant="body1" color="success" sx={{ marginTop: 1 }}>
          {successMessage}
        </Typography>
      )}
    </Container>
  );
}

export default Upload;
