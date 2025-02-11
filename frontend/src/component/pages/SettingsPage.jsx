import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";

import CustomTable from "../table/CustomTable.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import api from "../../config/AxiosCofig.js";
import { toast } from "react-toastify";
import InputAdornment from "@mui/material/InputAdornment";
import BrokerFormPopup from "../popups/BrokerFormPopup.jsx";
import { Card } from "@nextui-org/react";
import { IoSearch, IoAddCircleOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import CollapsableTable from "../table/CollapsableTable.jsx";
import CommonPopup from "../popups/commonPopup/CommonPopup.jsx";
import { IoClose } from "react-icons/io5";

// Column Titles
// const brokerTableTitle = [
//   "Broker Name",
//   "Start Date",
//   "Release Date",
//   "Gross Fund",
//   "Arbitrage Fund",
//   "Total Fund",
//   "Prop Fund",
//   "Action",
// ];

const brokerTableTitle = [
  "Broker Name",
  "Gross",
  "Arbitrage",
  "Prop",
  // "Interest",
  // "Sharing",
  // "Cost Per Cr",
  "B2P",
  "Client",
  "Total ",
  // "Start Date",
  // "Realease Date",
  "Action",
];

const AdminSettings = () => {
  const [brokerData, setBrokerData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loader, setLoader] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [rowPopups, setRowPopups] = useState(false);
  const [rowData, setRowData] = useState({});
  const [brokerTotel, setBrokerTotel] = useState([]);
  const [viewByPopup, setViewByPopup] = useState(false)

  // Fetch Brokers Data
  const getBrokerData = useCallback(async () => {
    setLoader(true);
    try {
      const response = await api.get("/getAllBroker");
      if (response.status === 200) {
        console.log(response.data?.data);
        const formattedData = response.data?.data?.map((broker) => ({
          "Broker Name": broker.brokerName,

          "Gross Fund Interest": broker.grossFundInterest || 0,
          "Gross Fund": broker.grossFund || 0,
          "Gross Fund Sharing": broker.grossFundSharing || 0,

          "Arbitrage Fund Interest": broker.arbitrageFundInterest || 0,
          "Arbitrage Fund": broker.arbitrageFund || 0,
          "Arbitrage Fund Sharing": broker.arbitrageFundSharing || 0,

          "Prop Fund Interest": broker.propFundInterest || 0,
          "Prop Fund": broker.propFund || 0,
          "Prop Fund Sharing": broker.propFundSharing || 0,
          "Cost Per Cr": broker.costPerCr || 0,

          b2pFund: broker.b2pFund || 0,
          b2pFundsharing: broker.b2pFundsharing || 0,
          b2pFundInterest: broker.b2pFundInterest || 0,

          clientFund: broker.clientFund,
          clientFundSharing: broker.clientFundSharing,
          clientFundInterest: broker.clientFundInterest,

          // Total Fund Calculation (Summing all fund values)
          "Total Fund":
            broker.grossFund !== undefined &&
            broker.arbitrageFund !== undefined &&
            broker.propFund !== undefined
              ? broker.grossFund + broker.arbitrageFund + broker.propFund
              : 0,

          // "Start Date": broker.startDate || "-",
          // "Release Date": broker.releaseDate || "-",

          Action: (
            <Dropdown>
              <DropdownTrigger>
                <IconButton>
                  <CiMenuKebab />
                </IconButton>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action menu"
                onAction={(key) => handleDropdownAction(key, broker)}
              >
                <DropdownItem key="release" isDisabled={broker.status === 3}>
                  Release
                </DropdownItem>
                <DropdownItem key="edit" isDisabled={broker.status === 3}>
                  Edit
                </DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }));
        
        const brokerTable = response?.data?.totals?.map((brokerTotal) => ({
          Gross: brokerTotal.totalGrossFund,
          Arbitrage: brokerTotal.totalArbitrageFund,
          Prop: brokerTotal.totalPropFund,
          B2P: brokerTotal.totalB2pFund,
          Client: brokerTotal.totalClientFund,
        }));
        setBrokerTotel(brokerTable);
        setBrokerData(formattedData);
      } else {
        toast.error("Failed to fetch broker data.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching broker data.");
    } finally {
      setLoader(false);
    }
  }, []);

  const deleteBroker = async (broker) => {
    try {
      console.warn(broker);
      const response = await api.put(`/softDeleteBroker/${broker.id}`);
      if (response.status === 200) {
        toast.success(`Broker "${broker.brokerName}" deleted successfully.`);
        getBrokerData();
      } else {
        toast.error(`Failed to delete broker "${broker.brokerName}".`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting broker.");
    }
  };

  // Handle Dropdown Actions
  const handleDropdownAction = (action, broker) => {
    if (action === "release") {
      releaseBroker(broker);
    } else if (action === "edit") {
      setSelectedBroker(broker);
      setAnchorEl(document.body);
    } else if (action === "delete") {
      deleteBroker(broker);
    }
  };

  // Release Broker
  const releaseBroker = async (broker) => {
    try {
      const response = await api.put(`/releaseBroker/${broker.id}/3`);
      if (response.status === 200) {
        toast.success(`Broker "${broker.brokerName}" released successfully.`);
        getBrokerData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error releasing broker.");
    }
  };

  // Open and Close Popover
  const handleClickPopover = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedBroker(null);
  };

  useEffect(() => {
    getBrokerData();
  }, [getBrokerData]);

  const handlePopupClose = () => {
    setRowPopups(false);
  };

  return (
    <AdminLayout
      pageTitle="Brokers"
      pageSubtitle="Add, view, and release brokers"
    >
      <CommonPopup open={rowPopups} handleClose={handlePopupClose}>
        <div className="flex justify-between align-middle mb-2">
          <Typography className="mt-2">
            Broker Name - {rowData["Broker Name"]}
          </Typography>
          <IconButton onClick={handlePopupClose}>
            <IoClose />
          </IconButton>
        </div>
        <div
          style={{
            padding: 10,
            // backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <div className="flex gap-2">
            <Paper className="flex-1">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        Gross Fund
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Fund</TableCell>
                      <TableCell>Intrest %</TableCell>
                      <TableCell>Sharing %</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{rowData["Gross Fund"]}</TableCell>
                      <TableCell>{rowData["Gross Fund Interest"]}%</TableCell>
                      <TableCell>{rowData["Gross Fund Sharing"]}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper className="flex-1">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        Arbitrage Fund
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Fund</TableCell>
                      <TableCell>Intrest %</TableCell>
                      <TableCell>Sharing %</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{rowData["Arbitrage Fund"]}</TableCell>
                      <TableCell>
                        {rowData["Arbitrage Fund Interest"]}%
                      </TableCell>
                      <TableCell>
                        {rowData["Arbitrage Fund Sharing"]}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>

          <div className="flex gap-2">
            <Paper className="flex-1">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        Prop Fund
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Fund</TableCell>
                      <TableCell>Intrest %</TableCell>
                      <TableCell>Sharing %</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{rowData["Prop Fund"]}</TableCell>
                      <TableCell>{rowData["Prop Fund Interest"]}%</TableCell>
                      <TableCell>{rowData["Prop Fund Sharing"]}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper className="flex-1">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        B2P Fund
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Fund</TableCell>
                      <TableCell>Intrest %</TableCell>
                      <TableCell>Sharing %</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{rowData["b2pFund"]}</TableCell>
                      <TableCell>{rowData["b2pFundInterest"]}%</TableCell>
                      <TableCell>{rowData["b2pFundsharing"]}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <Paper className="flex-1">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                      Client Fund
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Fund</TableCell>
                    <TableCell>Intrest %</TableCell>
                    <TableCell>Sharing %</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{rowData["clientFund"]}</TableCell>
                    <TableCell>{rowData["clientFundInterest"]}%</TableCell>
                    <TableCell>{rowData["clientFundSharing"]}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </CommonPopup>
      <Card
        className="settings-mainCard"
        style={{ marginTop: "1rem", width: "100%", overflowY: "scroll" }}
      >
        <div className="flex justify-between p-2 align-middle broker-form">
          <TextField
            className="searchUser"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearch />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickPopover}
            startIcon={<IoAddCircleOutline />}
          >
            Add Broker
          </Button>
        </div>

        <BrokerFormPopup
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          handleClose={handleClosePopover}
          onFormSubmit={getBrokerData}
          brokerData={selectedBroker}
          isDisable={viewByPopup}
        />

        <div className="mt-4">
          <CustomTable
            title={brokerTableTitle}
            tableData={brokerData}
            headerTotal={brokerTotel}
            loading={loader}
            onRowClick={(rowData) => {
              setRowPopups(true);
              // setViewByPopup(true)
              // handleDropdownAction("edit",rowData)
              setRowData(rowData);
            }}
          />
          {/* <CollapsableTable
            title={brokerTableTitle}
            tableData={brokerData}
            loading={loader}
          /> */}
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
