import React, { useEffect, useState } from "react";
import MainPage from "../layouts/MainPage";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import {
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ModelPoper from "../Model";
import { toast } from "react-toastify";
import api from "../../config/AxiosCofig.js";
import AdminLayout from "../layouts/AdminLayout";
import { IoMdAddCircleOutline } from "react-icons/io";

const dateConversion = (dateString) => {
  const mysqlDatetime = new Date(dateString)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return mysqlDatetime;
};

const DataManagement = () => {
  const [tradeData, setTradeData] = useState([]);
  const [brokerData, setBrokerData] = useState([]);
  const [brokerId, setBrokerId] = useState([]);
  const [brokerList, setBrokerList] = useState([]);
  const [page, setPage] = useState(1);
  const [modelPopup, setModelPopup] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTrade = async () => {
    const tradeData = await api.get("/getTrade", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    if (tradeData.status === 200) {
      setTradeData(tradeData.data);
    }
  };

  const fetchAllBrokers = async () => {
    try {
      const BrokerData = await api.get("/getAllBroker?status=1");
      setBrokerData(BrokerData.data.data);
      // let uniqueArray = BrokerData.data.data
      //   .map((item, index, arr) =>
      //     arr.findIndex((broker) => broker.brokerName === item.brokerName) === index
      //       ? item.brokerName
      //       : null
      //   )
      //   .filter((item) => item !== null);
      setBrokerList(BrokerData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBrokerById = async (brokerId) => {
    const brokerData = await api.get(`/getIdsByBroker/${brokerId}`);
    console.log(brokerData.data);
    if (brokerData.status === 200) {
      if (brokerData.data.data) {
        setBrokerId(brokerData.data.data);
      } else {
        toast.error("No id associated for this user.");
        setBrokerId([]);
      }
      console.log(brokerData.data, "in 200");
    } else if (brokerData?.data?.status_code === 404) {
      toast.error("No id associated for this user.");
      setBrokerId([]);
    } else {
      setBrokerId([]);
    }
  };

  useEffect(() => {
    fetchTrade();
    fetchAllBrokers();
  }, [token]);

  const rowsPerPage = 4; // Number of rows per page
  const pages = Math.ceil(tradeData.length / rowsPerPage);

  const paginatedData = React.useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tradeData.slice(startIndex, endIndex);
  }, [page, tradeData]);

  const handleClose = () => {
    setModelPopup(false);
  };

  const validationSchema = Yup.object().shape({
    broker: Yup.string().required("Broker is required"),
    tradeId: Yup.string().required("ID is required"),
    strategy: Yup.string().required("Strategy is required"),
    counter: Yup.number()
      .required("Counter is required")
      .positive("Must be positive"),
    buyValue: Yup.number()
      .required("Buy Value is required")
      .positive("Must be positive"),
    sellValue: Yup.number().required("Sell Value is required"),
    dealer: Yup.string().required("Dealer is required"),
    pl: Yup.string().required("P/L is required"),
  });

  const initialValues = {
    Date: new Date(),
    broker: "",
    brokerId: null,
    tradeId: null,
    strategy: "",
    counter: "",
    buyValue: "",
    sellValue: "",
    dealer: "",
    pl: "",
  };

  const handleSubmit = async (values) => {
    const submissionData = {
      ...values,
      Date: values.Date ? dateConversion(values.Date) : null,
    };
    const SubmitData = await api.post("/create_trade", submissionData, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    if (SubmitData.status === 200) {
      fetchTrade();
      toast.success("Data added successfully");
      handleClose();
      setBrokerId([]);
    }
  };

  return (
    <AdminLayout pageTitle="Data Management" pageSubtitle="Enter trade datas">
      <ModelPoper open={modelPopup} handleClose={handleClose}>
        <Typography variant="h6" className="mb-2">
          Add Data
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="flex gap-3 mb-3">
                <FormControl fullWidth>
                  <InputLabel>Broker</InputLabel>
                  <Select
                    name="broker"
                    value={values.brokerId} // Store only brokerId
                    label="Broker"
                    onChange={(e) => {
                      const selectedBroker = brokerList.find(
                        (b) => b.id === e.target.value
                      );
                      setFieldValue("brokerId", selectedBroker?.id || "");
                      setFieldValue("broker", selectedBroker?.brokerName || "");
                      fetchBrokerById(selectedBroker?.id);
                    }}
                    error={touched.broker && Boolean(errors.broker)}
                  >
                    {brokerList.map((value) => (
                      <MenuItem key={value.id} value={value.id}>
                        {value.brokerName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>ID</InputLabel>
                  <Select
                    name="tradeId"
                    label="Id"
                    value={values.tradeId}
                    onChange={(e) => setFieldValue("tradeId", e.target.value)}
                    error={touched.tradeId && Boolean(errors.tradeId)}
                  >
                    {console.warn(brokerId)}
                    {brokerId.map((value, index) => (
                      <MenuItem key={index} value={value.idNumber}>
                        {value.idNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-2 mb-3">
                <TextField
                  fullWidth
                  name="dealer"
                  label="Dealer"
                  value={values.dealer}
                  onChange={(e) => setFieldValue("dealer", e.target.value)}
                  error={touched.dealer && Boolean(errors.dealer)}
                  helperText={touched.dealer && errors.dealer}
                />
                <FormControl fullWidth>
                  <InputLabel>Strategy</InputLabel>
                  <Select
                    name="strategy"
                    label="Strategy"
                    value={values.strategy}
                    onChange={(e) => setFieldValue("strategy", e.target.value)}
                    error={touched.strategy && Boolean(errors.strategy)}
                  >
                    <MenuItem value="Strategy 1">Strategy 1</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  name="counter"
                  label="Margin"
                  value={values.counter}
                  onChange={(e) => setFieldValue("counter", e.target.value)}
                  error={touched.counter && Boolean(errors.counter)}
                  helperText={touched.counter && errors.counter}
                />
              </div>
              <div className="flex gap-3 mb-3">
                <TextField
                  fullWidth
                  name="buyValue"
                  label="Buy Value"
                  value={values.buyValue}
                  onChange={(e) => setFieldValue("buyValue", e.target.value)}
                  error={touched.buyValue && Boolean(errors.buyValue)}
                  helperText={touched.buyValue && errors.buyValue}
                />
                <TextField
                  fullWidth
                  name="sellValue"
                  label="Sell Value"
                  value={values.sellValue}
                  onChange={(e) => setFieldValue("sellValue", e.target.value)}
                  error={touched.sellValue && Boolean(errors.sellValue)}
                  helperText={touched.sellValue && errors.sellValue}
                />
                <TextField
                  fullWidth
                  name="pl"
                  label="P/L"
                  value={values.pl}
                  onChange={(e) => setFieldValue("pl", e.target.value)}
                  error={touched.pl && Boolean(errors.pl)}
                  helperText={touched.pl && errors.pl}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="contained" type="submit">
                  Submit Data
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModelPoper>
      <div className="w-full">
        <div className="flex justify-between flex-row-reverse">
          <Button
            variant="contained"
            className="mb-3 mt-3"
            startIcon={<IoMdAddCircleOutline />}
            onClick={() => setModelPopup(true)}
          >
            Submit Data
          </Button>
        </div>

        <Table
          aria-label="Example table with client-side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(newPage) => setPage(newPage)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>Broker Name</TableColumn>
            <TableColumn>Trade ID</TableColumn>
            <TableColumn>Dealer</TableColumn>
            <TableColumn>Buy Value</TableColumn>
            <TableColumn>Sell Value</TableColumn>
            <TableColumn>Strategy</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedData.map((value, index) => (
              <TableRow key={index}>
                <TableCell>{value.broker}</TableCell>
                <TableCell>{value.tradeId}</TableCell>
                <TableCell>{value.dealer}</TableCell>
                <TableCell>{value.buyValue}</TableCell>
                <TableCell>{value.sellValue}</TableCell>
                <TableCell>{value.strategy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default DataManagement;
