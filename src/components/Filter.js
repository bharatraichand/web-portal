"use client"

import React, { useState, useEffect } from 'react';
import dummyData from '../data/dummyData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import useStudentsData from '@/functions/useStudentsData';
import axios from 'axios';

const Filter = () => {
  let {students,setStudents} = useStudentsData();
  const [oldStudents, setOldStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showPDC, setShowPDC] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pdcAmount, setPdcAmount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    // Load dummy data
    setFilteredStudents(students);
  }, []);

  useEffect(()=>{
    if(filteredStudents?.length==0)setFilteredStudents(students)
    setOldStudents(students);
  },[students])

  const handleCollected = async (studentId, chqNo) => {
    try {
      // Find the PDC ID from the student data
      const student = filteredStudents.find(student => student.id === studentId);
      const pdcCheck = student?.pdcChecks.find(check => check.pdcChqNo === chqNo);

      if (!pdcCheck) {
        toast.error('PDC Cheque not found');
        return;
      }

      // Update PDC state in the backend
      await axios.post('http://localhost:8000/api/pdc/update_state/', { pdc_id: pdcCheck?.pdcId });

      // Update the local state
      const updatedFilteredStudents = filteredStudents.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            pdcChecks: student.pdcChecks.map(check =>
              check.pdcChqNo === chqNo ? { ...check, collected: true } : check
            )
          };
        }
        return student;
      });

      const updatedStudents = students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            pdcChecks: student.pdcChecks.map(check =>
              check.pdcChqNo === chqNo ? { ...check, collected: true } : check
            )
          };
        }
        return student;
      }); 

      setFilteredStudents(updatedFilteredStudents);
      setStudents(updatedStudents)
      calculateTotalPDCForMonth(updatedStudents)
      toast.success('PDC Cheque collected');
    } catch (error) {
      toast.error('Error updating PDC Cheque state');
    }
  };

  const handleUndo = async (studentId, chqNo) => {
    try {
      // Find the PDC ID from the student data
      const student = filteredStudents.find(student => student.id === studentId);
      const pdcCheck = student?.pdcChecks.find(check => check.pdcChqNo === chqNo);

      if (!pdcCheck) {
        toast.error('PDC Cheque not found');
        return;
      }

      // Update PDC state in the backend
      await axios.post('http://localhost:8000/api/pdc/update_state/', { pdc_id: pdcCheck?.pdcId });

      // Update the local state
      const updatedFilteredStudents = filteredStudents.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            pdcChecks: student.pdcChecks.map(check =>
              check.pdcChqNo === chqNo ? { ...check, collected: false } : check
            )
          };
        }
        return student;
      });

      const updatedStudents = students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            pdcChecks: student.pdcChecks.map(check =>
              check.pdcChqNo === chqNo ? { ...check, collected: false } : check
            )
          };
        }
        return student;
      });

      setFilteredStudents(updatedFilteredStudents);
      setStudents(updatedStudents)
      calculateTotalPDCForMonth(updatedStudents)
      toast.info('PDC Cheque collection undone');
    } catch (error) {
      toast.error('Error undoing PDC Cheque collection');
    }
  };

  const handleTogglePDC = (id) => {
    setShowPDC(prevShowPDC => ({
      ...prevShowPDC,
      [id]: !prevShowPDC[id]
    }));
  };

  const handleExport = (students) => {
    const rows = [];

    // Create headers
    const header = [
      "Sr.", "Student Name", "Email", "Current Study", "Course Duration", "Course End Date",
      "Initial Cheque Date", "Initial Bank Name", "Initial Cheque Number", "Loan Given",
      "PDC Cheque Amount", "PDC Cheque Number", "PDC Bank Name", "PDC Cheque Date","PDC Remarks","PDC Chq Given Name",
      "Sec. Dep. Chq Amount", "Sec. Dep. Chq Date", "Sec. Dep. Chq Bank Name", "Sec. Dep. Chq Number",
      "Student Mobile", "Father's Name",  "Father's Mobile",  "Father's Email",
      "Mother's Name","Mother's Mobile","Mother's Email",
    ];

    students.forEach((student, index) => {
      const {
        studentName, email, currentStudy, courseDuration, courseEndDate,
        initialChqDate, initialBankName, initialChqNo, loanGiven,
        blankChqAmount, blankChqDate, blankChqBankName, blankChqNo,
        mobileStud, mobileFat, mobileMot, pdcChecks, motEmail, fatEmail, motName, fatName
      } = student;

      // Create the main row with basic student information
      const mainData = {
        "Sr.": index + 1,
        "Student Name": studentName,
        "Email": email,
        "Current Study": currentStudy,
        "Course Duration": courseDuration,
        "Course End Date": courseEndDate,
        "Initial Cheque Date": initialChqDate,
        "Initial Bank Name": initialBankName,
        "Initial Cheque Number": initialChqNo,
        "Loan Given": loanGiven,
        "Sec. Dep. Chq Amount": blankChqAmount,
        "Sec. Dep. Chq Date": blankChqDate,
        "Sec. Dep. Chq Bank Name": blankChqBankName,
        "Sec. Dep. Chq Number": blankChqNo,
        "Student Mobile": mobileStud,
        "Father's Name":fatName,
        "Father's Email":fatEmail,
        "Father's Mobile": mobileFat,
        "Mother's Name":motName,
        "Mother's Email":motEmail,
        "Mother's Mobile": mobileMot,
      };

      // Add main row to the rows array
      rows.push(mainData);

      // Create an array for the PDC data, to be added to the main row
      const pdcData = pdcChecks.map((check, index) => ({
        "PDC Cheque Amount": check.pdcAmount,
        "PDC Cheque Number": check.pdcChqNo,
        "PDC Bank Name": check.pdcBankName,
        "PDC Cheque Date": check.pdcChqDate,
        "PDC Remarks": check?.pdcRemark,
        "PDC Chq Given Name": check?.pdcGivenName,
      }));

      // Add PDC data as separate rows with empty values for non-PDC fields
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
          "Sec. Dep. Chq Amount": '',
          "Sec. Dep. Chq Date": '',
          "Sec. Dep. Chq Bank Name": '',
          "Sec. Dep. Chq Number": '',
          "Student Mobile": '',
          "Father's Name":'',
          "Father's Mobile": '',
          "Father's Email":'',
          "Mother's Name":'',
          "Mother's Mobile": '',
          "Mother's Email":'',
        });
      });
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
    XLSX.utils.book_append_sheet(wb, ws, "StudentData");
    XLSX.writeFile(wb, "StudentData.xlsx");
  };

  const calculateTotalPDCForMonth = (studs) => {
    const startOfMonth = new Date(startDate);
    const endOfMonth = new Date(endDate);
    let total = 0;

    studs.forEach(student => {
      student.pdcChecks.forEach(check => {
        const [day, month, year] = check.pdcChqDate.split('/');
        const checkDate = new Date(`${month}/${day}/${year}`);
        if (checkDate >= startOfMonth && checkDate <= endOfMonth && !check.collected) {
          total += check.pdcAmount;
        }
      });
    });

    setPdcAmount(total);
  };

  const filterStudentsByDate = (students, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if(startDate!='' && endDate!=''){
        return students.filter(student => {
            return student.pdcChecks.some(check => {
              const [day, month, year] = check.pdcChqDate.split('/');
              const checkDate = new Date(`${month}/${day}/${year}`);
              return checkDate >= start && checkDate <= end;
            });
          });
    }

    else return students;
    
  };

  const handleFilterByDate = () => {
    const filtered = filterStudentsByDate(students, startDate, endDate);
    setFilteredStudents(filtered);
  };

  useEffect(()=>{
    if(startDate!='' && endDate!=''){
        handleFilterByDate();
        calculateTotalPDCForMonth(students);
    }
    else if(startDate=='' && endDate==''){
        setFilteredStudents(oldStudents);
        calculateTotalPDCForMonth(students);
    }
  },[startDate,endDate])

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <button
        onClick={() => router.push('/')}
        className="mb-4 -ml-3   py-2 px-4 rounded   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      > 
        &larr; Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Student Filter</h1>
      <div className="mb-4">
        <span className="font-bold">Total PDC Amount between the selected dates: </span>
        {pdcAmount}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between p-4  rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
          <label className="flex flex-col md:flex-row items-start md:items-center w-full">
            <span className="text-gray-400 font-medium mb-2 md:mb-0 md:mr-2">From Date:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="flex flex-col md:flex-row items-start md:items-center w-full">
            <span className="text-gray-400 font-medium mb-2 md:mb-0 md:mr-2">To Date:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <button
            onClick={()=>{
                setStartDate('');
                setEndDate('');
            }}
            className="w-full md:w-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Remove Filter
          </button>
          {/* <button
            onClick={handleFilterByDate}
            className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Filter
          </button> */}
        </div>
      </div>

      <table className="min-w-full border-collapse border-2" >
        <thead>
          <tr>
            <th className="border-2 border-slate-400 px-4 py-2">Student Name</th>
            <th className="border-2 border-slate-400 px-0 py-2">Course End Date(mm/yyyy)</th>
            <th className="border-2 border-slate-400 px-4 py-2">Loan Given (Amount)</th>
            <th className="border-2 border-slate-400 px-0 py-2">PDC Cheques</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td className="border-2 border-slate-400 px-4 py-2 cursor-pointer" onClick={() => router.push(`/student/${student.id}`)}>{student.studentName}</td>
              <td className="border-2 border-slate-400 px-4 py-2">{student.courseEndDate}</td>
              <td className="border-2 border-slate-400 px-4 py-2">{student.loanGiven}</td>
              <td className="border-2 border-slate-400 px-4 py-2 ">
                <button
                  onClick={() => handleTogglePDC(student.id)}
                  className="px-4 py-2 bg-gray-400 rounded"
                >
                  {showPDC[student.id] ? "Hide" : "Show"} PDC Cheques
                </button>
                {showPDC[student.id] && (
                  <div className="mt-2 ">
                    {student.pdcChecks.map(check => {
                        const [day, month, year] = check.pdcChqDate.split('/');
                        const checkDate = new Date(`${month}/${day}/${year}`);
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        if ((startDate=='' || endDate=='') || (startDate!='' && endDate!='' && checkDate >= start && checkDate <= end)) {
                        
                        return(
                      <div key={check.pdcChqNo} className="mb-2 flex space-x-4">
                        <div>
                          <span className="block">Amount: {check.pdcAmount}</span>
                        </div>
                        <div>
                          <span className="block">Cheque Date: {check.pdcChqDate}</span>
                        </div>
                        <button
                          onClick={() => handleCollected(student.id, check.pdcChqNo)}
                          className={`mr-2 px-2 py-1 ${check.collected ? "bg-green-400" : "bg-red-400"} text-white rounded`}
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
                    )
                    }
                })
                }
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-8 text-sm">**click on the student&apos;s name to view their complete profile</p>
    </div>
  );
};

export default Filter;
