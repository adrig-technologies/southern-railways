"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const createData = (
  id,
  section,
  station,
  line,
  workType,
  blockType,
  date,
  startTime,
  endTime,
  remarks,
  status
) => {
  return {
    id,
    section,
    station,
    line,
    workType,
    blockType,
    date,
    startTime,
    endTime,
    remarks,
    status,
  };
};

const requests = [
  createData(
    1,
    "RU-AJJ",
    "AJN-AJJ",
    "UP",
    "TEX",
    "Rolling Block",
    "2024-06-06",
    "3:0",
    "3:30",
    "oho",
    "Not Reviewed"
  ),
  createData(
    2,
    "RU-AJJ",
    "TDK-PUT",
    "UP",
    "SBCM",
    "NON-Rolling Block",
    "2024-06-08",
    "4:0",
    "5:0",
    "opk",
    "Not Reviewed"
  ),
  // Add more rows as needed
];

const RequestTable = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [requestList, SetRequestList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(process.env.REACT_APP_API_URI + "/editlineblock")
        .then((res) => {
          SetRequestList(res.data.data.request);
        })
        .catch((error) => console.error(error));
    }
    fetchData();
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-md border-t shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Section</TableHead>
              <TableHead className="text-center">Stations</TableHead>
              <TableHead className="text-center">Line</TableHead>
              <TableHead className="text-center">Work Type</TableHead>
              <TableHead className="text-center">Block Type</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Start Time</TableHead>
              <TableHead className="text-center">End Time</TableHead>
              <TableHead className="text-center">Remarks</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="text-center">{request.section}</TableCell>
                <TableCell className="text-center">{request.station}</TableCell>
                <TableCell className="text-center">{request.line}</TableCell>
                <TableCell className="text-center">{request.workType}</TableCell>
                <TableCell className="text-center">{request.blockType}</TableCell>
                <TableCell className="text-center">{request.date}</TableCell>
                <TableCell className="text-center">{request.startTime}</TableCell>
                <TableCell className="text-center">{request.endTime}</TableCell>
                <TableCell className="text-center">{request.remarks}</TableCell>
                <TableCell className="text-center">{request.status}</TableCell>
                <TableCell>
                    <Link href={`/edit/${request.id}`} className="flex items-center">
                    <Button className="bg-blue-500 h-10 w-10" ><Pencil className="bg-transparent w-6 h-6" /></Button></Link>
                </TableCell>
                <TableCell><Link  href={`/edit/${request.id}`}>
                <Button className="bg-red-500 h-10 w-10"><Trash2 className="bg-transparent w-6 h-6" /></Button></Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};

export default RequestTable;
