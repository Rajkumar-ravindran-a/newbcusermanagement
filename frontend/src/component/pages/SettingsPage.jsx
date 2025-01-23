import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import CustomTable from "../table/CustomTable.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { Card, Button, Input } from "@nextui-org/react";
import api from "../../config/AxiosCofig.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Validation Schema
const brokerValidationSchema = Yup.object().shape({
  brokerName: Yup.string().required("Broker Name is required"),
  grossFund: Yup.number()
    .typeError("Gross Fund must be a number")
    .required("Gross Fund is required"),
  arbitrageFund: Yup.number()
    .typeError("arbitrageFund must be a number")
    .required("arbitrageFund is required"),
});

// Column Titles
const brokerTableTitle = [
  "Broker Name",
  "Start Date",
  "Release Date",
  "Gross Fund",
  "Arbitrage Fund",
  "Total Fund",
  "Prop Fund",
  "Action",
];

const AdminSettings = () => {
  const [brokerData, setBrokerData] = useState([]);

  // Fetch Brokers Data
  const getBrokerData = async () => {
    try {
      const response = await api.get("/getAllBroker");
      if (response.status === 200) {
        console.log(response.data.data);
        const formattedData = response?.data?.data.map((broker) => ({
          "Broker Name": broker.brokerName,
          "Start Date": broker.startDate || "N/A",
          "Release Date": broker.releaseDate || "N/A",
          "Gross Fund": broker.grossfund || "-",
          "Arbitrage Fund": broker.arbitragefund || "-",
          "Prop Fund": broker.propfund || "-",
          "Total Fund": broker.grossfund + broker.arbitragefund || "-",
          Action: (
            <div key={`action-${broker.id}`} className="action-buttons">
              <Button
                key={`release-${broker.id}`}
                onPress={() => releaseBroker(broker)}
                size="small"
                className="submit-btn"
                isDisabled={broker.status === 3}
              >
                {broker.status === 3 ? "Released" : "Release"}
              </Button>
            </div>
          ),
        }));
        setBrokerData(formattedData);
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
    const fetchData = async () => {
      await getBrokerData();
    };
    fetchData();
  }, []);

  // Form Initial Values
  const initialValues = {
    brokerName: "",
    grossFund: "",
    arbitrageFund: "",
    propFund: "",
  };

  // Form Submission Handler
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await api.post("/createBroker", values);
      if (response.status === 200) {
        toast.success("Broker added successfully.");
        getBrokerData();
        resetForm();
      }
    } catch (error) {
      toast.error("Error adding broker.");
    }
  };

  return (
    <AdminLayout
      pageTitle="Brokers"
      pageSubtitle="Add, view and release brokers"
    >
      <Card className="settings-mainCard">
        <Card>
          {/* <Typography variant="h6" className="broker-title">
            Brokers
          </Typography> */}
          <Formik
            initialValues={initialValues}
            validationSchema={brokerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <Form className="broker-form flex gap-3">
                <div className="flex-1">
                  <Input
                    name="brokerName"
                    label="Broker Name"
                    value={values.brokerName || ""}
                    onChange={(e) => {
                      const upperCaseValue = e.target.value.toUpperCase();
                      setFieldValue("brokerName", upperCaseValue);
                    }}
                    onBlur={handleBlur}
                    status={
                      touched.brokerName && errors.brokerName
                        ? "error"
                        : undefined
                    }
                    helperText={touched.brokerName && errors.brokerName}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="grossFund"
                    label="Gross Fund"
                    value={values.grossFund || ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, ""); 
                      setFieldValue("grossFund", numericValue);  
                    }}
                    onBlur={handleBlur}
                    status={
                      touched.grossFund && errors.grossFund
                        ? "error"
                        : undefined
                    }
                    helperText={touched.grossFund && errors.grossFund}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="arbitrageFund"
                    label="Arbitrage Fund"
                    value={values.arbitrageFund || ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, ""); 
                      setFieldValue("arbitrageFund", numericValue);  
                    }}
                    onBlur={handleBlur}
                    status={
                      touched.arbitrageFund && errors.arbitrageFund
                        ? "error"
                        : undefined
                    }
                    helperText={touched.arbitrageFund && errors.arbitrageFund}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="propFund"
                    label="Prop Fund"
                    value={values.propFund || ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, ""); 
                      setFieldValue("propFund", numericValue);  
                    }}
                    onBlur={handleBlur}
                    status={
                      touched.propFund && errors.propFund ? "error" : undefined
                    }
                    helperText={touched.propFund && errors.propFund}
                  />
                </div>
                <Button type="submit" className="submit-btn">
                  Add Broker
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-4">
            <CustomTable title={brokerTableTitle} tableData={brokerData} />
          </div>
        </Card>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
