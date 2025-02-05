import { useState, useEffect, useCallback } from "react";
import { Button, TextField, IconButton } from "@mui/material";
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
  "BrokerName",
  "GrossFund",
  "ArbitrageFund",
  "PropFund",
  // "Interest",
  // "Sharing",
  // "Cost Per Cr",
  "Total Fund",
  // "Start Date",
  // "Realease Date",
  "Action",
];

const AdminSettings = () => {
  const [brokerData, setBrokerData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loader, setLoader] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);

  // Fetch Brokers Data
  const getBrokerData = useCallback(async () => {
    setLoader(true);
    try {
      const response = await api.get("/getAllBroker");
      if (response.status === 200) {
        const formattedData = response.data?.data?.map((broker) => ({
          "Broker Name": broker.brokerName,
          
          "Gross Fund Interest": broker.grossFundInterest || "-",
          "Gross Fund": broker.grossFund || "-",
          "Gross Fund Sharing": broker.grossFundSharing || "-",

          "Arbitrage Fund Interest": broker.arbitrageFundInterest || "-",
          "Arbitrage Fund": broker.arbitrageFund || "-",
          "Arbitrage Fund Sharing": broker.arbitrageFundSharing || "-",

          "Prop Fund Interest": broker.propFundInterest || "-",
          "Prop Fund": broker.propFund || "-",
          "Prop Fund Sharing": broker.propFundSharing || "-",
          "Cost Per Cr": broker.costPerCr || "-",

          // Total Fund Calculation (Summing all fund values)
          "Total Fund":
            broker.grossFund !== undefined &&
            broker.arbitrageFund !== undefined &&
            broker.propFund !== undefined
              ? broker.grossFund + broker.arbitrageFund + broker.propFund
              : "-",

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
                <DropdownItem key="delete" >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }));
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


  const deleteBroker = async(broker) =>{
    try{
      console.warn(broker);
      const response = await api.put(`/softDeleteBroker/${broker.id}`);
      if(response.status === 200){
        toast.success(`Broker "${broker.brokerName}" deleted successfully.`);
        getBrokerData();
      } else {
        toast.error(`Failed to delete broker "${broker.brokerName}".`);
      }
    } catch(error){
      console.error(error);
      toast.error("Error deleting broker.");
    }
  }

  // Handle Dropdown Actions
  const handleDropdownAction = (action, broker) => {
    if (action === "release") {
      releaseBroker(broker);
    } else if (action === "edit") {
      setSelectedBroker(broker);
      setAnchorEl(document.body);
    } else if (action === "delete"){
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

  return (
    <AdminLayout
      pageTitle="Brokers"
      pageSubtitle="Add, view, and release brokers"
    >
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
        />

        <div className="mt-4">
          {/* <CustomTable
            columnWidths={[
              "10%",
              "10%",
              "10%",
              "10%",
              "15%",
              "10%",
              "10%",
              "10%",
              "40%",
              "15%",
              "10%",
            ]}
            title={brokerTableTitle}
            tableData={brokerData}
            loading={loader}
          /> */}
          <CollapsableTable
            title={brokerTableTitle}
            tableData={brokerData}
            loading={loader}
          />
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
