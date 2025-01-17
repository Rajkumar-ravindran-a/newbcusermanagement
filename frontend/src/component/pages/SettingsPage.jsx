import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import CustomTable from "../table/CustomTable.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { Card, Button, Input } from "@nextui-org/react";
import api from "../../config/AxiosCofig.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const brokerValidationSchema = Yup.object().shape({
  brokerId: Yup.string().required("ID is required"),
  brokerName: Yup.string().required("Broker Name is required"),
  fundAllocated: Yup.number()
    .typeError("Funds Allocated must be a number")
    .required("Funds Allocated is required"),
});

const brokerTableTitle = [
  "ID",
  "Broker Name",
  "Funds Allocated",
  "Start Date",
  "Release Date",
  "Action",
];


const AdminSettings = () => {
  const [bokerData, setBrokerData] = useState([]);

  const releaseBroker = async (brokerData) => {
    try {
      console.log(bokerData)
      const releaseData = await api.put(`/releaseBroker/${brokerData}/${3}`);
      console.log(releaseData)
      if (releaseData.status === 200) {
        getBrokerData();
        toast.info(`Releasing broker: ${brokerData}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
    console.warn("Releasing Broker:", brokerData);
    // You can perform additional actions here, such as making an API call
  };

  const unreleaseBroker = async (brokerData) => {
    try {
      const releaseData = api.put(`/releaseBroker/${brokerData.id}/1`);
      console.log(releaseData)
      if (releaseData.status === 200) {
        toast.info(`Releasing broker: ${brokerData.brokerName}`);
        getBrokerData();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
    console.warn("Releasing Broker:", brokerData);
    // You can perform additional actions here, such as making an API call
  };

  const getBrokerData = async () => {
    try {
      const brokerData = await api.get("/getAllBroker");
      const formattedData = brokerData.data.data.map((rest) => ({
        ...rest,
        action: () => releaseBroker(rest), // Pass the entire row data
      }));
      setBrokerData(formattedData);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getBrokerData();
  }, []);

  const initialValues = {
    brokerId: "",
    brokerName: "",
    fundAllocated: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await api.post("/createBroker", values);
      if (res.status === 200) {
        toast.success(res.data.message);
        getBrokerData();
      }
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Error adding broker");
    }
  };

  return (
    <AdminLayout pageTitle="Settings" pageSubtitle="Configurable parameters">
      <Card className="settings-mainCard">
        <Card>
          <Typography variant="h6" className="broker-title">
            Brokers
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={brokerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="broker-form flex gap-3">
                <div className="flex-1">
                  <Input
                    name="brokerId"
                    label="ID"
                    value={values.brokerId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.brokerId && errors.brokerId}
                    helperText={touched.brokerId && errors.brokerId}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="brokerName"
                    label="Broker Name"
                    value={values.brokerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.brokerName && errors.brokerName}
                    helperText={touched.brokerName && errors.brokerName}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="fundAllocated"
                    label="Funds Allocated"
                    value={values.fundAllocated}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fundAllocated && errors.fundAllocated}
                    helperText={touched.fundAllocated && errors.fundAllocated}
                  />
                </div>
                <Button type="submit" className="submit-btn">
                  Add Broker
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-4">
            <CustomTable
              title={brokerTableTitle}
              tableData={bokerData}
              renderAction={releaseBroker}
            />
          </div>
        </Card>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
