"use client"

// StudentProfile.js
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import students from '../../../data/dummyData';
import { useParams, useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

const StudentProfile = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(students.find(s => s.id === parseInt(studentId)));
  const router = useRouter();

  if (!student) {
    return <div>Student not found</div>;
  }

  const handleExport = () => {
    const {
      studentName, email, currentStudy, courseDuration, courseEndDate,
      initialChqDate, initialBankName, initialChqNo, loanGiven,
      blankChqAmount, blankChqDate, blankChqBankName, blankChqNo,
      mobileStud, mobileFat, mobileMot, pdcChecks
    } = student;

    const mainData = {
      "Sr.": 1,
      "Student Name": studentName,
      "Email": email,
      "Current Study": currentStudy,
      "Course Duration": courseDuration,
      "Course End Date": courseEndDate,
      "Initial Cheque Date": initialChqDate,
      "Initial Bank Name": initialBankName,
      "Initial Cheque Number": initialChqNo,
      "Loan Given": loanGiven,
      "Blank Cheque Amount": blankChqAmount,
      "Blank Cheque Date": blankChqDate,
      "Blank Cheque Bank Name": blankChqBankName,
      "Blank Cheque Number": blankChqNo,
      "Student Mobile": mobileStud,
      "Father's Mobile": mobileFat,
      "Mother's Mobile": mobileMot,
    };

    const header = [
      "Sr.", "Student Name", "Email", "Current Study", "Course Duration", "Course End Date",
      "Initial Cheque Date", "Initial Bank Name", "Initial Cheque Number", "Loan Given",
      "PDC Cheque Amount", "PDC Cheque Number", "PDC Bank Name", "PDC Cheque Date",
      "Blank Cheque Amount", "Blank Cheque Date", "Blank Cheque Bank Name", "Blank Cheque Number",
      "Student Mobile", "Father's Mobile", "Mother's Mobile"
    ];

    const pdcData = pdcChecks.map((check, index) => ({
      "PDC Cheque Amount": check.pdcAmount,
      "PDC Cheque Number": check.pdcChqNo,
      "PDC Bank Name": check.pdcBankName,
      "PDC Cheque Date": check.pdcChqDate
    }));

    const rows = [mainData];

    pdcData.forEach((pdc) => {
      rows.push({
        "Sr.": '',
        "Student Name": '',
        "Email": '',
        "Current Study": '',
        "Course Duration": '',
        "Course End Date": '',
        "Initial Cheque Date": '',
        "Initial Bank Name": '',
        "Initial Cheque Number": '',
        "Loan Given": '',
        ...pdc,
        "Blank Cheque Amount": '',
        "Blank Cheque Date": '',
        "Blank Cheque Bank Name": '',
        "Blank Cheque Number": '',
        "Student Mobile": '',
        "Father's Mobile": '',
        "Mother's Mobile": ''
      });
    });

    const ws = XLSX.utils.json_to_sheet(rows, { header });

    const getMaxWidth = (arr, header) => {
      const maxLength = Math.max(...arr.map(val => (val ? val.toString().length : 0)));
      return Math.max(maxLength, header.length) * 6;
    };

    const getMaxHeight = (rows) => {
      const maxLineCount = Math.max(...rows.map(row => Object.values(row).reduce((maxLines, cell) => {
        const cellLines = (cell ? cell.toString().split('\n').length : 1);
        return Math.max(maxLines, cellLines);
      }, 1)));
      return maxLineCount * 20;
    };

    ws['!cols'] = header.map((h, i) => ({
      wpx: getMaxWidth(rows.map(row => row[h]), h)
    }));

    ws['!rows'] = rows.map(() => ({
      hpx: getMaxHeight(rows)
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StudentData");
    XLSX.writeFile(wb, "StudentData.xlsx");
  };

  const handleSendReminder = () => {
    // Implement your reminder sending logic here
    toast.success(`Reminder sent to ${student.studentName}`);
  };

  const handleCollected = (studentId, chqNo) => {
    // Mark PDC cheque as collected
    const updatedStudent = {
      ...student,
      pdcChecks: student.pdcChecks.map(check =>
        check.pdcChqNo === chqNo ? { ...check, collected: true } : check
      )
    }
    setStudent(updatedStudent);
    toast.success('PDC Cheque collected');
  };

  const handleUndo = (studentId, chqNo) => {
    const updatedStudent = {
      ...student,
          pdcChecks: student.pdcChecks.map(check =>
            check.pdcChqNo === chqNo ? { ...check, collected: false } : check
          )
    }
    setStudent(updatedStudent);
    toast.info('PDC Cheque collection undone');

  }


  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <button
        onClick={() => router.push('/')}
        className="mb-4 ml-4   py-2 px-4 rounded   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      > 
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center">Student Profile: {student.studentName}</h1>
      <div className=" shadow-2xl rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Current Study:</strong> {student.currentStudy}</p>
            <p><strong>Course Duration:</strong> {student.courseDuration}</p>
            <p><strong>Course End Date:</strong> {student.courseEndDate}</p>
            <p><strong>Loan Given:</strong> {student.loanGiven}</p>
            <p><strong>Student Mobile:</strong> {student.mobileStud}</p>
            <p><strong>Father&apos;s Mobile:</strong> {student.mobileFat}</p>
            <p><strong>Mother&apos;s Mobile:</strong> {student.mobileMot}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">Initial Cheque Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Cheque Date:</strong> {student.initialChqDate}</p>
            <p><strong>Bank Name:</strong> {student.initialBankName}</p>
            <p><strong>Cheque Number:</strong> {student.initialChqNo}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">Blank Cheque Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Cheque Amount:</strong> {student.blankChqAmount}</p>
            <p><strong>Cheque Date:</strong> {student.blankChqDate}</p>
            <p><strong>Bank Name:</strong> {student.blankChqBankName}</p>
            <p><strong>Cheque Number:</strong> {student.blankChqNo}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">PDC Cheques</h2>
          {student.pdcChecks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {student.pdcChecks.map((check, index) => (
                <div key={index} className="border border-slate-400 rounded-lg p-4 ">
                  <p><strong>Cheque Amount:</strong> {check.pdcAmount}</p>
                  <p><strong>Cheque Number:</strong> {check.pdcChqNo}</p>
                  <p><strong>Bank Name:</strong> {check.pdcBankName}</p>
                  <p><strong>Cheque Date:</strong> {check.pdcChqDate}</p>
                  <button
                    onClick={() => handleCollected(student.id, check.pdcChqNo)}
                    className={`mr-2 mt-2 px-2 py-1 ${check.collected ? "bg-green-400" : "bg-red-400"} text-white rounded`}
                    disabled={check.collected}
                  >
                    {check?.collected == true ? "Collected" : "Collect"}
                  </button>
                  {check?.collected && (
                    <button
                      onClick={() => handleUndo(student.id, check.pdcChqNo)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded"
                    >
                      Undo
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No PDC Cheques available.</p>
          )}
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mr-2"
        >
          Export to Excel
        </button>
        <button
          onClick={handleSendReminder}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Send Reminder
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
