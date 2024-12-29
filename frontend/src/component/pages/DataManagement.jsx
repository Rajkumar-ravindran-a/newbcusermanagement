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
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Typography, Button } from "@mui/material";
import ModelPoper from "../Model";
import axios from "axios";
import { DatePicker } from "@nextui-org/react";
import { toast } from "react-toastify";


const dateConversion = (dateString) => {
  const mysqlDatetime = new Date(dateString)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return mysqlDatetime;
};

const DataManagement = () => {
  const [tradeData, setTradeData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTrade = async () => {
    const tradeData = await axios.get("http://localhost:8000/getTrade", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    if (tradeData.status === 200) {
      setTradeData(tradeData.data);
    }
  };

  useEffect(() => {
    fetchTrade();
  }, [token]);

  const [page, setPage] = useState(1);
  const [modelPopup, setModelPopup] = useState(false);

  const rowsPerPage = 4; // Number of rows per page
  const pages = Math.ceil(tradeData.length / rowsPerPage);

  // Calculate items for the current page
  const paginatedData = React.useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tradeData.slice(startIndex, endIndex);
  }, [page, tradeData]);

  const handleClose = () => {
    setModelPopup(false);
  };

  const validationSchema = Yup.object().shape({
    Date: Yup.string().required("Date is required"),
    broker: Yup.string().required("Broker is required"),
    tradeId: Yup.string().required("ID is required"),
    strategy: Yup.string().required("Strategy is required"),
    counter: Yup.number()
      .required("Counter is required")
      .positive("Must be positive"),
    buyValue: Yup.number()
      .required("Buy Value is required")
      .positive("Must be positive"),
    sellValue: Yup.number()
      .required("Sell Value is required")
      .positive("Must be positive"),
  });

  const initialValues = {
    Date: null,
    broker: "",
    tradeId: "",
    strategy: "",
    counter: "",
    buyValue: "",
    sellValue: "",
  };

  const handleSubmit = async (values) => {
    console.log(values);
    const submissionData = {
      ...values,
      Date: values.Date ? dateConversion(values.Date) : null, // Convert date only during submission
    };
    console.log(submissionData);
    const SubmitData = await axios.post(
      "http://localhost:8000/create_trade",
      submissionData,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    if (SubmitData.status === 200) {
      fetchTrade();
      toast.success("Data added successfully");
      handleClose();
    }
  };

  return (
    <MainPage>
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
                <DatePicker
                  className="max-w-[284px]"
                  label="Date"
                  value={values.Date}
                  onChange={(newDate) => setFieldValue("Date", newDate)}
                  error={touched.Date && Boolean(errors.Date)}
                  helperText={touched.Date && errors.Date}
                />
                <Select
                  name="broker"
                  placeholder="Select Broker"
                  label="Broker"
                  value={values.broker}
                  onChange={(e) => setFieldValue("broker", e.target.value)}
                  error={touched.broker && Boolean(errors.broker)}
                  helperText={touched.broker && errors.broker}
                >
                  <SelectItem key="Upstocks">Upstocks</SelectItem>
                </Select>
              </div>
              <div className="flex gap-2 mb-3">
                <Input
                  name="tradeId"
                  label="ID"
                  placeholder="Enter ID"
                  value={values.tradeId}
                  onChange={(e) => setFieldValue("tradeId", e.target.value)}
                  error={touched.tradeId && Boolean(errors.tradeId)}
                  helperText={touched.tradeId && errors.tradeId}
                />
                <Select
                  name="strategy"
                  placeholder="Select Strategy"
                  label="Strategy"
                  value={values.strategy}
                  onChange={(e) => setFieldValue("strategy", e.target.value)}
                  error={touched.strategy && Boolean(errors.strategy)}
                  helperText={touched.strategy && errors.strategy}
                >
                  <SelectItem key="Strategy 1">Strategy 1</SelectItem>
                </Select>
                <Input
                  name="counter"
                  label="Counter"
                  placeholder="Enter Counter"
                  value={values.counter}
                  onChange={(e) => setFieldValue("counter", e.target.value)}
                  error={touched.counter && Boolean(errors.counter)}
                  helperText={touched.counter && errors.counter}
                />
              </div>
              <div className="flex gap-3 mb-3">
                <Input
                  name="buyValue"
                  label="Buy Value"
                  placeholder="Enter Buy Value"
                  value={values.buyValue}
                  onChange={(e) => setFieldValue("buyValue", e.target.value)}
                  error={touched.buyValue && Boolean(errors.buyValue)}
                  helperText={touched.buyValue && errors.buyValue}
                />
                <Input
                  name="sellValue"
                  label="Sell Value"
                  placeholder="Enter Sell Value"
                  value={values.sellValue}
                  onChange={(e) => setFieldValue("sellValue", e.target.value)}
                  error={touched.sellValue && Boolean(errors.sellValue)}
                  helperText={touched.sellValue && errors.sellValue}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="contained" type="submit" className="mt-2">
                  Submit Data
                </Button>
                <Button
                  variant="outlined"
                  className="mt-2"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModelPoper>
      <div className="w-full">
        <div className="flex justify-between">
          <Typography variant="h5" className="mb-3">
            Data Management
          </Typography>
          <Button
            className="h-5 mb-4 p-3"
            variant="contained"
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
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="Date">Date</TableColumn>
            <TableColumn key="DealerName">Dealer Name</TableColumn>
            <TableColumn key="broker">Broker</TableColumn>
            <TableColumn key="tradeId">Id</TableColumn>
            <TableColumn key="strategy">Strategy Name</TableColumn>
            <TableColumn key="counter">Counter</TableColumn>
            <TableColumn key="buyValue">Buy Value</TableColumn>
            <TableColumn key="sellValue">Sell Value</TableColumn>
          </TableHeader>
          <TableBody items={paginatedData} emptyContent={"No Data to display."}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainPage>
  );
};

export default DataManagement;
