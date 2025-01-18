import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/react";
import MainPage from "../layouts/MainPage";
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
import axios from "axios";
import { Typography } from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";

const HomePage = () => {
  const [tradeData, setTradeData] = useState([]);
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState([]);

  const getAllUsers = async () => {
    const allusers = await axios.get("http://13.233.131.250:8000/users", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    if (allusers.status === 200) {
      setUserData(allusers.data);
    }
  };

  const fetchTrade = async () => {
    const tradeData = await axios.get("http://13.233.131.250:8000/getAllTrade", {
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
    getAllUsers();
  }, [token]);

  const [page, setPage] = useState(1);

  const rowsPerPage = 4; // Number of rows per page
  const pages = Math.ceil(tradeData.length / rowsPerPage);

  // Calculate items for the current page
  const paginatedData = React.useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tradeData.slice(startIndex, endIndex);
  }, [page, tradeData]);
  return (
    <AdminLayout pageTitle="Dashboard" pageSubtitle="All details">
      <Card className="p-2 mt-3">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-2">
            <Card className="flex-1 p-3">
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
                  <TableColumn key="buyValue">Buy Value</TableColumn>
                  <TableColumn key="sellValue">Sell Value</TableColumn>
                </TableHeader>
                <TableBody
                  items={paginatedData}
                  emptyContent={"No Data to display."}
                >
                  {(item) => (
                    <TableRow key={item.name}>
                      {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>

            <Card className="flex-1 p-3">
              <Typography variant="subtitle1" className="mb-3">
                Trade Details
              </Typography>
              <Select className="mb-2" placeholder="User Name">
                {userData &&
                  userData.map((item, index) => (
                    <SelectItem key={item.id} value={item}>
                      {item.firstName + "" + item.lastName}
                    </SelectItem>
                  ))}
              </Select>
            </Card>
          </div>
          <div className="flex  gap-2 p-3">
            <Card className="flex-1">
              <h1>Home Page</h1>
            </Card>
            <Card className="flex-1 p-3">
              <Typography variant="subtitle1" className="mb-3">
                User Details
              </Typography>
              <Table>
                <TableHeader>
                  <TableColumn key="firstName">FirstName</TableColumn>
                  <TableColumn key="lastName">LastName</TableColumn>
                  <TableColumn key="role">Role</TableColumn>
                  <TableColumn key="userStatus">Status</TableColumn>
                </TableHeader>
                <TableBody
                  items={userData}
                  emptyContent={"No Data to display."}
                >
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default HomePage;
