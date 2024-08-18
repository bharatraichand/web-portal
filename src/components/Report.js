'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const fetchReportData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/students/report/');
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.report;
  } catch (error) {
    console.error('Error fetching report data:', error);
    return [];
  }
};

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const router = useRouter();

  const handleExport = (students) => {
    const rows = [];

    // Create headers
    const header = [
      "Sr.", "Student Name",
      "Loan Amount",
      "Amount Received",
      "Balance"
    ];

    students.forEach((student, index) => {
      const {
        id,
        balance, amount_received, loanamt,
        name,
      } = student;

      // Create the main row with basic student information
      const mainData = {
        "Sr.": index + 1,
        "Student Name": name,
        "Loan Amount": loanamt,
        "Amount Received": amount_received,
        "Balance": balance
      };

      // Add main row to the rows array
      rows.push(mainData);
    });

    // Convert the rows to a worksheet
    const ws = XLSX.utils.json_to_sheet(rows, { header });

    // Function to calculate the maximum width of a column
    const getMaxWidth = (arr, header) => {
      const maxLength = Math.max(...arr.map(val => (val ? val.toString().length : 0)));
      return Math.max(maxLength, header.length) * 6; // Multiply by 10 to get the width in pixels
    };

    // Function to calculate the maximum height of a row
    const getMaxHeight = (rows) => {
      const maxLineCount = Math.max(...rows.map(row => Object.values(row).reduce((maxLines, cell) => {
        const cellLines = (cell ? cell.toString().split('\n').length : 1);
        return Math.max(maxLines, cellLines);
      }, 1)));
      return maxLineCount * 20; // Multiply by 20 to get the height in pixels
    };

    // Set column widths dynamically based on content
    ws['!cols'] = header.map((h, i) => ({
      wpx: getMaxWidth(rows.map(row => row[h]), h)
    }));

    // Set row heights dynamically based on content
    ws['!rows'] = rows.map(() => ({
      hpx: getMaxHeight(rows)
    }));

    // Apply horizontal alignment to headers
    header.forEach((h, i) => {
      ws[XLSX.utils.encode_cell({ c: i, r: 0 })].s = {
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        }
      };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ReportData");
    XLSX.writeFile(wb, "ReportData.xlsx");
  };

  useEffect(() => {
    const getReportData = async () => {
      const data = await fetchReportData();
      let totalLA = 0;
      let totalAR = 0;
      let totalB = 0;
      data?.forEach(element => {
        totalLA += parseInt(element?.loanamt)
        totalAR += parseInt(element?.amount_received)
        totalB += parseInt(element?.balance)
      });
      setTotalAmountReceived(totalAR);
      setTotalLoanAmount(totalLA)
      setTotalBalance(totalB)
      setReportData(data);
    };
    getReportData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.push('/')}
        className="mb-4 -ml-3   py-2 px-4 rounded   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Loan Report</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full ">
          <thead>
            <tr className="border-2 border-gray-700  uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border border-gray-700">ID</th>
              <th className="py-3 px-6 text-left border border-gray-700">Name</th>
              <th className="py-3 px-6 text-left border border-gray-700">Loan Amount</th>
              <th className="py-3 px-6 text-left border border-gray-700">Amount Received</th>
              <th className="py-3 px-6 text-left border border-gray-700">Balance</th>
            </tr>
          </thead>
          <tbody className=" text-sm font-light">
            {reportData.map((student) => (
              <tr key={student.id} className="border-2 border-gray-700 hover:bg-gray-400  cursor-pointer" onClick={() => router.push(`/student/${student.id}`)}>
                <td className="py-3 px-6 text-left border border-gray-700" >{student.id}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.name}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.loanamt}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.amount_received}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between">
          <div><p className='mt-6'><strong>Total Loan Amount:</strong>{totalLoanAmount}</p>
            <p className='mt-2'><strong>Total Amount Received:</strong>{totalAmountReceived}</p>
            <p className='mt-2'><strong>Total Balance:</strong>{totalBalance}</p>
          </div><div>
            <button
              onClick={() => handleExport(reportData)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Export to Excel
            </button>
          </div>

        </div>
        <p className="mt-8 text-sm">**click on the student&apos;s name to view their complete profile</p></div>
    </div>
  );
};

export default ReportPage;
