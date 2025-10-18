'use client';

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TextField, Box, TablePagination, Typography, Button
} from '@mui/material';
import { UserData, RootState, deleteRow, addRow } from '@/redux/features/tableSlice';
import ManageColumnsModal from './ManageColumnsModal';
import ImportExportButtons from './ImportExportButtons';
import EditableCell from './EditableCell'; 
import ThemeToggle from './ThemeToggle'; 

// --- Helper Functions for Sorting (Required for Core Feature 1) ---
type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) { return -1; }
  if (b[orderBy] > b[orderBy]) { return 1; }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key: string]: any }, b: { [key: string]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
// --- End Helper Functions ---


export default function DataTable() {
  const dispatch = useDispatch();
  const { data, columns } = useSelector((state: RootState) => state.table);
  
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof UserData>('Name');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const visibleColumns = useMemo(() => columns.filter(col => col.visible), [columns]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return data.filter(row =>
      visibleColumns.some(col => {
        const value = row[col.id as keyof UserData];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerCaseSearchTerm);
      })
    );
  }, [data, searchTerm, visibleColumns]);

  const sortedData = useMemo(() => {
    return stableSort(filteredData, getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const handleRequestSort = (property: keyof UserData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => { setPage(newPage); };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRow = (id: string) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
        dispatch(deleteRow(id));
    }
  }

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Data Table Manager
      </Typography>

      {/* Control Panel: Search, Manage Columns, Import/Export, Theme Toggle */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}> 
        
        {/* Theme Toggle (Bonus) */}
        <ThemeToggle /> 

        {/* Global Search Input (Correct Alignment) */}
        <TextField
          label="Global Search"
          variant="outlined"
          sx={{ flexGrow: 1 }} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Button to open Manage Columns Modal */}
        <Button 
          variant="contained" 
          onClick={() => setIsModalOpen(true)}
          sx={{ whiteSpace: 'nowrap', flexShrink: 0 }} 
        >
          Manage Columns
        </Button>
        
        {/* Button to Add a New Row (Bonus Feature) */}
        <Button 
          variant="contained" 
          onClick={() => dispatch(addRow())} 
          color="success"
          sx={{ whiteSpace: 'nowrap', flexShrink: 0 }} 
        >
          Add New Row
        </Button>
        
        {/* Import/Export Buttons */}
        <ImportExportButtons /> 

      </Box>

      <Paper>
        {/* FIX 1: Fully responsive design via horizontal scroll */}
        <TableContainer sx={{ overflowX: 'auto' }}> 
          {/* FIX 2: ABSOLUTELY NO SPACE OR NEWLINE HERE TO AVOID HYDRATION ERROR */}
          <Table stickyHeader sx={{ minWidth: 700 }}> 
            <TableHead>
              <TableRow>
                {/* Render visible columns and sortable headers */}
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id as keyof UserData)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell> 
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row) => {
                const isEditing = row.id === editingRowId;
                return (
                  <TableRow hover key={row.id}>
                    {/* Render Editable Cells */}
                    {visibleColumns.map((column) => (
                      <EditableCell
                        key={column.id}
                        row={row}
                        column={column}
                        isEditing={isEditing}
                      />
                    ))}
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {/* Row actions: Edit, Delete, Save, Cancel */}
                      {isEditing ? (
                          <>
                            <Button onClick={() => setEditingRowId(null)} size="small">Save</Button>
                            <Button onClick={() => setEditingRowId(null)} size="small" color="error">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={() => { setEditingRowId(row.id); }} size="small">Edit</Button>
                            <Button 
                                onClick={() => handleDeleteRow(row.id)} 
                                size="small" 
                                color="error"
                            >
                                Delete
                            </Button>
                          </>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Show empty rows if the page is not full */}
              {rowsPerPage - paginatedData.length > 0 && (
                Array.from({ length: rowsPerPage - paginatedData.length }).map((_, index) => (
                  <TableRow key={`empty-${index}`} style={{ height: 53 }}>
                    <TableCell colSpan={visibleColumns.length + 1} />
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Manage Columns Modal */}
      <ManageColumnsModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </Box>
  );
}