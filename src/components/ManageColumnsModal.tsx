'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form'; // Use React Hook Form
import {
  Modal, Box, Typography, Button, Checkbox, FormControlLabel, FormGroup, Divider, TextField
} from '@mui/material';
import { RootState, toggleColumnVisibility, addColumn, UserData } from '@/redux/features/tableSlice';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450, // Increased width for the form
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// Define form input types
interface ColumnFormInput {
  label: string;
}

export default function ManageColumnsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.table.columns);
  
  // Initialize React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ColumnFormInput>();

  const handleToggle = (columnId: keyof UserData) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const onSubmit: SubmitHandler<ColumnFormInput> = (data) => {
    // 1. Create a unique ID from the label (e.g., "Office Extension" -> "OfficeExtension")
    const columnId = data.label.replace(/\s+/g, '');

    // 2. Dispatch the new action to add the column
    // This addresses the PDF requirement to "Add new fields" [cite: 15]
    dispatch(addColumn({ id: columnId, label: data.label }));
    
    // 3. Reset the form and alert user
    reset();
    alert(`New column "${data.label}" added and is now visible.`);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Manage Columns
        </Typography>

        {/* 1. Add New Column Section (Implements "Add new fields" requirement [cite: 15]) */}
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
          Add New Field
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <TextField
            {...register("label", { required: "Label is required" })}
            label="New Column Label"
            error={!!errors.label}
            helperText={errors.label ? errors.label.message : 'e.g., "Office Extension"'}
            size="small"
            fullWidth
          />
          <Button type="submit" variant="contained" color="success" sx={{ whiteSpace: 'nowrap' }}>
            Add
          </Button>
        </form>
        <Divider sx={{ my: 2 }} />


        {/* 2. Show/Hide Existing Columns Section */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Show/Hide Existing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Changes are persisted in localStorage.
        </Typography>

        <FormGroup sx={{ maxHeight: 200, overflowY: 'auto', pr: 2 }}>
          {/* Show/hide existing columns using checkboxes [cite: 17] */}
          {columns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox 
                  checked={column.visible} 
                  onChange={() => handleToggle(column.id)} 
                  name={column.label} 
                />
              }
              label={column.label}
              disabled={['Name', 'Email', 'Age', 'Role'].includes(column.id) && column.visible}
            />
          ))}
        </FormGroup>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}