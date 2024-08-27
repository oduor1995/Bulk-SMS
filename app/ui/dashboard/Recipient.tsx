'use client';
import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { environment } from '@/environment/environment';
import { useRowId } from '@/app/rowIdContext';
import InfoIcon from '@mui/icons-material/Info';

export const RecipientTable = ({ recipients }) => {
  const dynamicColumns =
    recipients.length > 0 && recipients[0].recipientData
      ? Object.keys(recipients[0].recipientData).map(
          (key) => recipients[0].recipientData[key].key,
        )
      : [];
  return (
    <TableContainer component={Paper}>
      <Table aria-label="recipient table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>SMS Group</TableCell>
            {/* Render dynamic column headers */}
            {dynamicColumns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {recipients.map((recipient) => (
            <TableRow key={recipient.id}>
              <TableCell>{recipient.id}</TableCell>
              <TableCell>{recipient.phoneNumber}</TableCell>
              <TableCell>
                {new Date(recipient.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>{recipient.smsGroup.name}</TableCell>
              {/* Render recipient-specific data */}
              {dynamicColumns.map((column, index) => (
                <TableCell key={index}>
                  {recipient.recipientData.find((data) => data.key === column)
                    ?.value || ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const TableComponent = () => {
  const local_core = environment.local_core;
  const authToken = localStorage.getItem('accessToken');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [recipients, setRecipients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const { selectedRowId } = useRowId();
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    // Fetch recipients data from the API endpoint
    const fetchRecipients = async () => {
      try {
        // Construct the URL with query parameters
        const groupId = selectedRowId; // Example groupId
        const page = 0; // Example page number
        const size = 10; // Example page size
        const url = `${local_core}/api/v1/sms-campaign-group/recipients?groupId=${groupId}&page=${page}&size=${size}`;
        console.log('Selected row id', selectedRowId);

        setLoading(true); // Set loading to true while fetching data

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        if (data.status) {
          setRecipients(data.data.content);
        } else {
          console.error('Error fetching recipients:', data.message);
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchRecipients();
  }, [authToken, selectedRowId]); // Include authToken in dependency array if it's used inside the effect

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter recipients based on the search query
  const filteredRecipients = recipients.filter((recipient) =>
    recipient.phoneNumber.includes(searchQuery),
  );

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
        Recipient List
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Center the search input
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <TextField
          label="Search by Phone Number"
          variant="outlined"
          sx={{ width: 300 }} // Adjust the width here
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : (
        <React.Fragment>
          {filteredRecipients.length === 0 ? (
            <Typography align="center">
              <InfoIcon sx={{ fontSize: 48, marginBottom: 2 }} />
              No records found.
            </Typography>
          ) : (
            <RecipientTable recipients={filteredRecipients} />
          )}
        </React.Fragment>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Customize rows per page options
        component="div"
        count={filteredRecipients.length} // Total number of rows after filtering
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
