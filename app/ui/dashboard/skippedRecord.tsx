import React, { useState, useEffect } from 'react';
import { environment } from '@/environment/environment';
import { useRowId } from '@/app/rowIdContext';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
} from '@mui/material';

export const SkippedRecordsTable = () => {
  const { selectedRowId } = useRowId();
  const local_core = environment.local_core;
  const authToken = localStorage.getItem('accessToken');
  const [skippedRecords, setSkippedRecords] = useState([]);

  useEffect(() => {
    // Fetch skipped records data from the API endpoint
    const fetchSkippedRecords = async () => {
      try {
        const groupId = selectedRowId;
        const size = 10;
        const page = 0;
        const url = `${local_core}/api/v1/sms-campaign-group/recipients/skipped?groupId=${groupId}&page=${page}&size=${size}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        if (data.status) {
          setSkippedRecords(data.data.content);
        } else {
          console.error('Error fetching skipped records:', data.message);
        }
      } catch (error) {
        console.error('Error fetching skipped records:', error);
      }
    };

    fetchSkippedRecords();
  }, [authToken]);

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
        Skipped Records
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="skipped records table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skippedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.skippedData.phoneNumber}</TableCell>
                <TableCell>{record.skipError}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
