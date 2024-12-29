import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Button, Card, Input } from "@nextui-org/react";
import { Typography } from "@mui/material";
import CustomTable from "../table/CustomTable";

const SettingsPage = () => {
  const brokerTableTitle = [
    "ID",
    "Broker Name",
    "Funds Allocated",
    "Start Date",
    "Release Date",
    "Action",
  ];

  const bokerData = [
    {
      id: 1,
      brokerName: "Zerotha",
      fundAllocated: "10000000",
      startDate: "2024-12-29",
      releaseDate: "",
      action: "",
    },
    {
      id: 2,
      brokerName: "Upstocks",
      fundAllocated: "10000000",
      startDate: "2024-12-29",
      releaseDate: "",
      action: "",
    },
  ];

  return (
    <AdminLayout pageTitle="Settings" pageSubtitle="Configurable parameters">
      <Card className="settings-mainCard">
        <Card>
          <Typography variant="h6" className="broker-title">
            Brokers
          </Typography>
          <div className="broker-form flex gap-3">
            <Input label="ID" />
            <Input label="Broker Name" />
            <Input label="Funds Allocated" />
            <Button className="submit-btn">Add Broker</Button>
          </div>
          <div className="mt-4">
            <CustomTable title={brokerTableTitle} tableData={bokerData} />
          </div>
        </Card>
      </Card>
    </AdminLayout>
  );
};

export default SettingsPage;
