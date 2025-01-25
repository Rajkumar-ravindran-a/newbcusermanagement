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
    .required("Gross Fund is required"),
  arbitrageFund: Yup.number()
    .typeError("Arbitrage Fund must be a number")
    .required("Arbitrage Fund is required"),
  propFund: Yup.number()
    .typeError("Prop Fund must be a number")
    .required("Prop Fund is required"),
});

const BrokerFormPopup = ({ open, handleClose, onFormSubmit }) => {
  const initialValues = {
    brokerName: "",
    grossFund: "",
    arbitrageFund: "",
    propFund: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await api.post("/createBroker", values);
      toast.success("Broker added successfully.");
      onFormSubmit();
      resetForm();
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      toast.error("Error adding broker.");
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
          overflowY: "scroll",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          Add Broker
        </Typography>

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
            <Form>
              <div className="flex flex-col gap-2">
                <TextField
                  name="brokerName"
                  label="Broker Name"
                  value={values.brokerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.brokerName && Boolean(errors.brokerName)}
                  helperText={touched.brokerName && errors.brokerName}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="grossFund"
                  label="Gross Fund"
                  value={values.grossFund}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setFieldValue("grossFund", numericValue);
                  }}
                  onBlur={handleBlur}
                  error={touched.grossFund && Boolean(errors.grossFund)}
                  helperText={touched.grossFund && errors.grossFund}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="arbitrageFund"
                  label="Arbitrage Fund"
                  value={values.arbitrageFund}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setFieldValue("arbitrageFund", numericValue);
                  }}
                  onBlur={handleBlur}
                  error={touched.arbitrageFund && Boolean(errors.arbitrageFund)}
                  helperText={touched.arbitrageFund && errors.arbitrageFund}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="propFund"
                  label="Prop Fund"
                  value={values.propFund}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setFieldValue("propFund", numericValue);
                  }}
                  onBlur={handleBlur}
                  error={touched.propFund && Boolean(errors.propFund)}
                  helperText={touched.propFund && errors.propFund}
                  fullWidth
                  margin="normal"
                />
              </div>

              <div style={{ marginTop: "20px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                  style={{ marginRight: "10px" }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Add Broker
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default BrokerFormPopup;
