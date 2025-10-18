import DataTable from '@/components/DataTable';
import { Container } from '@mui/material'; // Import Container

export default function Home() {
  return (
    <main>
      {/* Use the Container component for responsive padding and max-width */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <DataTable />
      </Container>
    </main>
  );
}