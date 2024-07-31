'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
  const router = useRouter();

  useEffect(() => {
    const getReportData = async () => {
      const data = await fetchReportData();
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
              <tr key={student.id} className="border-2 border-gray-700 hover:bg-gray-400  cursor-pointer" onClick={()=>router.push(`/student/${student.id}`)}>
                <td className="py-3 px-6 text-left border border-gray-700" >{student.id}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.name}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.loanamt}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.amount_received}</td>
                <td className="py-3 px-6 text-left border border-gray-700">{student.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-8 text-sm">**click on the student&apos;s name to view their complete profile</p>
      </div>
    </div>
  );
};

export default ReportPage;
