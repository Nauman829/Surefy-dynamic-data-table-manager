'use client';
import React, { useState, useEffect } from 'react';
import { TableCell, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateRow, UserData, ColumnConfig } from '@/redux/features/tableSlice';

interface EditableCellProps {
  row: UserData;
  column: ColumnConfig;
  isEditing: boolean;
}

export default function EditableCell({ row, column, isEditing }: EditableCellProps) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(String(row[column.id] || ''));
  const [localEditing, setLocalEditing] = useState(false);

  useEffect(() => {
    setValue(String(row[column.id] || ''));
  }, [row, column.id]);

  const handleDoubleClick = () => {
    // Double-click to edit fields inline (Bonus Feature)
    if (!isEditing && column.id !== 'id') { 
        setLocalEditing(true);
    }
  };

  const validateInput = (field: keyof UserData, inputValue: string): boolean => {
    if (field === 'Age') {
      const num = parseInt(inputValue);
      // Validate inputs (e.g., age must be a number)
      return !isNaN(num) && num >= 0; 
    }
    return true; 
  };

  const handleBlur = () => {
    if (localEditing) {
      if (!validateInput(column.id, value)) {
        alert(`Validation Error: ${column.label} must be a valid number.`);
        setValue(String(row[column.id] || '')); // Revert to original value
      } else {
        if (String(row[column.id]) !== value) {
            dispatch(updateRow({ id: row.id, field: column.id, value: column.id === 'Age' ? parseInt(value) : value }));
        }
      }
      setLocalEditing(false);
    }
  };

  const activeEditing = isEditing || localEditing;

  return (
    <TableCell 
      onDoubleClick={handleDoubleClick} 
      sx={{ bgcolor: activeEditing ? 'action.hover' : 'inherit', cursor: 'pointer' }}
    >
      {activeEditing ? (
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          size="small"
          type={column.id === 'Age' ? 'number' : 'text'}
          fullWidth
        />
      ) : (
        String(row[column.id])
      )}
    </TableCell>
  );
}