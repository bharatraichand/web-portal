"use client"

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import useStudentsData from '@/functions/useStudentsData';
import axios from 'axios';
import AddPDC from './AddPDC';
import UpdatePDC from './UpdatePDC';
import Swal from 'sweetalert2';

const StudentProfile = ({studentId}) => {
  let {students} = useStudentsData();
  const [student, setStudent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCheck, setCurrentCheck] = useState(null);
  const router = useRouter();

  useEffect(()=>{
    setStudent(students.find(s => s.id == parseInt(studentId)))
  },[students])

  if (!student) {
    return <div>Student not found</div>;
  }

  const handleExport = () => {
    const {
      id, studentName, email, currentStudy, courseDuration, courseEndDate,
      initialChqDate, initialBankName, initialChqNo, loanGiven,
      blankChqAmount, blankChqDate, blankChqBankName, blankChqNo,
      mobileStud, mobileFat, mobileMot, pdcChecks,motEmail, fatEmail, motName, fatName
    } = student;

    const mainData = {
      "Sr.": id,
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

    const header = [
      "Sr.", "Student Name", "Email", "Current Study", "Course Duration", "Course End Date",
      "Initial Cheque Date", "Initial Bank Name", "Initial Cheque Number", "Loan Given",
      "PDC Cheque Amount", "PDC Cheque Number", "PDC Bank Name", "PDC Cheque Date",
      "Sec. Dep. Chq Amount", "Sec. Dep. Chq Date", "Sec. Dep. Chq Bank Name", "Sec. Dep. Chq Number",
      "Student Mobile","Father's Name",  "Father's Mobile",  "Father's Email",
      "Mother's Name","Mother's Mobile","Mother's Email",
    ];

    const pdcData = pdcChecks.map((check, index) => ({
      
      "PDC Cheque Amount": check.pdcAmount,
      "PDC Cheque Number": check.pdcChqNo,
      "PDC Bank Name": check.pdcBankName,
      "PDC Cheque Date": check.pdcChqDate,
      "PDC Remarks": check?.pdcRemark,
      "PDC Chq Given Name": check?.pdcGivenName,
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

  const handleCollected = async ( chqNo) => {

    try {
      // Find the PDC ID from the student data
      const pdcCheck = student?.pdcChecks.find(check => check.pdcChqNo === chqNo);
  
      if (!pdcCheck) {
        toast.error('PDC Cheque not found');
        return;
      }
  
      // Update PDC state in the backend
      await axios.post('http://localhost:8000/api/pdc/update_state/', { pdc_id: pdcCheck?.pdcId });
  
      // Update the local state
      const updatedStudent = {
        ...student,
        pdcChecks: student.pdcChecks.map(check =>
          check.pdcChqNo === chqNo ? { ...check, collected: true } : check
        )
      }
      setStudent(updatedStudent);
      toast.success('PDC Cheque collected');
    } catch (error) {
      console.log(error)
      toast.error('Error updating PDC Cheque state');
    }

  };

  const handleUndo = async ( chqNo) => {
    
    try {
      // Find the PDC ID from the student data
      const pdcCheck = student?.pdcChecks.find(check => check.pdcChqNo === chqNo);
  
      if (!pdcCheck) {
        toast.error('PDC Cheque not found');
        return;
      }
  
      // Update PDC state in the backend
      await axios.post('http://localhost:8000/api/pdc/update_state/', { pdc_id: pdcCheck?.pdcId });
  
      // Update the local state
      const updatedStudent = {
        ...student,
            pdcChecks: student.pdcChecks.map(check =>
              check.pdcChqNo === chqNo ? { ...check, collected: false } : check
            )
      }
      setStudent(updatedStudent);
      toast.info('PDC Cheque collection undone');
    } catch (error) {
      toast.error('Error undoing PDC Cheque collection');
    }

  }
  const handleDelete =  (pdc_id) => {
    Swal.fire({ 
        title: 'Are you sure, you want to delete?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            const response= axios.post('http://localhost:8000/api/pdc/delete_pdc/', { pdc_id: pdc_id  });
            window.location.reload();
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            );
        }
    });
};
  const handleEdit = (check) => {
    setCurrentCheck(check); 
   setIsEdit(true);
};

const handleAddPdc = async () => {
  setIsOpen(true);
}
const handleOnClose = () => {
  setIsOpen(false);
}
const handleEditClose  = () => {
  setIsEdit(false);
  setCurrentCheck(null);

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
      <h1 className="text-3xl font-bold mb-6 text-center">Student Profile: {student?.studentName}</h1>
        <button className='px-4 py-2 bg-green-400 text-white rounded float-right'
        onClick =  {handleAddPdc}
        >Add PDC Cheque</button>
        {isOpen && <AddPDC isOpen={isOpen} onClose={handleOnClose} general_id={parseInt(studentId)}/>}
      <div className=" shadow-2xl rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Email:</strong> {student?.email}</p>
            <p><strong>Current Study:</strong> {student?.currentStudy}</p>
            <p><strong>Course Duration:</strong> {student?.courseDuration}</p>
            <p><strong>Course End Date:</strong> {student?.courseEndDate}</p>
            <p><strong>Loan Given:</strong> {student?.loanGiven}</p>
            <p><strong>Student Mobile:</strong> {student?.mobileStud}</p>
            <p><strong>Father&apos;s Mobile:</strong> {student?.mobileFat}</p>
            <p><strong>Mother&apos;s Mobile:</strong> {student?.mobileMot}</p>
            <p><strong>Father&apos;s Name:</strong> {student?.fatName}</p>
            <p><strong>Mother&apos;s Name:</strong> {student?.motName}</p>
            <p><strong>Father&apos;s Email:</strong> {student?.fathersEmail}</p>
            <p><strong>Mother&apos;s Email:</strong> {student?.mothersEmail}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">Initial Cheque Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Cheque Date:</strong> {student?.initialChqDate}</p>
            <p><strong>Bank Name:</strong> {student?.initialBankName}</p>
            <p><strong>Cheque Number:</strong> {student?.initialChqNo}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">Sec. Dep. Chq Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Cheque Amount:</strong> {student?.blankChqAmount}</p>
            <p><strong>Cheque Date:</strong> {student?.blankChqDate}</p>
            <p><strong>Bank Name:</strong> {student?.blankChqBankName}</p>
            <p><strong>Cheque Number:</strong> {student?.blankChqNo}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold border-b border-slate-400 pb-2 mb-4">PDC Cheques</h2>
          {student?.pdcChecks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {student?.pdcChecks.map((check, index) => (
                <div key={index} className="border border-slate-400 rounded-lg p-4">
                  <p><strong>Cheque Amount:</strong> {check?.pdcAmount}</p>
                  <p><strong>Cheque Number:</strong> {check?.pdcChqNo}</p>
                  <p><strong>Bank Name:</strong> {check?.pdcBankName}</p>
                  <p><strong>Cheque Date:</strong> {check?.pdcChqDate}</p>
                  <p><strong>Cheque Remarks:</strong>{check?.pdcRemark}</p>
                  <p><strong>Cheque Given Name:</strong>{check?.pdcGivenName}</p>
                  
                  <button
                    onClick={() => handleCollected( check.pdcChqNo)}
                    className={`mr-2 mt-2 px-2 py-1 ${check.collected ? "bg-green-400" : "bg-blue-400"} text-white rounded`}
                    disabled={check.collected}
                  >
                    {check?.collected == true ? "Collected" : "Collect"}
                  </button>
                  {check?.collected && (
                    <button
                      onClick={() => handleUndo( check.pdcChqNo)}
                      className="px-2 py-1 mr-2 bg-orange-400 text-white rounded"
                    >
                      Undo
                    </button>
                  )}
                   <button
                   onClick = {() => handleEdit(check)}
                    className={`mr-2 mt-2 px-2 py-1 bg-yellow-400 text-white rounded`}
                  >
                    Edit
                  </button>
                  {isEdit && currentCheck && (
        <UpdatePDC isOpen={isEdit} onClose={handleEditClose} data={currentCheck} />  // Pass current check to modal
      )}
                  <button
                   onClick = {() => handleDelete(check.pdcId)}
                    className={`mr-2 mt-2 px-2 py-1 bg-red-400 text-white rounded`}
                  >
                    Delete
                  </button>
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
          onClick={()=>router.push(`/update/${student?.id}`)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 mr-2"
        >
          Update Profile
        </button>-
      </div>
    </div>
  );
};

export default StudentProfile;