import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Typography, Box, Modal, TextField } from "@mui/material";
import CustomTable from "../table/CustomTable.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import api from "../../config/AxiosCofig.js";
import { toast } from "react-toastify";
import { Card } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { data } from "react-router-dom";

// Validation Schema
const brokerValidationSchema = Yup.object().shape({
  brokerName: Yup.string().required("Broker Name is required"),
  id: Yup.string().required("ID is required"),
  startDate: Yup.date().required("Start Date is required"),
  employee: Yup.string().required("employee is required"),
  nism: Yup.string().required("nism is required"),
  idType: Yup.string().required("idType is required"),
});

// Column Titles
const brokerTableTitle = [
  "Id",
  "Broker Name",
  "Start Date",
  "Releases Date",
  // "Funds Fund",
  "Employee",
  "Nism",
  "IdType",
  "Action",
];

const AdminSettings = () => {
  const [brokerData, setBrokerData] = useState([]);
  const [open, setOpen] = useState(false); // Modal open state
  const [getUserList, setGetuserList] = useState([]);
  const [idData, setIdData] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch User Data
  const getuserData = async () => {
    try {
      const response = await api.get("/users");
      if (response.status === 200) {
        setGetuserList(response.data);
      } else {
        console.log("error in getUserData");
        setGetuserList([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user data.");
    }
  };

  const getIdData = async () => {
    try {
      const response = await api.get("/getIds");
      if (response.status === 200) {
        console.log(response.data);
        const structureData = response.data.data.map((data) => ({
          Id: data.idNumber,
          "Broker Name": data.brokerName,
          "Start Date": data.startDate,
          "Releases Date": data.releasesDate ? data.releasesDate : "-",
          Employee: data?.employee ? data.employee : "-",
          Nism: data.nism,
          IdType: data.idType,
          Action: (
            <div className="action-buttons">
              <Button
                // key={`release-${broker.id}`}
                // onPress={() => releaseBroker(broker)}
                size="small"
                className="submit-btn"
                // isDisabled={broker.status === 3}
              >
                {/* {broker.status === 3 ? "Released" : "Release"} */}
                Release
              </Button>
            </div>
          ),
        }));
        setIdData(structureData);
      } else {
        console.log("error in getIdData");
        setIdData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching id data.");
    }
  };

  // Fetch Brokers Data
  const getBrokerData = async () => {
    try {
      const response = await api.get("/getAllBroker");
      if (response.status === 200) {
        setBrokerData(response?.data?.data.filter((data) => data.status === 1));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching broker data.");
    }
  };

  // Release Broker Function
  const releaseBroker = async (broker) => {
    try {
      const response = await api.put(`/releaseBroker/${broker.id}/3`);
      if (response.status === 200) {
        toast.success(`Released broker: ${broker.brokerName}`);
        getBrokerData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error releasing broker.");
    }
  };

  useEffect(() => {
    getBrokerData();
    getuserData();
    getIdData();
  }, []);

  // Form Initial Values
  const initialValues = {
    brokerName: "",
    id: "",
    startDate: "",
    employee: "",
    nism: "",
    idType: "",
  };

  // Form Submission Handler
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await api.post("/createId", values);
      if (response.status === 200) {
        toast.success("Id added successfully.");
        getBrokerData();
        resetForm();
        handleClose(); // Close modal after successful submission
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding broker.");
    }
  };

  return (
    <AdminLayout
      pageTitle="Id Management"
      pageSubtitle="Manage Id details, map brokers"
    >
      <Card classNames="settings-mainCard" style={{ marginTop: "1rem" }}>
        <div className="flex justify-between p-4 align-middle broker-form">
          <TextField
            className="searchUser"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearch />
                </InputAdornment>
              ),
            }}
          />
          <Button onPress={handleOpen} className="submit-btn p-4">
            Add Id
          </Button>
        </div>

        {/* Modal for Form */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Add Id
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={brokerValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  <div className="flex gap-2">
                    <TextField
                      fullWidth
                      margin="normal"
                      name="id"
                      label="ID"
                      value={values.id || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.id && Boolean(errors.id)}
                      helperText={touched.id && errors.id}
                    />
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={touched.brokerName && Boolean(errors.brokerName)}
                    >
                      <InputLabel id="brokerName-label">Broker Name</InputLabel>
                      <Select
                        labelId="brokerName-label"
                        id="brokerName"
                        name="brokerName"
                        label="Broker Name"
                        value={values.brokerName || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {brokerData &&
                          brokerData.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.brokerName}
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.brokerName && Boolean(errors.brokerName) && (
                        <FormHelperText>{errors.brokerName}</FormHelperText>
                      )}
                    </FormControl>
                  </div>
                  <div className="flex gap-2">
                    <TextField
                      fullWidth
                      margin="normal"
                      name="startDate"
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={values.startDate || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.startDate && Boolean(errors.startDate)}
                      helperText={touched.startDate && errors.startDate}
                    />
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={touched.employee && Boolean(errors.employee)}
                    >
                      <InputLabel id="employee-label">Employee</InputLabel>
                      <Select
                        labelId="employee-label"
                        id="employee"
                        name="employee"
                        label="Employee"
                        value={values.employee || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {console.log(getUserList)}
                        {getUserList &&
                          getUserList.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.firstName + " " + data.lastName}
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.employee && errors.employee && (
                        <FormHelperText>{errors.employee}</FormHelperText>
                      )}
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      margin="normal"
                      name="nism"
                      label="NISM"
                      value={values.nism || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nism && Boolean(errors.nism)}
                      helperText={touched.nism && errors.nism}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      name="idType"
                      label="ID Type"
                      value={values.idType || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.idType && Boolean(errors.idType)}
                      helperText={touched.idType && errors.idType}
                    />
                  </div>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 2,
                      gap: 2,
                    }}
                  >
                    <Button type="button" onPress={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Broker</Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

        {/* Broker Table */}
        <Box sx={{ marginTop: 4 }}>
          <CustomTable title={brokerTableTitle} tableData={idData} />
        </Box>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
