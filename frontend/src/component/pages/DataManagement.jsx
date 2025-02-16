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
  IconButton,
} from "@mui/material";
import ModelPoper from "../Model";
import { toast } from "react-toastify";
import api from "../../config/AxiosCofig.js";
import AdminLayout from "../layouts/AdminLayout";
import { IoMdAddCircleOutline } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { CiMenuKebab } from "react-icons/ci";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

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
  const [strategyData, setStrategyData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const token = localStorage.getItem("token");

  const decode = jwtDecode(token);

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
    getStrategyData();
  }, []);

  const rowsPerPage = 4; // Number of rows per page
  const pages = Math.ceil(tradeData.length / rowsPerPage);

  const paginatedData = React.useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tradeData.slice(startIndex, endIndex);
  }, [page, tradeData]);

  const handleClose = () => {
    setModelPopup(false);
    setEdit(false);
  };

  useEffect(() => {
    console.log(editData);
  }, [editData]);

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
    pl: Yup.number().required("P/L is required"),
  });

  let initialValues = edit
    ? {
        id: editData.id,
        Date: new Date(editData.Date),
        broker: editData.broker || null,
        brokerId:  editData.brokerId || null,
        tradeId: editData.tradeId  || null,
        strategy: editData.strategy || null,
        counter: editData.counter || null,
        buyValue: editData.buyValue || null,
        sellValue: editData.sellValue || null,
        dealer: decode.fullName || null,
        pl: editData.pl || 0,
      }
    : {
        Date: new Date(),
        broker: "",
        brokerId: null,
        tradeId: null,
        strategy: "",
        counter: "",
        buyValue: "",
        sellValue: "",
        dealer: decode.fullName,
        pl: 0,
      };

  const editDataFunction = async (value) => {
    setModelPopup(true);
    setEditData(value);
    initialValues.brokerId = fetchBrokerById(value.brokerId);
  };

  const handleDelete = async (value) => {
    try {
      const response = await api.delete(`/delete_trade/${value.id}`);
      if (response.status === 200) {
        fetchTrade();
        toast.success("Data deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  const getStrategyData = async () => {
    try {
      const response = await api.get("/getStrategies");
      console.log(response);
      if (response.status === 200) {
        const formattedData = response.data.map((data) => ({
          "Strategy Id": data.id,
          "Strategy Name": data.StrategyName,
        }));
        setStrategyData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  };

  const handleSubmit = async (values) => {
    const submissionData = {
      ...values,
      Date: values.Date ? dateConversion(values.Date) : null,
    };
    if(!edit){
      let SubmitData = await api.post("/create_trade", submissionData);
      if (SubmitData.status === 200) {
        fetchTrade();
        toast.success("Data added successfully");
        handleClose();
        setBrokerId([]);
      }
    }
    else{
      let SubmitData = await api.put(`/update_trade/${submissionData.id}`, submissionData);
      if (SubmitData.status === 200) {
        fetchTrade();
        toast.success("Data Updated successfully");
        handleClose();
        setBrokerId([]);
      }
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
          {({ values, errors, touched, setFieldValue }) => {
            // Function to calculate P/L
            const calculatePL = (buyValue, sellValue) => sellValue - buyValue;
            return (
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
                        setFieldValue(
                          "broker",
                          selectedBroker?.brokerName || ""
                        );
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
                    disabled
                  />
                  <FormControl fullWidth>
                    <InputLabel>Strategy</InputLabel>
                    <Select
                      name="strategy"
                      label="Strategy"
                      value={values.strategy}
                      onChange={(e) =>
                        setFieldValue("strategy", e.target.value)
                      }
                      error={touched.strategy && Boolean(errors.strategy)}
                    >
                      {strategyData.map((value) => (
                        <MenuItem
                          key={value["Strategy Name"]}
                          value={value["Strategy Name"]}
                        >
                          {value["Strategy Name"]?.toUpperCase()}
                        </MenuItem>
                      ))}
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
                    type="number"
                    onChange={(e) => {
                      setFieldValue("buyValue", e.target.value);
                      setFieldValue(
                        "pl",
                        calculatePL(e.target.value, values.sellValue)
                      );
                    }}
                    error={touched.buyValue && Boolean(errors.buyValue)}
                    helperText={touched.buyValue && errors.buyValue}
                  />
                  <TextField
                    fullWidth
                    name="sellValue"
                    label="Sell Value"
                    type="number"
                    value={values.sellValue}
                    onChange={(e) => {
                      setFieldValue("sellValue", e.target.value);
                      setFieldValue(
                        "pl",
                        calculatePL(values.buyValue, e.target.value)
                      );
                    }}
                    error={touched.sellValue && Boolean(errors.sellValue)}
                    helperText={touched.sellValue && errors.sellValue}
                  />
                  <TextField
                    fullWidth
                    name="pl"
                    label="P/L"
                    value={values.pl}
                    error={touched.pl && Boolean(errors.pl)}
                    helperText={touched.pl && errors.pl}
                    disabled
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
            );
          }}
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
            <TableColumn>P/L</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedData.map((value, index) => (
              <TableRow key={index}>
                <TableCell>{value.broker?.toUpperCase()}</TableCell>
                <TableCell>{value.tradeId?.toUpperCase()}</TableCell>
                <TableCell>{value.dealer?.toUpperCase()}</TableCell>
                <TableCell>{value.buyValue}</TableCell>
                <TableCell>{value.sellValue}</TableCell>
                <TableCell>{value.strategy?.toUpperCase()}</TableCell>
                <TableCell>{value.sellValue - value.buyValue}</TableCell>
                <TableCell>{value.Date?.toUpperCase()}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <IconButton>
                        <CiMenuKebab />
                      </IconButton>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Action event example"
                      onAction={(key) => {
                        if (key === "delete") {
                          handleDelete(value)
                        } else if (key === "edit") {
                          editDataFunction(value);
                          setEdit(true);
                        }
                      }}
                    >
                      <DropdownItem
                        key="delete"
                        isDisabled={value.status === 3}
                      >
                        Delete
                      </DropdownItem>
                      <DropdownItem key="edit" isDisabled={value.status === 3}>
                        Edit
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default DataManagement;
