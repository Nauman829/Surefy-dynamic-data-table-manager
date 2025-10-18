import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the core data structure
export interface UserData {
  id: string;
  Name: string;
  Email: string;
  Age: number;
  Role: string;
  Department?: string; // Optional/Dynamic columns
  Location?: string;   // Optional/Dynamic columns
  // Custom properties added via addColumn will be handled dynamically 
}

// Define the column configuration structure
export interface ColumnConfig {
  id: keyof UserData | string; // Use string to handle custom user-defined keys
  label: string;
  visible: boolean;
  sortable: boolean;
}

// Initial dummy data
const initialData: UserData[] = [
  { id: '1', Name: 'Alice Johnson', Email: 'alice@example.com', Age: 28, Role: 'Developer', Department: 'Tech', Location: 'NY' },
  { id: '2', Name: 'Bob Smith', Email: 'bob@example.com', Age: 45, Role: 'Manager', Department: 'HR', Location: 'SF' },
  { id: '3', Name: 'Charlie Brown', Email: 'charlie@example.com', Age: 22, Role: 'Intern', Department: 'Tech', Location: 'NY' },
  { id: '4', Name: 'Diana Prince', Email: 'diana@example.com', Age: 35, Role: 'Analyst', Department: 'Finance', Location: 'LA' },
  { id: '5', Name: 'Ethan Hunt', Email: 'ethan@example.com', Age: 50, Role: 'Director', Department: 'Operations', Location: 'DC' },
  { id: '6', Name: 'Fiona Glenanne', Email: 'fiona@example.com', Age: 31, Role: 'Engineer', Department: 'Tech', Location: 'SF' },
  { id: '7', Name: 'George Clooney', Email: 'george@example.com', Age: 60, Role: 'Executive', Department: 'Management', Location: 'NY' },
  { id: '8', Name: 'Hannah Montana', Email: 'hannah@example.com', Age: 19, Role: 'Assistant', Department: 'Admin', Location: 'LA' },
  { id: '9', Name: 'Ivy League', Email: 'ivy@example.com', Age: 40, Role: 'Consultant', Department: 'Strategy', Location: 'DC' },
  { id: '10', Name: 'Jake Peralta', Email: 'jake@example.com', Age: 33, Role: 'Detective', Department: 'Security', Location: 'NY' },
  { id: '11', Name: 'Kelly Kapour', Email: 'kelly@example.com', Age: 29, Role: 'Developer', Department: 'Tech', Location: 'SF' },
];

// Initial column setup
const initialColumns: ColumnConfig[] = [
  { id: 'Name', label: 'Name', visible: true, sortable: true },
  { id: 'Email', label: 'Email', visible: true, sortable: true },
  { id: 'Age', label: 'Age', visible: true, sortable: true },
  { id: 'Role', label: 'Role', visible: true, sortable: true },
  { id: 'Department', label: 'Department', visible: false, sortable: true },
  { id: 'Location', label: 'Location', visible: false, sortable: true },
];

interface TableState {
  data: UserData[];
  columns: ColumnConfig[];
}

const initialState: TableState = {
  data: initialData,
  columns: initialColumns,
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    // Core Feature: Dynamic Columns (Show/hide)
    toggleColumnVisibility: (state, action: PayloadAction<keyof UserData>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    // Core Feature: Import CSV
    importData: (state, action: PayloadAction<UserData[]>) => {
      state.data = action.payload;
    },
    // NEW: Dynamic Columns Requirement (Add new fields)
    addColumn: (state, action: PayloadAction<{ id: string, label: string }>) => {
        const { id, label } = action.payload;
        // Check if the column ID already exists to prevent duplication
        if (!state.columns.some(col => col.id === id)) {
            state.columns.push({ 
                id: id as keyof UserData, // Type casting for flexibility
                label: label, 
                visible: true, 
                sortable: true 
            });
        }
    },
    // Bonus Feature: Add New Row
    addRow: (state) => {
        const newId = `new-${Date.now()}`;
        state.data.unshift({ // Add to the beginning of the array
            id: newId, 
            Name: 'New Name',
            Email: '',
            Age: 0,
            Role: '',
        } as UserData); // Cast as UserData
    },
    // Bonus Feature: Inline row editing
    updateRow: (state, action: PayloadAction<{ id: string, field: keyof UserData, value: any }>) => {
      const { id, field, value } = action.payload;
      const row = state.data.find(r => r.id === id);
      if (row) {
        row[field] = value;
      }
    },
    // Bonus Feature: Row actions (Delete)
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(r => r.id !== action.payload);
    },
  },
});

// Ensure all actions are exported, including addColumn and addRow
export const { toggleColumnVisibility, importData, updateRow, deleteRow, addRow, addColumn } = tableSlice.actions;

export default tableSlice.reducer;
export type RootState = {
  table: TableState;
};