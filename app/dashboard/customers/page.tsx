'use client';
import React, { useState, useEffect, use } from 'react';
import { Modal } from '@/app/Shared/Modal';
import { TableLayout } from '@/app/Shared/Tablelayout';
import { Trash2 } from 'react-feather';
import { useGroup, GroupProvider } from '@/app/GroupContext';
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
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GroupProfile } from '@/app/ui/dashboard/getGroup';
import { environment } from '@/environment/environment';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { SimpleSnackbar } from '@/app/ui/dashboard/snackBar';
import { CheckCircle, Cancel } from '@mui/icons-material'; // Import icons for activation status
import { TableComponent } from '@/app/ui/dashboard/Recipient';
import { useRowId } from '@/app/rowIdContext';
import { RowIdProvider } from '@/app/rowIdContext';
import { useRouter } from 'next/navigation';
export const Customer = () => {
  // const authToken = localStorage.getItem('accessToken');
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showEditGroupForm, setShowEditGroupForm] = useState(false);
  const [showImportCustomersForm, setShowImportCustomersForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [data, setData] = useState([]);
  // const { selectedGroup, selectGroup, availableGroups, addGroup } = useGroup();
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleGroupNameChange = (e) => {
    setNewGroupName(e.target.value);
  };
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActions, setShowActions] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to hold any errors
  const [uploadResponse, setUploadResponse] = useState(null);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const { selectedRowId, setSelectedRow } = useRowId();
  const [groupsData, setGroupsData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [showMenu, setShowMenu] = useState(null); // State to control the visibility of the menu
  const local_user = environment.local_user;
  const dev_core = environment.dev_core_url;
  const dev_url = environment.dev_url;
  const local_core = environment.local_core;

  const router = useRouter();

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
  const closeMenu = () => {
    setShowMenu(null);
  };

  useEffect(() => {
    // Fetch data from the database when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(
        `${local_core}/api/v1/get/sms-campaign-group`,
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
      setGroupsData(Data.data.content);
      const formattedData = Data.data.content.map((item: any) => ({
        id: item.id,
        groupName: item.name,
        activationStatus: item.status.name,
        createdDate: new Date(item.createdAt).toLocaleString('en-US', {
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

  useEffect(() => {
    // Fetch recipients data from the API endpoint
    const fetchRecipients = async (rowId: number) => {
      try {
        const response = await fetch(
          '{{local_url}}/api/v1/sms-campaign-group/recipients?groupId=1&page=0&size=10',
        );
        const data = await response.json();
        if (data.status) {
          setRecipients(data.data.content);
        } else {
          console.error('Error fetching recipients:', data.message);
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };

    fetchRecipients();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run effect only once on mount

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
        `${local_core}/api/v1/upload/sms-recipients-file`,
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

      fetchData();
      const data = await response.json();
      setUploadResponse(data.message);
      setOpenSnackbar(true);
      setSnackbarMessage('File uploaded Successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      // Close the modal after handling the file upload
      setShowImportCustomersForm(false);
    }
  };
  const handleEdit = (id: any) => {
    // Find the group object with the given id
    const groupToEdit = rows.find((group) => group.id === id);

    // Set the new group name based on the group to edit
    setNewGroupName(groupToEdit.groupName);

    // Set the selected group to the group being edited
    setSelectedGroup(groupToEdit);

    // Open the edit group modal
    setShowEditGroupForm(true);
    setAnchorEl(null);
    // setShowActions(null);
  };
  const groupDeactivate = async (groupId: any) => {
    const authToken = localStorage.getItem('accessToken');
    console.log('This is the  selectedRowId  ', selectedRowId);
    try {
      const response = await fetch(
        `${local_core}/api/v1/deactivate/sms-campaign-group/${groupId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (response.ok) {
        setAnchorEl(null);
        setShowActions(null);
        setSnackbarMessage('Group deactivated successfully');
        setOpenSnackbar(true);
      } else {
        console.error('Failed to activate group:', response.statusText);
      }
    } catch (error) {
      console.error('Error activating group:', error);
    }
    fetchData();
  };
  const groupActivate = async (groupId: any) => {
    try {
      const response = await fetch(
        `${local_core}/api/v1/activate/sms-campaign-group/${groupId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (response.ok) {
        setAnchorEl(null);
        setShowActions(null);
        setSnackbarMessage('Group activated successfully');
        setOpenSnackbar(true);
      } else {
        console.error('Failed to activate group:', response.statusText);
      }
    } catch (error) {
      console.error('Error activating group:', error);
    }
    fetchData();
  };
  const editGroup = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('This is the selected group', selectedGroup);
      const response = await fetch(
        `${local_core}/api/v1/edit/sms-campaign-group`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: selectedGroup.id,
            name: newGroupName,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to edit the group');
      }

      // Optionally, handle success response
      console.log('Group edited successfully');

      // Fetch data again to get the updated group list
      fetchData();
      setAnchorEl(null);
      setShowActions(null);
      setShowEditGroupForm(false);
      setSnackbarMessage('Group edited successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error editing group:', error);
      setSnackbarMessage('Error editing group. Please try again.');
      setOpenSnackbar(true);
    }
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

  const handleGetFileInfo = (rowId: number) => {
    const group = groupsData?.find((group: any) => group.id === rowId);

    if (group && group.fileInfo) {
      console.log('File Info:', group.fileInfo);
      setFileInfo(group.fileInfo);
      setAnchorEl(null);
      setShowActions(null);
    } else {
      console.error('No file information available for this group.');
      setFileInfo(false);
      setAnchorEl(null);
    }
  };

  const getFileInfo = (row: any) => {
    setSelectedRow(row.id);
    router.push('/dashboard/RecipientTable');
  };

  const getSkippedRecords = (row: any) => {
    setSelectedRow(row.id);
    router.push('/dashboard/skippedRecords');
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
    const dev_core_url = environment.dev_core_url;

    try {
      const response = await fetch(
        `${local_core}/api/v1/create/sms-campaign-group`,
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

      // Update local state with the new group
      fetchData();
      setRows([...rows, newGroup]);
      setNewGroupName('');
      setShowAddGroupForm(false);
      setSnackbarMessage('Group Created successfully');
      setOpenSnackbar(true);
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
  const deleteRow = async (id) => {
    const accessToken = localStorage.getItem('accessToken');
    const url = `${dev_core_url}/api/v1/delete/sms-campaign-group/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete the row with ID ${id}: ${response.status}`,
        );
      }

      // If the delete was successful, filter out the row from the UI
      setRows((rows) => rows.filter((row) => row.id !== id));
      console.log(`Row with ID ${id} was deleted successfully.`);
    } catch (error) {
      console.error('Error deleting row:', error);
      // Optionally, show a user-friendly error message on the UI
    }
  };
  const handleEditClick = (id) => {
    // Logic for handling edit action
    console.log('Edit clicked for id:', id);
  };

  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we add a snack
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an old snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

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
                onClick={() => editGroup()}
              >
                Edit group
              </button>
            </div>
          </Modal>
        )}
        <Modal
          title="File Uploaded"
          isOpen={fileInfo !== null} // Pass whether the modal should be open based on whether fileInfo is available
          setIsOpen={() => setFileInfo(null)} // Set fileInfo to null to close the modal
        >
          {/* Render the file information inside the modal */}
          {fileInfo ? (
            <div style={{ padding: '16px' }}>
              <h2>File Information</h2>
              <p>File Name: {fileInfo.fileName}</p>
              <p>File Type: {fileInfo.fileMimetype}</p>
              <p>Read Records: {fileInfo.readRecordsCount}</p>
              <p>Saved Records: {fileInfo.savedRecordsCount}</p>
              <p>Skipped Records: {fileInfo.skippedRecordsCount}</p>
              {/* Add more file information fields as needed */}
            </div>
          ) : (
            <div>
              {/* Render the UI when fileInfo is null */}
              <p>No file information available.</p>
              {/* You can add additional content or components here */}
            </div>
          )}
        </Modal>

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
            <SimpleSnackbar
              open={openSnackbar}
              setOpen={setOpenSnackbar}
              message={snackbarMessage}
              severity="success"
            />
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
                  <TableCell>Activation Status</TableCell>
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
                        <TableCell>
                          {/* Display activation status with icons */}
                          {row.activationStatus === 'Active' ? (
                            <CheckCircle style={{ color: 'green' }} />
                          ) : (
                            <Cancel style={{ color: 'red' }} />
                          )}
                          {/* {row.activationStatus} */}
                        </TableCell>
                        <TableCell>{row.createdDate}</TableCell>
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
                                open={Boolean(
                                  anchorEl && showActions === row.id,
                                )} // Open menu only if anchorEl is not null and showActions matches row id
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
                                      Edit
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
                                      Delete
                                    </MenuItem>
                                    <MenuItem
                                      onClick={(event) => {
                                        groupActivate(row.id);
                                        setShowMenu(null); // Close the menu when clicked
                                      }}
                                      sx={{
                                        backgroundColor: 'white',
                                        '&:hover': { backgroundColor: 'gray' },
                                      }}
                                    >
                                      Activate Group
                                    </MenuItem>
                                    <MenuItem
                                      onClick={(event) => {
                                        groupDeactivate(row.id);
                                        setShowMenu(null); // Close the menu when clicked
                                      }}
                                      sx={{
                                        backgroundColor: 'white',
                                        '&:hover': { backgroundColor: 'gray' },
                                      }}
                                    >
                                      Deactivate Group
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        handleGetFileInfo(row.id);
                                        setShowMenu(null);
                                      }}
                                      sx={{
                                        backgroundColor: 'white',
                                        '&:hover': { backgroundColor: 'gray' },
                                      }}
                                    >
                                      File Summary
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => getFileInfo(row)}
                                      sx={{
                                        backgroundColor: 'white',
                                        '&:hover': { backgroundColor: 'gray' },
                                      }}
                                    >
                                      Recipient List
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => getSkippedRecords(row)}
                                      sx={{
                                        backgroundColor: 'white',
                                        '&:hover': { backgroundColor: 'gray' },
                                      }}
                                    >
                                      Skipped Records
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
