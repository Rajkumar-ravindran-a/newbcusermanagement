import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import TableComponent from "../table/Table";
import {
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  Card,
} from "@mui/material";
import ModelPoper from "../Model";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../../config/AxiosCofig";
import { IoAddCircleOutline, IoSearch } from "react-icons/io5";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [modelPopup, setModelPopup] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); // Flag to check if we're in update mode
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    phonenumber: "",
  });

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const allusers = await api.get("/users", {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (allusers.status === 200) {
        setUserData(allusers.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = userData.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query)
    );
  });

  // Validation schema for form
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    role: Yup.number().required("Role is required"),
    phonenumber: Yup.string().required("Mobile number is required"),
    password: isUpdate
      ? Yup.string().notRequired()
      : Yup.string().required("Password is required"),
  });

  // Handle modal popup toggle
  const handleModelPopup = (user = null) => {
    if (user) {
      setInitialValues({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phonenumber: user.phoneNumber,
        role: user.role === "Dealer" ? 2 : 3,
        password: "", // Password is optional during update
      });
      setIsUpdate(true); // Indicate update mode
    } else {
      setInitialValues({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: "",
        phonenumber: "",
      });
      setIsUpdate(false); // Indicate create mode
    }
    setModelPopup(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      console.log(`/updateUser/${values.id}`,"======")
      if (isUpdate) {
        // Update user
        const response = await api.put(`/updateUser/${values.id}`, values, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        if (response.status === 200) {
          toast.success("User updated successfully");
          getAllUsers();
          setModelPopup(false);
        }
      } else {
        // Create new user
        const response = await api.post("/register", values, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        if (response.status === 200) {
          toast.success("User added successfully");
          getAllUsers();
          setModelPopup(false);
        }
      }
    } catch (error) {
      console.error("Error submitting user:", error?.response?.data?.detail);
      toast.error(error?.response?.data?.detail);
    }
  };

  const handleDelete = async (user) => {
      try{
        const response = await api.delete(`/deleteUser/${user}`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        if(response.status === 200){
          toast.success("User deleted successfully");
          getAllUsers();
        }
      }
      catch(error){
        console.error("Error deleting user:", error);
        toast.error("Error deleting user.");
      }
  }

  return (
    <AdminLayout pageTitle="All users" pageSubtitle="Manage user details">
      <ModelPoper open={modelPopup} handleClose={() => setModelPopup(false)}>
        <Typography variant="h6" className="mb-2">
          {isUpdate ? "Update User" : "Add User"}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <Field
                    name="firstName"
                    as={TextField}
                    label="First Name"
                    placeholder="Enter First Name"
                    fullWidth
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="text-red-500 text-sm">
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Field
                    name="lastName"
                    as={TextField}
                    label="Last Name"
                    placeholder="Enter Last Name"
                    fullWidth
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="text-red-500 text-sm">
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <Field
                  name="email"
                  type="email"
                  as={TextField}
                  label="Email"
                  placeholder="Enter Your Email"
                  fullWidth
                  disabled={isUpdate}
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}
              </div>
              <div className="mb-3">
                <Field
                  name="phonenumber"
                  as={TextField}
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  fullWidth
                />
                {touched.phonenumber && errors.phonenumber && (
                  <div className="text-red-500 text-sm">
                    {errors.phonenumber}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Field
                    name="role"
                    as={Select}
                    label="Role"
                    onChange={(event) => setFieldValue("role", event.target.value)} // Correctly handle role update
                  >
                    <MenuItem value="2">Dealer</MenuItem>
                    <MenuItem value="3">Trader</MenuItem>
                    {/* Add more roles if needed */}
                  </Field>
                </FormControl>
                {touched.role && errors.role && (
                  <div className="text-red-500 text-sm">{errors.role}</div>
                )}
              </div>
              {!isUpdate && (
                <div className="mb-3">
                  <Field
                    name="password"
                    type="password"
                    as={TextField}
                    label="Password"
                    placeholder="Enter Password"
                    fullWidth
                  />
                  {touched.password && errors.password && (
                    <div className="text-red-500 text-sm">
                      {errors.password}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 flex gap-4">
                <Button
                  type="submit"
                  className="mr-3 submit-btn"
                  variant="contained"
                >
                  {isUpdate ? "Update User" : "Add User"}
                </Button>
                <Button variant="outlined" onClick={() => setModelPopup(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModelPoper>
      <Card className="p-3 mt-4 userMainCard">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between">
            <TextField
              className="searchUser"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <IoSearch />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <Button
              className="h-5 mb-4 addUserButton"
              onClick={() => handleModelPopup()}
              variant="outlined"
              startIcon={<IoAddCircleOutline />}
            >
              Add New Users
            </Button>
          </div>
          <TableComponent
            Userdata={filteredUsers}
            onUpdateClick={(user) => handleModelPopup(user)} 
            onDeleteClick={(user) => handleDelete(user)}
          />
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
