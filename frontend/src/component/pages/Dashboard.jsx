import React, { useEffect, useState } from "react";
import MainPage from "../layouts/MainPage";
import TableComponent from "../table/Table";
import { Typography } from "@mui/material";
import ModelPoper from "../Model";
import { Input } from "@nextui-org/input";
import { Formik, Field, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Card, Select, SelectItem } from "@nextui-org/react";
import { Button } from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";
import api from "../../config/AxiosCofig";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState([]);
  // const { resetForm } = useFormikContext();

  const [modelPopup, setModelPopup] = useState(false);

  const getAllUsers = async () => {
    const allusers = await api.get("/users", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    if (allusers.status === 200) {
      setUserData(allusers.data);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string().required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  };

  const handleModelPopup = () => {
    console.log("handleModelPopup", modelPopup);
    setModelPopup(!modelPopup);
  };

  const handleSubmit = async (values) => {
    const response = await api.post(
      "/register",
      values,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    console.log(response, "success");
    // resetForm()
    toast.success("User added successfully");
    getAllUsers();
    setModelPopup(!modelPopup);
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
                    <div className="text-red-500 text-sm">
                      {errors.firstName}
                    </div>
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
                  className="mr-3 Btn-primary"
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
      <Card className="p-3 mt-4">
        <div className="flex flex-col flex-1">
          <div className="flex space-between ">
            {/* <Typography variant="h5" className="mb-4">
              Users
            </Typography> */}
            <Button
              className="h-5 mb-4"
              onClick={() => handleModelPopup()}
              variant="outlined"
            >
              Add User
            </Button>
          </div>
          <TableComponent Userdata={userData} />
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
