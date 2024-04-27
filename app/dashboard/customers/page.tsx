'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/app/Shared/Modal';
import { TableLayout } from '@/app/Shared/Tablelayout';
import { Trash2 } from 'react-feather';
import { useGroup } from '@/app/GroupContext';
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
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GroupProfile } from '@/app/ui/dashboard/getGroup';
import { environment } from '@/environment/environment';

export const Customer = () => {
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showEditGroupForm, setShowEditGroupForm] = useState(false);
  const [showImportCustomersForm, setShowImportCustomersForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [data, setData] = useState([]);
  // const { selectedGroup, selectGroup, availableGroups, addGroup } = useGroup();
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const handleGroupNameChange = (e) => {
    setNewGroupName(e.target.value);
  };
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActions, setShowActions] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to hold any errors
  const [uploadResponse, setUploadResponse] = useState(null);

  // const handleAddGroup = () => {
  //   const newGroup = {
  //     groupName: newGroupName,
  //     totalCustomers: 0,
  //     createdDate: new Date().toLocaleDateString(),
  //   };

  //   setData([...data, newGroup]);
  //   setNewGroupName('');

  //   // Update the list of available groups in the context
  //   addGroup(newGroupName);

  //   // Use the selectGroup function to update the selected group in the context
  //   selectGroup(newGroupName);
  //   setShowAddGroupForm(false);
  // };

  useEffect(() => {
    // Fetch data from the database when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once, on mount

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(
        'https://api-finserve-dev.finserve.africa/core/api/v1/get/sms-campaign-group',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const Data = await response.json();
      const formattedData = Data.data.content.map((item: any) => ({
        id: item.id,
        groupName: item.name,
        totalCustomers: item.createdBy,
        createdDate: new Date(item.createdAt).toLocaleString('en-US', {
          // Format according to your preference
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }),
      }));
      console.log('This is the data', formattedData);

      const availableGroupsData = Data.data.content.map((group: any) => ({
        id: group.id,
        name: group.name,
      }));
      console.log('Available Groups:', availableGroupsData);

      setAvailableGroups(availableGroupsData);
      console.log('These are the available groups:', availableGroupsData);

      setRows(formattedData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const dev_core_url = environment.dev_core_url;

  const handleFileUpload = async () => {
    const fileInput = document.getElementById(
      'fileInput',
    ) as HTMLInputElement | null;

    if (!fileInput) {
      console.error('File input element not found.');
      return;
    }

    const file = fileInput.files?.[0];

    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', selectedGroup.id);

    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(
        `${dev_core_url}/api/v1/upload/sms-recipients-file`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUploadResponse(data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      // Close the modal after handling the file upload
      setShowImportCustomersForm(false);
    }
  };
  const handleEdit = (id: number) => {
    // setEditRowId(id);
    setShowEditGroupForm(true);

    console.log('Edit row with ID:', id);

    const authToken = localStorage.getItem('token');
  };
  const editGroup = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(
        `${dev_core_url}/api/v1/edit/sms-campaign-group/${id}`,
        {
          method: 'PUT', // Assuming your API uses PUT for updating data
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to edit the group');
      }

      // Optionally, handle success response
      console.log('Group edited successfully');

      // You might want to update the UI with the edited group name
      // Fetch data again to get the updated group list
      fetchData();
    } catch (error) {
      console.error('Error editing group:', error);
      // Optionally, handle error
    }
  };
  const test = () => {
    console.timeLog('am fine');
  };

  const handleImportCustomers = () => {
    // Set the state to indicate that the modal should be shown
    setShowImportCustomersForm(true);
  };

  const handleDelete = (index) => {
    const updatedData = [...data];
    const deletedGroup = updatedData[index].groupName;

    // Remove the item at the specified index
    updatedData.splice(index, 1);
    setData(updatedData);
    console.log('Deleted group:', deletedGroup);

    // If the deleted group is the selected group, set selectedGroup to null
    if (selectedGroup === deletedGroup) {
      selectGroup(null);
    }
  };
  const addRow = () => {
    setShowAddGroupForm(true);
  };
  const editgroup = () => {
    setShowEditGroupForm(true);
  };

  const handleAddGroup = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return; // Handle the absence of token as per your application's logic
    }

    const newGroup = {
      id: rows.length + 1, // Assuming 'rows' is your state that tracks groups
      groupName: newGroupName, // Assuming 'newGroupName' is the new group's name input from state
      totalCustomers: 0,
      createdDate: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch(
        'http://localhost:8082/api/v1/create/sms-campaign-group',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: newGroupName }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to create the group');
      }

      // Optionally, you can use the API response data if it includes the newly created group details
      const result = await response.json();

      // Update local state with the new group
      setRows([...rows, newGroup]);
      setNewGroupName('');

      // Update the list of available groups in the context
      addGroup(newGroupName);

      // Use the selectGroup function to update the selected group in the context
      selectGroup(newGroupName);
      setShowAddGroupForm(false);
    } catch (error) {
      console.error('Error adding group:', error);
      // Optionally handle the error in UI, such as showing an error message
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };
  const handleEditClick = (id) => {
    // Logic for handling edit action
    console.log('Edit clicked for id:', id);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '10px', // Add margin between buttons and table
        }}
      >
        {/* Add Group Modal */}
        <Modal
          title="Add Group"
          isOpen={showAddGroupForm}
          setIsOpen={setShowAddGroupForm}
        >
          <div style={{ padding: '16px' }}>
            <label>Enter Group Name:</label>
            <input
              type="text"
              value={newGroupName}
              onChange={handleGroupNameChange}
              style={{
                borderWidth: '1px',
                borderColor: '#3498db',
                borderRadius: '4px',
                padding: '8px',
                outline: 'none',
                width: '100%',
              }}
              placeholder="Group Name"
            />
            <button
              className="mt-10 cursor-pointer rounded bg-red-500 px-4 py-2 font-bold text-white outline-none hover:bg-red-700"
              onClick={handleAddGroup}
            >
              Add Group
            </button>
          </div>
        </Modal>

        {/* Import Customers Modal */}
        <Modal
          title="Import Customers"
          isOpen={showImportCustomersForm}
          setIsOpen={setShowImportCustomersForm}
        >
          <div style={{ padding: '16px' }}>
            <label>Select Group:</label>
            <select
              value={selectedGroup ? selectedGroup.id : ''} // Use selectedGroup.id as the value
              onChange={(e) => {
                const selectedGroupId = e.target.value;
                // Find the selected group from availableGroups using its ID
                const selectedGroup = availableGroups.find((group) => {
                  return group.id.toString() === selectedGroupId;
                });
                console.log('selected group', selectedGroup);

                // Update selectedGroup state with the selected group
                setSelectedGroup(selectedGroup);
              }}
              style={{
                borderWidth: '1px',
                borderColor: '#3498db',
                borderRadius: '4px',
                padding: '8px',
                outline: 'none',
                marginBottom: '10px',
              }}
            >
              <option value="" disabled>
                Choose a group...
              </option>
              {availableGroups.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>

            <label>Choose File:</label>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              id="fileInput"
              style={{ marginBottom: '10px' }}
            />

            <button
              style={{
                backgroundColor: '#3498db',
                color: '#fff',
                borderRadius: '4px',
                padding: '8px',
                cursor: 'pointer',
                outline: 'none',
              }}
              onClick={handleFileUpload}
            >
              Import Customers
            </button>
          </div>
        </Modal>
        {/* edit group modal */}
        {showEditGroupForm && (
          <Modal
            title="Edit Group"
            isOpen={showEditGroupForm}
            setIsOpen={setShowEditGroupForm}
          >
            <div style={{ padding: '16px' }}>
              <label>Enter Group Name:</label>
              <input
                type="text"
                value={newGroupName}
                onChange={handleGroupNameChange}
                style={{
                  borderWidth: '1px',
                  borderColor: '#3498db',
                  borderRadius: '4px',
                  padding: '8px',
                  outline: 'none',
                  width: '100%',
                }}
                placeholder="Group Name"
              />
              <button
                className="mt-10 cursor-pointer rounded bg-red-500 px-4 py-2 font-bold text-white outline-none hover:bg-red-700"
                onClick={test}
              >
                Edit group
              </button>
            </div>
          </Modal>
        )}
        {/* Add Customer Group Button */}
        {/* <button
          className="rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-800"
          onClick={() => setShowAddGroupForm(true)}
        >
          <span>Add Customer Group</span>
        </button> */}

        {/* Import Customers Button */}
        <label
          style={{
            backgroundColor: '#ebf8ff',
            color: '#3498db',
            borderWidth: '1px',
            borderColor: '#bee3f8',
            borderRadius: '4px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            outline: 'none',
          }}
          onClick={() => setShowImportCustomersForm(true)}
        >
          <span>Import Customers</span>
        </label>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          style={{ display: 'none' }}
          onChange={() => setShowImportCustomersForm(true)}
        />
      </div>
      <div>
        <div></div>
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={addRow}
            style={{ backgroundColor: 'gray' }}
          >
            Add Group
          </Button>
          {uploadResponse && (
            <div className="mt-4 rounded-lg border border-gray-300 bg-gray-100 p-4">
              <h3 className="mb-2 text-lg text-blue-500">Upload Response:</h3>
              <pre className="overflow-auto rounded-lg border border-gray-200 bg-white p-3">
                {JSON.stringify(uploadResponse, null, 2)}
              </pre>
            </div>
          )}
          {/* <GroupProfile /> */}
          <TableContainer component={Paper}>
            <Table aria-label="dynamic table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < rows.length
                      }
                      checked={
                        rows.length > 0 && selected.length === rows.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                  </TableCell>
                  <TableCell>Group Name</TableCell>
                  <TableCell>Creator</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.groupName}
                        </TableCell>
                        <TableCell>{row.totalCustomers}</TableCell>
                        <TableCell>{row.createdDate}</TableCell>
                        <TableCell>
                          <div className="relative">
                            <div className="bg-blue absolute right-0 top-0 mt-2 rounded p-2 shadow-lg ">
                              {showActions === row.id && (
                                <>
                                  <MenuItem
                                    onClick={() => handleEdit(row.id)}
                                    sx={{
                                      backgroundColor: 'gray',
                                      '&:hover': { backgroundColor: 'blue' },
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row selection
                                      deleteRow(row.id);
                                    }}
                                    sx={{
                                      backgroundColor: 'gray',
                                      '&:hover': { backgroundColor: 'red' },
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleactivate(row.id)}
                                    sx={{
                                      backgroundColor: 'gray',
                                      '&:hover': { backgroundColor: 'green' },
                                    }}
                                  >
                                    Activate user
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      backgroundColor: 'gray',
                                      '&:hover': { backgroundColor: 'orange' },
                                    }}
                                  >
                                    Deactivate user
                                  </MenuItem>
                                </>
                              )}
                            </div>
                            <IconButton
                              aria-label="actions"
                              onClick={() =>
                                setShowActions(
                                  showActions === row.id ? null : row.id,
                                )
                              }
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Customer;
