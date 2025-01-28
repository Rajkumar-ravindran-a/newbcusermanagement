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
  interest: Yup.number()
    .typeError("Interest must be a number")
    .required("Interest is required"),
  sharing: Yup.number()
    .typeError("Sharing must be a number")
    .required("Sharing is required"),
  costPerCr: Yup.number()
    .typeError("Cost must be a number")
    .required("Cost is required"),
});

const BrokerFormPopup = ({ open, handleClose, onFormSubmit, brokerData }) => {
  console.log(brokerData);
  const initialValues = {
    id: brokerData?.id || null,
    brokerName: brokerData?.brokerName || "",
    grossFund: brokerData?.grossfund || null,
    arbitrageFund: brokerData?.arbitragefund || null,
    propFund: brokerData?.propfund || null,
    interest: brokerData?.intrest || null,
    sharing: brokerData?.shares || null,
    costPerCr: brokerData?.costPerCr || null,
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (values.id) {
        await api.put(`/updateBroker/${values.id}`, values);
        toast.success("Broker updated successfully.");
      } else {
        console.log(values);
        await api.post("/createBroker", values);
        toast.success("Broker added successfully.");
      }
      onFormSubmit();
      resetForm();
      handleClose();
    } catch (error) {
      console.log(error?.response?.data);
      toast.error(error?.response?.data?.detail);
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
          height: 560,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: "scroll",
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
              <div className="flex flex-col gap-2">
                <TextField
                  name="brokerName"
                  label="Broker Name"
                  value={values.brokerName}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: e.target.name,
                        value: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  onBlur={handleBlur}
                  error={touched.brokerName && Boolean(errors.brokerName)}
                  helperText={touched.brokerName && errors.brokerName}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="grossFund"
                  label="Gross Fund (1Cr)"
                  value={values.grossFund}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.grossFund && Boolean(errors.grossFund)}
                  helperText={touched.grossFund && errors.grossFund}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="arbitrageFund"
                  label="Arbitrage Fund (1Cr)"
                  value={values.arbitrageFund}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.arbitrageFund && Boolean(errors.arbitrageFund)}
                  helperText={touched.arbitrageFund && errors.arbitrageFund}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="propFund"
                  label="Prop Fund (1Cr)"
                  value={values.propFund}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.propFund && Boolean(errors.propFund)}
                  helperText={touched.propFund && errors.propFund}
                  fullWidth
                  margin="normal"
                />
                <div className="flex gap-2">
                  <TextField
                    name="interest"
                    label="Interest (PA) %"
                    value={values.interest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.interest && Boolean(errors.interest)}
                    helperText={touched.interest && errors.interest}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="sharing"
                    label="Sharing (Base) %"
                    value={values.sharing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sharing && Boolean(errors.sharing)}
                    helperText={touched.sharing && errors.sharing}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="costPerCr"
                    label="Cost (Per Cr)"
                    value={values.costPerCr}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.costPerCr && Boolean(errors.costPerCr)}
                    helperText={touched.costPerCr && errors.costPerCr}
                    fullWidth
                    margin="normal"
                  />
                </div>
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
                  {initialValues.id ? "Update Broker" : "Add Broker"}
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
