import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import TableComponent from "../table/Table";
import { TextField, Typography, Button } from "@mui/material";
import ModelPoper from "../Model";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../../config/AxiosCofig";
import { IoAddCircleOutline, IoSearch } from "react-icons/io5";
import { Input } from "@nextui-org/react";
import InputAdornment from "@mui/material/InputAdornment";
import { Card, Select, SelectItem } from "@nextui-org/react";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [modelPopup, setModelPopup] = useState(false);

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
    role: Yup.string().required("Role is required"),
    mobile: Yup.string().required("Mobile number is required"),
    password: Yup.string().required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    mobile: "",
  };

  // Handle modal popup toggle
  const handleModelPopup = () => {
    setModelPopup(!modelPopup);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await api.post("/register", values, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success("User added successfully");
        getAllUsers();
        setModelPopup(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  return (
    <AdminLayout pageTitle="All users" pageSubtitle="Manage user details">
      <ModelPoper open={modelPopup} handleClose={handleModelPopup}>
        <Typography variant="h6" className="mb-2">
          Add user
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <Field
                    name="firstName"
                    as={Input}
                    label="First Name"
                    placeholder="Enter First Name"
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="text-red-500 text-sm">{errors.firstName}</div>
                  )}
                </div>
                <div className="flex-1">
                  <Field
                    name="lastName"
                    as={Input}
                    label="Last Name"
                    placeholder="Enter Last Name"
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="text-red-500 text-sm">{errors.lastName}</div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <Field
                  name="email"
                  type="email"
                  as={Input}
                  label="Email"
                  placeholder="Enter Your Email"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}
              </div>
              <div className="mb-3">
                <Field
                  name="mobile"
                  as={Input}
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                />
                {touched.mobile && errors.mobile && (
                  <div className="text-red-500 text-sm">{errors.mobile}</div>
                )}
              </div>
              <div className="mb-3">
                <Field
                  name="role"
                  as={Select}
                  label="Role"
                  placeholder="Select Role"
                >
                  <SelectItem key="2">Employee</SelectItem>
                </Field>
                {touched.role && errors.role && (
                  <div className="text-red-500 text-sm">{errors.role}</div>
                )}
              </div>
              <div className="mb-3">
                <Field
                  name="password"
                  type="password"
                  as={Input}
                  label="Password"
                  placeholder="Enter Password"
                />
                {touched.password && errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
              </div>
              <div className="mt-4 flex gap-4">
                <Button
                  type="submit"
                  className="mr-3 submit-btn"
                  variant="contained"
                >
                  Add User
                </Button>
                <Button variant="flat" onClick={handleModelPopup}>
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
                    <IoSearch />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              className="h-5 mb-4 addUserButton"
              onClick={() => handleModelPopup()}
              variant="outlined"
              startIcon={<IoAddCircleOutline />}
            >
              Add New Employee
            </Button>
          </div>
          {console.log(filteredUsers)}
          <TableComponent Userdata={filteredUsers} />
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
