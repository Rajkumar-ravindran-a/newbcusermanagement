import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import CustomTable from "../table/CustomTable.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import api from "../../config/AxiosCofig.js";
import { toast } from "react-toastify";
import InputAdornment from "@mui/material/InputAdornment";
import BrokerFormPopup from "../popups/BrokerFormPopup.jsx";
import { Card } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";

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
  const [anchorEl, setAnchorEl] = useState(null); // State for Popover anchor

  // Fetch Brokers Data
  const getBrokerData = async () => {
    try {
      const response = await api.get("/getAllBroker");
      if (response.status === 200) {
        const formattedData = response?.data?.data.map((broker) => ({
          "Broker Name": broker.brokerName,
          "Start Date": broker.startDate || "-",
          "Release Date": broker.releaseDate || "-",
          "Gross Fund": broker.grossfund || "-",
          "Arbitrage Fund": broker.arbitragefund || "-",
          "Prop Fund": broker.propfund || "-",
          "Total Fund": broker.grossfund + broker.arbitragefund || "-",
          Action: (
            <div key={`action-${broker.id}`} className="action-buttons">
              <Button
                key={`release-${broker.id}`}
                onClick={() => releaseBroker(broker)}
                size="small"
                variant="contained"
                color="primary"
                disabled={broker.status === 3}
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
      console.log(broker.id, "====================");
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
    getBrokerData();
  }, []);

  // Handle Popover Open and Close
  const handleClickPopover = (event) => {
    setAnchorEl(event.currentTarget); // Open the popover
  };

  const handleClosePopover = () => {
    setAnchorEl(null); // Close the popover
  };

  return (
    <AdminLayout
      pageTitle="Brokers"
      pageSubtitle="Add, view and release brokers"
    >
      <Card classNames="settings-mainCard" style={{ marginTop: "1rem" }}>
        {/* Button to Open Popover */}
        <div className="flex justify-between p-4 align-middle broker-form">
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
          >
            Add Broker
          </Button>
        </div>

        {/* Broker Form Popover Component */}
        <BrokerFormPopup
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          handleClose={handleClosePopover}
          onFormSubmit={getBrokerData} // Refresh broker data after form submission
        />

        {/* Table of Brokers */}
        <div className="mt-4">
          <CustomTable title={brokerTableTitle} tableData={brokerData} />
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
