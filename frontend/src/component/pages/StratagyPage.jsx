import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Card } from "@nextui-org/react";
import CustomTable from "../table/CustomTable";
import { IoSearch, IoAddCircleOutline } from "react-icons/io5";
import {
  Typography,
  Box,
  Modal,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  FormControl,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../../config/AxiosCofig";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";

// Define validation schema
const StrategySchema = Yup.object().shape({
  strategyName: Yup.string().required("Strategy Name is required"),
});

const StratagyPage = () => {
  const [open, setOpen] = useState(false);
  // Used to hold all strategies for the table
  const [strategyData, setStrategyData] = useState([]);
  // Track whether we are editing an existing strategy
  const [editMode, setEditMode] = useState(false);
  // Hold the currently selected strategy (for editing)
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const handleOpen = () => {
    setEditMode(false);
    setSelectedStrategy(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedStrategy(null);
  };

  const title = ["Strategy Id", "Strategy Name", "Action"];

  // Function to fetch strategies from the API
  const getStrategyData = async () => {
    try {
      const response = await api.get("/getStrategies");
      console.log(response);
      if (response.status === 200) {
        const formattedData = response.data.map((data) => ({
          "Strategy Id": data.id,
          "Strategy Name": data.StrategyName,
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
                  if (key === "Delete") {
                    deleteStrategy(data.id);
                  } else if (key === "Edit") {
                    editStrategy(data);
                  }
                }}
              >
                <DropdownItem key="Delete">Delete</DropdownItem>
                <DropdownItem key="Edit">Edit</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }));
        setStrategyData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  };

  useEffect(() => {
    getStrategyData();
  }, []);

  // Function to delete a strategy
  const deleteStrategy = async (id) => {
    try {
      const response = await api.delete(`/strategies/${id}`);
      if (response.status === 204) {
        // After deletion, refresh the strategy list
        getStrategyData();
      }
    } catch (error) {
      console.error("Error deleting strategy:", error);
    }
  };

  // Function to initiate editing a strategy
  const editStrategy = (data) => {
    setEditMode(true);
    setSelectedStrategy(data);
    setOpen(true);
  };

  return (
    <AdminLayout pageTitle="Strategy" pageSubtitle="Manage strategy">
      <Card className="mt-3 p-3">
        <div className="flex mb-2 justify-between">
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
          <Button
            variant="contained"
            startIcon={<IoAddCircleOutline />}
            onClick={handleOpen}
          >
            Add Strategy
          </Button>
        </div>
        <CustomTable title={title} tableData={strategyData} />
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "1rem",
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            {editMode ? "Edit Strategy" : "Add Strategy"}
          </Typography>
          <Formik
            // Set initial values based on edit mode
            
            initialValues={{
              strategyName:
                editMode && selectedStrategy
                  ? selectedStrategy["StrategyName"]
                  : "",
            }}
            enableReinitialize
            validationSchema={StrategySchema}
            onSubmit={async (values, { resetForm }) => {

              try {
                if (editMode && selectedStrategy) {
                  // Update API call for editing
                  const response = await api.put(
                    `/strategies/${selectedStrategy["id"]}`,
                    { StrategyName: values.strategyName }
                  );
                  if (response.status === 200) {
                    toast.success("Strategy updated successfully");
                    getStrategyData();
                  }
                } else {
                  // Create API call for new strategy
                  const response = await api.post("/strategies", {
                    StrategyName: values.strategyName,
                  });
                  if (response.status === 201) {
                    toast.success("Strategy created successfully")
                    getStrategyData();
                  }
                }
              } catch (error) {
                console.error("Error saving strategy:", error);
              }
              resetForm();
              handleClose();
            }}
          >
            {({ errors, touched }) => (
              <Form>
                {console.log(selectedStrategy)}
                <FormControl fullWidth margin="normal">
                  <Field
                    as={TextField}
                    name="strategyName"
                    label="Strategy Name"
                    error={touched.strategyName && Boolean(errors.strategyName)}
                    helperText={touched.strategyName && errors.strategyName}
                  />
                </FormControl>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Box ml={2} />
                  <Button variant="contained" type="submit">
                    {editMode ? "Update" : "Submit"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </AdminLayout>
  );
};

export default StratagyPage;
