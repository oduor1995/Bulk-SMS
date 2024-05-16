'use client';
import React, { useState } from 'react';
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

function SmsCampaign() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActions, setShowActions] = useState(null);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleEdit = (id) => {
    console.log('Edit', id);
    // Implementation for edit here
  };

  const deleteRow = (id) => {
    console.log('Delete', id);
    // Implementation for delete here
  };

  const handleActivate = (id) => {
    console.log('Activate Group', id);
    // Implementation for activation here
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="dynamic table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                />
              </TableCell>
              <TableCell>Campaign Name</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Sender ID</TableCell>
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
                        {showActions === row.id && (
                          <div className="bg-blue absolute right-0 top-0 mt-2 rounded p-2 shadow-lg">
                            <MenuItem
                              onClick={() => handleEdit(row.id)}
                              sx={{ '&:hover': { backgroundColor: 'blue' } }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRow(row.id);
                              }}
                              sx={{ '&:hover': { backgroundColor: 'red' } }}
                            >
                              Delete
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleActivate(row.id)}
                              sx={{ '&:hover': { backgroundColor: 'green' } }}
                            >
                              Activate Group
                            </MenuItem>
                          </div>
                        )}
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
  );
}

export default SmsCampaign;
