import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Typography,
  Box,
  Modal,
  TextField,
  IconButton,
  Button,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import CustomTable from "../table/CustomTable.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import api from "../../config/AxiosCofig.js";
import { toast } from "react-toastify";
import { Card } from "@nextui-org/react";
import { IoSearch, IoAddCircleOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const brokerValidationSchema = Yup.object().shape({
  brokerName: Yup.string().required("Broker Name is required"),
  id: Yup.string().required("ID is required"),
  startDate: Yup.date().required("Start Date is required"),
  employee: Yup.string().required("Dealer is required"),
  nism: Yup.string().required("NISM is required"),
  idType: Yup.string().required("ID Type is required"),
});

const brokerTableTitle = [
  "Id",
  "Broker Name",
  // "Start Date",
  // "Releases Date",
  "Employee",
  "Nism",
  "IdType",
  "Action",
];

const AdminSettings = () => {
  const [brokerData, setBrokerData] = useState([]);
  const [selectedBrokerFilter, setSelectedBrokerFilter] = useState("");
  const [idData, setIdData] = useState([]);
  const [filteredIdData, setFilteredIdData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [getUserList, setGetUserList] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [loader, setLoader] = useState(false);
  const [idType] = useState([
    "Manual-ODIN",
    "Manual-GREEK",
    "Manual-XTS",
    "Convex",
    "XTS-API",
  ]);

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

  const getIdData = async () => {
    try {
      setLoader(true);
      const response = await api.get("/getIds");
      if (response.status === 200) {
        const structureData = response.data.data.map((data) => ({
          Id: data.idNumber,
          "Broker Name": data.brokerName,
          // "Start Date": data.startDate,
          // "Releases Date": data.releaseDate || "-",
          "Record Id": data.recordId,
          Employee: data?.employeeId || "-",
          Nism: data.nism,
          IdType: data.idType,
          Action: (
            <Dropdown>
              <DropdownTrigger>
                <IconButton>
                  <CiMenuKebab />
                </IconButton>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action event example"
                onAction={(key) => {
                  if (key === "release") {
                    releaseId(data);
                  } else if (key === "edit") {
                    editBroker(data);
                  }
                }}
              >
                <DropdownItem key="release" isDisabled={data.status === 3}>
                  Release
                </DropdownItem>
                <DropdownItem key="edit" isDisabled={data.status === 3}>
                  Edit
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }));
        setIdData(structureData);
        setFilteredIdData(structureData);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
      // toast.error("Error fetching ID data.");
    }
  };

  const handleFilterChange = (event) => {
    const selectedBroker = event.target.value;
    setSelectedBrokerFilter(selectedBroker);

    if (selectedBroker) {
      const filteredData = idData.filter(
        (data) => data["Broker Name"] === selectedBroker
      );
      setFilteredIdData(filteredData);
    } else {
      setFilteredIdData(idData);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedBroker(null);
  };

  const getuserData = async () => {
    try {
      const response = await api.get("/users");
      if (response.status === 200) {
        setGetUserList(response.data);
      }
    } catch (error) {
      console.error(error);
      // toast.error("Error fetching user data.");
    }
  };

  const editBroker = (broker) => {
    setSelectedBroker(broker);
    setEditMode(true);
    handleOpen();
  };

  const releaseId = async (broker) => {
    try {
      await api.put(`/releaseId/${broker.recordId}/3`);
      toast.success(`Released Id: ${broker.recordId}`);
      getIdData();
    } catch (error) {
      toast.error("Error releasing broker.");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editMode) {
        await api.put(`/updateId/${selectedBroker.recordId}`, values);
        toast.success("ID updated successfully.");
      } else {
        await api.post("/createId", values);
        toast.success("ID added successfully.");
      }
      getIdData();
      resetForm();
      handleClose();
    } catch (error) {
      console.error(error?.response?.data?.detail);
      toast.error(error?.response?.data?.detail);
    }
  };

  useEffect(() => {
    getuserData();
    getIdData();
    getBrokerData();
  }, []);

  const initialValues = {
    brokerName: selectedBroker?.brokerId || "",
    id: selectedBroker?.idNumber || "",
    startDate: selectedBroker?.startDate || "",
    employee: selectedBroker?.employeeId || "",
    nism: selectedBroker?.nism || "",
    idType: selectedBroker?.idType || "",
  };

  return (
    <AdminLayout pageTitle="ID Management" pageSubtitle="Manage ID details">
      <Card style={{ marginTop: "1rem" }}>
        <div className="flex justify-between p-4 align-middle">
          <div className="flex gap-3">
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
            <FormControl style={{ minWidth: 200, marginRight: "1rem" }}>
              {/* <InputLabel id="brokerFilter-label">Filter by Broker</InputLabel> */}
              <Select
                // labelId="brokerFilter-label"
                value={selectedBrokerFilter}
                onChange={handleFilterChange}
                // label="Filter by Broker"
                displayEmpty
              >
                <MenuItem value="">All Brokers</MenuItem>
                {brokerData.map((broker, index) => (
                  <MenuItem key={index} value={broker.brokerName}>
                    {broker.brokerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Button
            onClick={handleOpen}
            variant="contained"
            color="primary"
            startIcon={<IoAddCircleOutline />}
          >
            Add ID
          </Button>
        </div>

        <Box mt={4}>
          <CustomTable
            title={brokerTableTitle}
            tableData={filteredIdData}
            loading={loader}
          />
        </Box>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box
          className="modal-box"
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
            overflowY: "scroll",
          }}
        >
          <Typography variant="h6">
            {editMode ? "Edit ID" : "Add New ID"}
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={brokerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, errors, touched, handleBlur }) => (
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
                    inputProps={{ style: { textTransform: "uppercase" } }}
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
                      {brokerData.map((data, index) => (
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
                    <InputLabel id="employee-label">Dealer</InputLabel>
                    <Select
                      labelId="employee-label"
                      id="employee"
                      name="employee"
                      label="Dealer"
                      value={values.employee || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {getUserList.map((data, index) => (
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
                <div className="flex gap-2">
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
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={touched.idType && Boolean(errors.idType)}
                  >
                    <InputLabel id="IDType">ID Type</InputLabel>
                    <Select
                      labelId="IDType"
                      id="IDType"
                      name="idType"
                      label="ID Type"
                      value={values.idType || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {idType !== undefined &&
                        idType?.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                    </Select>
                    {touched.idType && Boolean(errors.idType) && (
                      <FormHelperText>{errors.idType}</FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    {editMode ? "Update" : "Add"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </AdminLayout>
  );
};

export default AdminSettings;
