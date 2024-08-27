'use client';
import React, { use, useState } from 'react';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { UserForm } from '@/app/ui/dashboard/RegistrationForm';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import { UserIcon } from '@heroicons/react/24/outline';
import { setFlagsFromString } from 'v8';
import { EditUserForm } from '@/app/ui/dashboard/EditUserForm';
import { env, seteuid } from 'process';
import { useEffect } from 'react';
import { environment } from '@/environment/environment';
import Menu from '@mui/material/Menu';
import { SimpleSnackbar } from '@/app/ui/dashboard/snackBar';

function CustomTable() {
  const [clientId, setClientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [editRowId, setEditRowId] = useState();
  const [selectedRowId, setSelectedRowId] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [senderId, setSenderId] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Initialize formData state using useState hook
  const [formData, setFormData] = useState({
    Branch: '',
    Department: 'KE',
    firstName: '',
    lastName: '',
    emailAddress: '',
    senderIds: [],
    roleCode: '',
  });
  const dev_core_url = environment.dev_core_url;

  const [rows, setRows] = useState<any>([
    {
      id: 1,
      name: 'collins oduor',
      email: 'collins@example.com',
      department: 'IT',
      branch: 'Finserve',
      userGroup: 'Admin',
      status: 'Active',
    },
    // Initial row data
  ]);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const authToken = `Bearer ${token}`;

      try {
        const response = await fetch(`${dev_core_url}/api/v1/client-users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dev_core_url]);

  const handleClick = () => {
    setShowForm(true);
    setShowTable(false);
  };

  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  const addNewRow = async (formData: any) => {
    setSelectedRowId(rows.id);
    const token = localStorage.getItem('accessToken');
    const decoded: any = jwtDecode(token);
    const account = decoded.account;
    const authToken = localStorage.getItem('accessToken');
    const decodeAccount = (account: any) => {
      const decodedAccount = atob(account); // Decode base64 string
      return decodedAccount; // Return decoded account string
    };
    const decodedAccount = decodeAccount(account);
    const clientId = decodedAccount;
    console.log('Client ID:', clientId);
    const local_user = environment.local_core;
    const dev_url = environment.dev_url;

    try {
      // Call the API to create a new user
      const response = await fetch(`${dev_url}/api/v1/create/client/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      // Parse the API response to get the newly created user data
      const newUser = await response.json();

      // Add the new user to the rows state
      setRows([...rows, newUser]);

      // Optionally close the form and show the table
      setShowForm(false);
      setShowEditUserForm(false);
      setShowTable(true);
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error behavior here, such as displaying an error message
    }
  };

  const handleEdit = async (formData: any, id: any) => {
    setEditRowId(id);
    setShowEditUserForm(true);
    setShowTable(false);
    console.log('Edit row with ID:', id);

    // Retrieve the authorization token from local storage
    const authToken = localStorage.getItem('accessToken');

    try {
      // Make the API call to update user data
      const response = await fetch(
        'https://api-finserve-dev.finserve.africa/user-manager/api/v1/edit/client/user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`, // Attach authorization token
          },
          body: JSON.stringify({ ...formData }),
        },
      );

      if (response.ok) {
        // Handle success behavior here, like redirecting or showing a success message
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Set error message state
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error behavior here
    }
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
    console.log('Delete row with ID:', id);
  };
  const handleactivate = (id) => {
    console.log('user activated');
  };

  return (
    <>
      <div className="container mx-auto max-w-4xl rounded-lg border p-6">
        <div className=" mb-4 flex h-12 justify-end bg-gray-500">
          <button
            onClick={handleClick}
            className=" mr-4 mt-2 h-8 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            + Add New User
          </button>
        </div>
        {showForm && <UserForm onSubmit={(formData) => addNewRow(formData)} />}
        {showEditUserForm && (
          <EditUserForm onSubmit={handleEdit} id={editRowId} />
        )}
        {showTable && (
          <div className="relative overflow-x-auto">
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>User Email</TableCell>
                    <TableCell>User Group</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.userGroup}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>
                        <TableCell>
                          <div className="relative">
                            <IconButton
                              aria-label="actions"
                              onClick={(event) => {
                                setAnchorEl(event.currentTarget); // Set anchorEl to the current target
                                setShowActions(row.id); // Set showActions to the row id
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl && showActions === row.id)} // Open menu only if anchorEl is not null and showActions matches row id
                              onClose={() => {
                                setAnchorEl(null); // Reset anchorEl when closing the menu
                                setShowActions(null); // Reset showActions when closing the menu
                              }}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              PaperProps={{
                                sx: {
                                  marginTop: '-8px',
                                },
                              }}
                            >
                              {showActions === row.id && (
                                <div className="">
                                  <MenuItem
                                    onClick={() => handleEdit(row.id)}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Edit User
                                  </MenuItem>
                                  <MenuItem
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row selection
                                      deleteRow(row.id);
                                    }}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Delete User
                                  </MenuItem>
                                  <MenuItem
                                    onClick={(event) => {
                                      userActivate(row.id);
                                      setShowMenu(null); // Close the menu when clicked
                                    }}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Activate User
                                  </MenuItem>
                                  <MenuItem
                                    onClick={(event) => {
                                      userDeactivate(row.id);
                                      console.log('This is the row id', row.id);
                                      setShowMenu(null); // Close the menu when clicked
                                    }}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Deactivate User
                                  </MenuItem>
                                </div>
                              )}
                            </Menu>
                            <SimpleSnackbar
                              open={openSnackbar}
                              setOpen={setOpenSnackbar}
                              message={snackbarMessage}
                              severity="success"
                            />
                          </div>
                        </TableCell>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </>
  );
}

export default CustomTable;
