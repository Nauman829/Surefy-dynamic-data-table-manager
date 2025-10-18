'use client';

import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Papa from 'papaparse'; 
import { saveAs } from 'file-saver'; 
import { RootState, importData, UserData } from '@/redux/features/tableSlice';

export default function ImportExportButtons() {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data, columns } = useSelector((state: RootState) => state.table);
  const visibleColumns = columns.filter(col => col.visible);

  // --- CSV Export Logic ---
  const handleExportCSV = () => {
    const exportData = data.map(row => {
      const newRow: Record<string, any> = {};
      visibleColumns.forEach(col => {
        newRow[col.label] = row[col.id]; 
      });
      return newRow;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data_table_export.csv'); 
  };

  // --- CSV Import Logic ---
  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const importedRows: any[] = results.data;
          
          const requiredFields = ['Name', 'Email', 'Age', 'Role'];
          const headers = results.meta.fields || [];

          if (!requiredFields.every(field => headers.includes(field))) {
            alert("Error: Invalid CSV format. Missing required columns (Name, Email, Age, Role).");
            return;
          }

          const formattedData: UserData[] = importedRows.map((row, index) => ({
            id: `imported-${Date.now()}-${index}`, 
            Name: row.Name || '',
            Email: row.Email || '',
            Age: parseInt(row.Age) || 0,
            Role: row.Role || '',
            Department: row.Department,
            Location: row.Location,
          }));

          dispatch(importData(formattedData));
          alert(`Successfully imported ${formattedData.length} rows.`);
        },
        error: (error: Error) => {
          alert(`CSV Parsing Error: ${error.message}`);
        }
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFileChange}
        accept=".csv"
        style={{ display: 'none' }}
      />
      
      <Tooltip title="Import data from a CSV file">
        <Button 
          variant="contained" 
          onClick={triggerFileInput} 
          startIcon={<FileUploadIcon />}
          color="secondary"
          sx={{ flexShrink: 0 }}
        >
          Import CSV
        </Button>
      </Tooltip>

      <Tooltip title="Export current table view to CSV">
        <Button 
          variant="outlined" 
          onClick={handleExportCSV} 
          startIcon={<FileDownloadIcon />}
          sx={{ flexShrink: 0 }}
        >
          Export CSV
        </Button>
      </Tooltip>
    </Box>
  );
}