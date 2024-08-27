'use client';
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CampaignForm } from '@/app/ui/dashboard/CampaignForm';
import { SimpleSnackbar } from '@/app/ui/dashboard/snackBar';
import Menu from '@mui/material/Menu';
import { environment } from '@/environment/environment';
import { CheckCircle, Cancel, CheckCircleOutline } from '@mui/icons-material';
import { ConfirmationDialog } from '@/app/ui/dashboard/ConfirmationDialogue';
import { EditCampaignForm } from '@/app/ui/dashboard/editCampaignForm';

function SmsCampaign() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActions, setShowActions] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null); // To store the action to be confirmed
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [campaignToActOn, setCampaignToActOn] = useState(null); // To store the campaign for which action is to be confirmed
  const [showEditForm, setShowEditForm] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const local_core = environment.local_core;
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${local_core}/api/v1/sms-campaigns`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const Data = await response.json();
      const formattedData = Data.data.content.map((item) => ({
        id: item.id,
        campaignName: item.campaignName,
        message: item.message,
        senderId: item.senderID.senderID,
        campaignStatus: item.status.name,
      }));
      console.log(formattedData);
      setRows(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    const campaign = rows.find((row) => row.id === id);
    setCampaignToEdit(campaign);
    setShowEditForm(true);
  };

  const confirmDeleteRow = (id) => {
    setCampaignToDelete(id);
    setDialogAction('delete');
    setOpenDialog(true);
  };

  const deleteRow = async () => {
    const local_core = environment.local_core;
    const authToken = localStorage.getItem('accessToken');
    setOpenDialog(false);

    try {
      const response = await fetch(
        `${local_core}/api/v1/sms-campaign/delete/${campaignToDelete}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        setSnackbarMessage('Campaign Deleted Successfully');
        setOpenSnackbar(true);
        fetchData(); // Refresh the data after deletion
      } else {
        throw new Error('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const confirmAction = (id, action) => {
    setCampaignToActOn(id);
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleActionConfirm = async () => {
    const local_core = environment.local_core;
    const authToken = localStorage.getItem('accessToken');
    setOpenDialog(false);

    try {
      let response;
      switch (dialogAction) {
        case 'activate':
          response = await fetch(
            `${local_core}/api/v1/sms-campaign/activate/${campaignToActOn}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
          break;
        case 'deactivate':
          response = await fetch(
            `${local_core}/api/v1/sms-campaign/deactivate/${campaignToActOn}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          );
          break;
        case 'run':
          response = await fetch(`${local_core}/api/v1/run-sms-campaign`, {
            method: 'POST',
            body: JSON.stringify({ campaignId: campaignToActOn }),
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
          break;
        default:
          break;
      }

      if (response && response.ok) {
        setSnackbarMessage(`Campaign ${dialogAction}d successfully`);
        setSnackbarSeverity('success');
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || `Failed to ${dialogAction} campaign`;
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
      }
      setOpenSnackbar(true);
      fetchData(); // Refresh the data after action
    } catch (error) {
      console.error(`Error ${dialogAction}ing campaign:`, error);
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = (newRow) => {
    setIsFormOpen(false);
    setShowEditForm(false);
    setOpenSnackbar(true);
    setSnackbarMessage('Campaign Created/Edited Successfully');
    fetchData();
  };

  return (
    <div>
      {!isFormOpen && !showEditForm && (
        <>
          <button
            onClick={openForm}
            className="rounded border border-red-300 px-4 py-2"
          >
            Add Campaign
          </button>
          <TableContainer component={Paper}>
            <Table>
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
                    />
                  </TableCell>
                  <TableCell>Campaign Name</TableCell>
                  <TableCell>Sender ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${row.id}`;

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
                          {row.campaignName}
                        </TableCell>
                        <TableCell>{row.senderId}</TableCell>
                        <TableCell>
                          {row.campaignStatus === 'Active' ? (
                            <CheckCircle style={{ color: 'green' }} />
                          ) : row.campaignStatus === 'Completed' ? (
                            <CheckCircleOutline style={{ color: 'blue' }} />
                          ) : (
                            <Cancel style={{ color: 'red' }} />
                          )}
                          {row.campaignStatus}
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <IconButton
                              aria-label="actions"
                              onClick={(event) => {
                                setAnchorEl(event.currentTarget);
                                setShowActions(row.id);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl && showActions === row.id)}
                              onClose={() => {
                                setAnchorEl(null);
                                setShowActions(null);
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
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      confirmAction(row.id, 'activate');
                                      setShowMenu(null);
                                    }}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Activate Campaign
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleEdit(row.id)}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Edit Campaign
                                  </MenuItem>
                                  <MenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmDeleteRow(row.id);
                                    }}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Delete Campaign
                                  </MenuItem>
                                  <MenuItem
                                    onClick={(event) => {
                                      confirmAction(row.id, 'deactivate');
                                      setShowMenu(null);
                                    }}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Deactivate Campaign
                                  </MenuItem>
                                  <MenuItem
                                    onClick={(event) => {
                                      confirmAction(row.id, 'run');
                                      setShowMenu(null);
                                    }}
                                    sx={{
                                      backgroundColor: 'white',
                                      '&:hover': { backgroundColor: 'gray' },
                                    }}
                                  >
                                    Run Campaign
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
        </>
      )}
      {showEditForm && (
        <EditCampaignForm
          campaign={campaignToEdit}
          onSubmitSuccess={closeForm}
        />
      )}
      {isFormOpen && <CampaignForm onSubmitSuccess={closeForm} />}
      <SimpleSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <ConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={dialogAction === 'delete' ? deleteRow : handleActionConfirm}
        title="confirm"
        description={`Are you sure you want to ${dialogAction} this campaign?`}
      />
    </div>
  );
}

export default SmsCampaign;
