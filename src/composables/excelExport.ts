import * as XLSX from "xlsx";
import { useToast } from '@/components/ui/toast'

// Export to Excel function
const exportToExcel = async (value: any) => {
    const { toast } = useToast();

    toast({
      description: 'Extracting excel from table....',
      variant: 'loading'
    })
    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(value);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WeeshTableData");

    // Export the workbook to a file
    XLSX.writeFile(workbook, "WeeshData.xlsx");
    toast({
        description: 'Excel file is ready',
        variant: 'success',
      })
};

export default exportToExcel;