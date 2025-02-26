"use client"

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const TransactionTable = ({ transactions }) => {
  const handleSort = () => {};
  return (
    <div className="space-y-4">
      {/* Filters */}

      {/* Transactions */}
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Checkbox />
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex-items-center">Date</div>
              </TableHead>

              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex-items-center">Category</div>
                
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex-items-center justify-end">Amount</div>
                
              </TableHead>
              <TableHead className="text-right">Recurring</TableHead>
              <TableHead className="w-[50px]"/>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
