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
import { IoAddCircleOutline, IoSearch } from "react-icons/io5";
import InputAdornment from "@mui/material/InputAdornment";
// Validation Schema
const brokerValidationSchema = Yup.object().shape({
  brokerName: Yup.string().required("Broker Name is required"),
  id: Yup.string()
    .required("ID is required"),
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
  "Funds Fund",
  "Employee",
  "Nism",
  "IdType",
  "Action",
];

const AdminSettings = () => {
  const [brokerData, setBrokerData] = useState([]);
  const [open, setOpen] = useState(false); // Modal open state

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch Brokers Data
  const getBrokerData = async () => {
    try {
      const response = await api.get("/getAllBroker");
      if (response.status === 200) {
        const formattedData = response?.data?.data.map((broker) => ({
          "Broker Name": broker.brokerName,
          "Start Date": broker.startDate || "N/A",
          "Release Date": broker.releaseDate || "N/A",
          "Gross Fund": broker.grossFund || "-",
          "Arbitrage Fund": broker.arbitrage || "-",
          "Additional Field 1": broker.additionalField1 || "N/A",
          "Additional Field 2": broker.additionalField2 || "N/A",
          "Total Fund": broker.grossFund + broker.arbitrage || "-",
          Action: (
            <div key={`action-${broker.id}`} className="action-buttons">
              <Button
                key={`release-${broker.id}`}
                onPress={() => releaseBroker(broker)}
                disabled={broker.status === 3}
              >
                {broker.status === 3 ? "Released" : "Release"}
              </Button>
            </div>
          ),
        }));
        setBrokerData([]);
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
      const response = await api.post("/createBroker", values);
      if (response.status === 200) {
        toast.success("Broker added successfully.");
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
      <Card classNames="settings-mainCard" style={{marginTop:'1rem'}}>
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
                    <TextField
                      fullWidth
                      margin="normal"
                      name="brokerName"
                      label="Broker Name"
                      value={values.brokerName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.brokerName && Boolean(errors.brokerName)}
                      helperText={touched.brokerName && errors.brokerName}
                    />
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
                    <TextField
                      fullWidth
                      margin="normal"
                      name="employee"
                      label="Employee"
                      value={values.arbitrage || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.employee && Boolean(errors.employee)}
                      helperText={touched.employee && errors.employee}
                    />
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
                      error={
                        touched.nism &&
                        Boolean(errors.nism)
                      }
                      helperText={
                        touched.nism && errors.nism
                      }
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      name="idType"
                      label="ID Type"
                      value={values.idType || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.idType &&
                        Boolean(errors.idType)
                      }
                      helperText={
                        touched.idType && errors.idType
                      }
                    />
                  </div>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 2,
                      gap:2
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
          <CustomTable title={brokerTableTitle} tableData={brokerData} />
        </Box>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
