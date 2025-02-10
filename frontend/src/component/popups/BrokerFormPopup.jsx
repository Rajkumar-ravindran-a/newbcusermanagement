import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, TextField, Typography, Modal, Box } from "@mui/material";
import api from "../../config/AxiosCofig.js";
import { toast } from "react-toastify";

// Validation Schema
const brokerValidationSchema = Yup.object().shape({
  brokerName: Yup.string().required("Broker Name is required"),
  grossFund: Yup.number()
    .typeError("Gross Fund must be a number")
    .min(0, "Gross Fund must be greater than or equal to 0")
    .required("Gross Fund is required"),
  grossFundInterest: Yup.number()
    .typeError("Gross Fund Interest must be a number")
    .min(0, "Interest must be at least 0%")
    .max(100, "Interest cannot exceed 100%")
    .required("Gross Fund Interest is required"),
  grossFundSharing: Yup.number()
    .typeError("Gross Fund Sharing must be a number")
    .min(0, "Sharing must be at least 0%")
    .max(100, "Sharing cannot exceed 100%")
    .required("Gross Fund Sharing is required"),

  arbitrageFund: Yup.number()
    .typeError("Arbitrage Fund must be a number")
    .min(0, "Arbitrage Fund must be greater than or equal to 0")
    .required("Arbitrage Fund is required"),
  arbitrageFundInterest: Yup.number()
    .typeError("Arbitrage Fund Interest must be a number")
    .min(0, "Interest must be at least 0%")
    .max(100, "Interest cannot exceed 100%")
    .required("Arbitrage Fund Interest is required"),
  arbitrageFundSharing: Yup.number()
    .typeError("Arbitrage Fund Sharing must be a number")
    .min(0, "Sharing must be at least 0%")
    .max(100, "Sharing cannot exceed 100%")
    .required("Arbitrage Fund Sharing is required"),

  propFund: Yup.number()
    .typeError("Prop Fund must be a number")
    .min(0, "Prop Fund must be greater than or equal to 0")
    .required("Prop Fund is required"),
  propFundInterest: Yup.number()
    .typeError("Prop Fund Interest must be a number")
    .min(0, "Interest must be at least 0%")
    .max(100, "Interest cannot exceed 100%")
    .required("Prop Fund Interest is required"),
  propFundSharing: Yup.number()
    .typeError("Prop Fund Sharing must be a number")
    .min(0, "Sharing must be at least 0%")
    .max(100, "Sharing cannot exceed 100%")
    .required("Prop Fund Sharing is required"),

  b2pFund: Yup.number()
    .typeError("Client Fund must be a number")
    .min(0, "Client Fund must be greater than or equal to 0")
    .required("Client Fund is required"),
  b2pFundInterest: Yup.number()
    .typeError("Client Fund Interest must be a number")
    .min(0, "Interest must be at least 0%")
    .max(100, "Interest cannot exceed 100%")
    .required("Client Fund Interest is required"),
  b2pFundSharing: Yup.number()
    .typeError("Client Fund Sharing must be a number")
    .min(0, "Sharing must be at least 0%")
    .max(100, "Sharing cannot exceed 100%")
    .required("Client Fund Sharing is required"),

  clientFund: Yup.number()
    .typeError("Client Fund must be a number")
    .min(0, "Client Fund must be greater than or equal to 0")
    .required("Client Fund is required"),
  clientFundInterest: Yup.number()
    .typeError("Client Fund Interest must be a number")
    .min(0, "Interest must be at least 0%")
    .max(100, "Interest cannot exceed 100%")
    .required("Client Fund Interest is required"),
  clientFundSharing: Yup.number()
    .typeError("Client Fund Sharing must be a number")
    .min(0, "Sharing must be at least 0%")
    .max(100, "Sharing cannot exceed 100%")
    .required("Client Fund Sharing is required"),

  costPerCr: Yup.number()
    .typeError("Cost must be a number")
    .min(0, "Cost must be greater than or equal to 0")
    .required("Cost is required"),
});

// Broker Form Popup Component
const BrokerFormPopup = ({ open, handleClose, onFormSubmit, brokerData }) => {
  const initialValues = {
    id: brokerData?.id || null,
    brokerName: brokerData?.brokerName || "",
    grossFund: brokerData?.grossFund || 0,
    grossFundInterest: brokerData?.grossFundInterest || 0,
    grossFundSharing: brokerData?.grossFundSharing || 0,
    arbitrageFund: brokerData?.arbitrageFund || 0,
    arbitrageFundInterest: brokerData?.arbitrageFundInterest || 0,
    arbitrageFundSharing: brokerData?.arbitrageFundSharing || 0,
    propFund: brokerData?.propFund || 0,
    propFundInterest: brokerData?.propFundInterest || 0,
    propFundSharing: brokerData?.propFundSharing || 0,
    b2pFund: brokerData?.b2pFund || 0,
    b2pFundInterest: brokerData?.b2pFundInterest || 0,
    b2pFundSharing: brokerData?.b2pFundSharing || 0,
    clientFund: brokerData?.b2pFund || 0,
    clientFundInterest: brokerData?.b2pFundInterest || 0,
    clientFundSharing: brokerData?.b2pFundSharing || 0,
    costPerCr: brokerData?.costPerCr || 0,
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (values.id) {
        await api.put(`/updateBroker/${values.id}`, values);
        toast.success("Broker updated successfully.");
      } else {
        await api.post("/createBroker", values);
        toast.success("Broker added successfully.");
      }
      onFormSubmit();
      resetForm();
      handleClose();
    } catch (error) {
      console.error(error?.response?.data);
      toast.error(error?.response?.data?.detail || "An error occurred.");
    }
  };

  return (
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
          overflowY: "auto",
          height:600
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          {initialValues.id ? "Update Broker" : "Add Broker"}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={brokerValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <div className="flex flex-col gap-4">
                {/* Broker Name */}
                <TextField
                  name="brokerName"
                  label="Broker Name"
                  value={values.brokerName} // Force uppercase
                  onChange={(e) => {
                    const uppercaseValue = e.target.value.toUpperCase();
                    setFieldValue("brokerName", uppercaseValue); // Set uppercase value in Formik
                  }}
                  onBlur={handleBlur}
                  error={touched.brokerName && Boolean(errors.brokerName)}
                  helperText={touched.brokerName && errors.brokerName}
                  fullWidth
                  inputProps={{ style: { textTransform: "uppercase" } }} // Ensure UI displays uppercase
                />

                {/* Gross Fund */}
                <div className="flex gap-4">
                  <TextField
                    name="grossFund"
                    label="Gross Fund (1Cr)"
                    value={values.grossFund}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.grossFund && Boolean(errors.grossFund)}
                    helperText={touched.grossFund && errors.grossFund}
                    fullWidth
                  />
                  <TextField
                    name="grossFundInterest"
                    label="Interest (%)"
                    value={values.grossFundInterest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.grossFundInterest &&
                      Boolean(errors.grossFundInterest)
                    }
                    helperText={
                      touched.grossFundInterest && errors.grossFundInterest
                    }
                    fullWidth
                  />
                  <TextField
                    name="grossFundSharing"
                    label="Sharing (%)"
                    value={values.grossFundSharing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.grossFundSharing &&
                      Boolean(errors.grossFundSharing)
                    }
                    helperText={
                      touched.grossFundSharing && errors.grossFundSharing
                    }
                    fullWidth
                  />
                </div>

                {/* Arbitrage Fund */}
                <div className="flex gap-4">
                  <TextField
                    name="arbitrageFund"
                    label="Arbitrage Fund (1Cr)"
                    value={values.arbitrageFund}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.arbitrageFund && Boolean(errors.arbitrageFund)
                    }
                    helperText={touched.arbitrageFund && errors.arbitrageFund}
                    fullWidth
                  />
                  <TextField
                    name="arbitrageFundInterest"
                    label="Interest (%)"
                    value={values.arbitrageFundInterest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.arbitrageFundInterest &&
                      Boolean(errors.arbitrageFundInterest)
                    }
                    helperText={
                      touched.arbitrageFundInterest &&
                      errors.arbitrageFundInterest
                    }
                    fullWidth
                  />
                  <TextField
                    name="arbitrageFundSharing"
                    label="Sharing (%)"
                    value={values.arbitrageFundSharing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.arbitrageFundSharing &&
                      Boolean(errors.arbitrageFundSharing)
                    }
                    helperText={
                      touched.arbitrageFundSharing &&
                      errors.arbitrageFundSharing
                    }
                    fullWidth
                  />
                </div>

                {/* Prop Fund */}
                <div className="flex gap-4">
                  <TextField
                    name="propFund"
                    label="Prop Fund (1Cr)"
                    value={values.propFund}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.propFund && Boolean(errors.propFund)}
                    helperText={touched.propFund && errors.propFund}
                    fullWidth
                  />
                  <TextField
                    name="propFundInterest"
                    label="Interest (%)"
                    value={values.propFundInterest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.propFundInterest &&
                      Boolean(errors.propFundInterest)
                    }
                    helperText={
                      touched.propFundInterest && errors.propFundInterest
                    }
                    fullWidth
                  />
                  <TextField
                    name="propFundSharing"
                    label="Sharing (%)"
                    value={values.propFundSharing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.propFundSharing && Boolean(errors.propFundSharing)
                    }
                    helperText={
                      touched.propFundSharing && errors.propFundSharing
                    }
                    fullWidth
                  />
                </div>

                {/* B2P Fund */}

                <div className="flex gap-4">
                  <TextField
                    name="B2P"
                    label="B2P"
                    value={values.b2pFund}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.b2pFund && Boolean(errors.b2pFund)}
                    helperText={touched.b2pFund && errors.b2pFund}
                    fullWidth
                  />
                  <TextField
                    name="B2P Interest"
                    label="Interest (%)"
                    value={values.b2pFundInterest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.b2pFundInterest && Boolean(errors.b2pFundInterest)
                    }
                    helperText={
                      touched.b2pFundInterest && errors.b2pFundInterest
                    }
                    fullWidth
                  />
                  <TextField
                    name="B2P Sharing"
                    label="Sharing (%)"
                    value={values.b2pFundSharing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.b2pFundSharing && Boolean(errors.b2pFundSharing)
                    }
                    helperText={touched.b2pFundSharing && errors.b2pFundSharing}
                    fullWidth
                  />
                </div>
                {/* Client Fund */}
                <div className="flex gap-4">
                  <TextField
                    name="clientFund"
                    label="Client"
                    value={values.clientFund}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.clientFund && Boolean(errors.clientFund)}
                    helperText={touched.clientFund && errors.clientFund}
                    fullWidth
                  />
                  <TextField
                    name="clientFundInterest"
                    label="Interest (%)"
                    value={values.clientFundInterest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.clientFundInterest &&
                      Boolean(errors.clientFundInterest)
                    }
                    helperText={
                      touched.clientFundInterest && errors.clientFundInterest
                    }
                    fullWidth
                  />
                  <TextField
                    name="clientFundSharing"
                    label="Sharing (%)"
                    value={values.clientFundSharing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.clientFundSharing &&
                      Boolean(errors.clientFundSharing)
                    }
                    helperText={
                      touched.clientFundSharing && errors.clientFundSharing
                    }
                    fullWidth
                  />
                </div>

                {/* Cost Per Cr */}
                <TextField
                  name="costPerCr"
                  label="Cost Per Cr"
                  value={values.costPerCr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.costPerCr && Boolean(errors.costPerCr)}
                  helperText={touched.costPerCr && errors.costPerCr}
                  fullWidth
                  margin="normal"
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-4">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    {initialValues.id ? "Update Broker" : "Add Broker"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default BrokerFormPopup;
