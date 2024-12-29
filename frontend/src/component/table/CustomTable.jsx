import React from "react";
import { Button } from "@nextui-org/react";

const CustomTable = ({ title = [], tableData = [] }) => {
  return (
    <div className="custom">
      <table className="w-full">
        {/* Table Header */}
        <thead>
          <tr className="flex justify-between table-row mb-3">
            {title.map((header, index) => (
              <th className="flex-1" key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <hr className="mb-3" />
        {/* Table Body */}
        <tbody>
          {tableData.map((rowData, rowIndex) => (
            <tr key={rowIndex} className="flex justify-between mb-3">
              {Object.keys(rowData).map((key, colIndex) => (
                <td className="flex-1 p-2" key={`${rowIndex}-${colIndex}`}>
                  {key === "action" ? (
                    <Button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    //   onClick={() => alert(`Action triggered for row ${rowIndex + 1}`)}
                    >
                      Perform Action
                    </Button>
                  ) : (
                    rowData[key]
                  )}
                </td>
              ))}
              <hr />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
