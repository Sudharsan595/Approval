import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

import React, { useEffect, useState } from "react";
import "./Billpayment.css";
import axios from "axios";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SaveIcon from "@mui/icons-material/Save";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import SendIcon from "@mui/icons-material/Send";
import Switch from "@mui/material/Switch";

function Billpayment() {
  const [edit, setedit] = useState(false);
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [branch, setBranch] = useState(null);

  const ADMIN = "ADMIN";

  useEffect(() => {
    axios
      .get(`http://192.168.17.113:9090/postdisbchanges/api?UserId=${ADMIN}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const fetchData = () => {
    if (branch) {
      axios
        .get(`http://localhost:8080/getbybranch/${branch}`)
        .then((res) => {
          setRows(res.data);
          if (res?.data?.length === 0) {
            console.log(res?.data?.length);

            Swal.fire(
              "Branch?",
              "No Datas in that particular Branch.?",
              "question"
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      Swal.fire({
        title: "Please Slect the Branch.",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  };

  console.log(rows);

  const handleSave = () => {
    if (edit) {
      const updatedData = rows.map((row) => {
        if (row.status === false && !row.comments) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Comments must have a value when status is false.",
          });
          return row;
        }

        return {
          id: row.id,
          status: row.status,
          tenor_Min: row.tenor_Min,
          tenor_Max: row.tenor_Max,
          loan_amount_Max: row.loan_amount_Max,
          fees_Amount: row.fees_Amount,
          fees_Percentage: row.fees_Percentage,
          obligation: row.obligation,
          net_Income: row.net_Income,
          net_ROI: row.net_ROI,
          branch: row.branch,
          base_HL_File_Number: row.base_HL_File_Number,
          comments: row.comments,
        };
      });

      if (updatedData.some((row) => row.status === false && !row.comments)) {
        return;
      }

      axios
        .put("http://localhost:8080/updateAll", updatedData)
        .then((res) => {
          console.log(res.data);
          setedit(false);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data saved successfully!",
          });
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while saving data.",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Data Already saved.",
      });
    }
  };

  const handleCommentsChange = (rowId, newComments) => {
    setedit(true);
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, comments: newComments } : row
    );
    setRows(updatedRows);
  };

  const columns = [
    {
      field: "base_HL_File_Number",
      headerName: "Base File Number",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1.1,
      // type: "number",
    },
    {
      field: "loan_amount_Max",
      headerName: " Loan Amount Max  ",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1.1,
      // editable: true,
      type: "number",
      valueFormatter: (params) => {
        if (params.value !== null) {
          return parseInt(params.value).toLocaleString();
        } else {
          return null;
        }
      },
    },
    {
      field: "tenor_Min",
      headerName: " Tenor Min",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1,
      // editable: true,
      type: "number",
      valueFormatter: (params) => {
        if (params.value !== null) {
          return parseInt(params.value).toLocaleString();
        } else {
          return null;
        }
      },
    },
    {
      field: "tenor_Max",
      headerName: "Tenor Max",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1,
      // editable: true,
      type: "number",
      valueFormatter: (params) => {
        if (params.value !== null) {
          return parseInt(params.value).toLocaleString();
        } else {
          return null;
        }
      },
    },
    {
      field: "net_ROI",
      headerName: "Net ROI",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1,
      // editable: true,
      type: "number",
      valueFormatter: (params) => {
        if (params.value !== null) {
          return parseInt(params.value).toLocaleString();
        } else {
          return null;
        }
      },
    },
    {
      field: "net_Income",
      headerName: "Net Income",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1,
      // editable: true,
      type: "number",
      valueFormatter: (params) => {
        if (params.value !== null) {
          return parseInt(params.value).toLocaleString();
        } else {
          return null;
        }
      },
    },
    {
      field: "obligation",
      headerName: "Obligation",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1,
      // editable: true,
      // type: "number",
    },
    {
      field: "fees_Percentage",
      headerName: " Fees Percentage",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1,
      // editable: true,
      type: "number",
      valueFormatter: (params) => {
        if (params.value !== null) {
          return parseInt(params.value).toLocaleString();
        } else {
          return null;
        }
      },
    },
    {
      field: "fees_Amount",
      headerName: "Fees Amount",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 1,
      // editable: true,
      type: "number",
      valueFormatter: (params) => {
        if (params.value !== null) {
          return parseInt(params.value).toLocaleString();
        } else {
          return null;
        }
      },
    },

    {
      field: "status",
      headerName: "Actions",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 0.8,
      renderCell: (params) => {
        const itsTrue = params.value === true;
        return (
          <Switch
            color={itsTrue ? "error" : "success"}
            checked={!itsTrue}
            onChange={() => {
              const newIsTrue = !itsTrue;
              handleToggle(params.row.id, newIsTrue);
            }}
          />
        );
      },
    },

    {
      field: "comments",
      headerName: "Comments",
      headerClassName: "header-className",
      headerCellClassName: "header-cell-className",
      flex: 2,
      renderCell: (params) => {
        if (params.row.status === false) {
          return (
            <Button
              style={{
                fontSize: "0.7rem",
                height: "100%",
                width: "100%",
              }}
              onClick={() =>
                handleCommentsEdit(params.row.id, params.row.comments)
              }
            >
              {params.row.comments}
            </Button>
          );
        }
      },
    },
  ];

  const handleCommentsEdit = async (rowId, comments) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputValue: comments ? comments : " ",
      inputPlaceholder: comments ? comments : "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });

    if (text !== undefined) {
      handleCommentsChange(rowId, text);
      Swal.fire(text);
    } else {
      handleCommentsChange(rowId, "");
    }
  };

  const handleToggle = (rowId, newValue) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, status: newValue } : row
    );
    setRows(updatedRows);
  };
  return (
    <Box>
      <h1 style={{ marginTop: "0%" }} className="custom-heading">
        BRANCH MANAGER APPROVAL
      </h1>

      <Grid container mt={5} rowSpacing={2}>
        <Grid
          item
          xs={12}
          sm={3}
          md={3}
          lg={3}
          sx={{ textAlign: "left", marginLeft: "3%" }}
        >
          <Typography style={{ color: "#004A92" }}>Branch :</Typography>
          <Autocomplete
            disablePortal
            freeSolo
            id="branchname"
            options={data}
            getOptionLabel={(option) => option.BranchName}
            fullWidth
            onChange={(e, newvalue) => {
              setBranch(newvalue?.BranchCode);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <Button
            style={{ marginTop: "5%", fontSize: "b" }}
            variant="contained"
            onClick={fetchData}
          >
            Go
            <SendIcon />
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ height: 350, width: "100%", marginTop: "5%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#004a92",
          }}
        >
          <div></div>
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Tooltip title="Save" arrow>
              <span>
                <Button
                  style={{ color: "white" }}
                  onClick={handleSave}
                  disabled={!branch || rows.length === 0}
                >
                  <SaveIcon />
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Notifications" arrow>
              <Button style={{ color: "white" }}>
                <NotificationsActiveIcon />
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          editMode="cell"
          autoPageSize={true}
          showCellVerticalBorder={true}
        />
      </Box>
    </Box>
  );
}

export default Billpayment;
