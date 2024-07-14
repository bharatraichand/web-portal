"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    currentStudy: '',
    courseDuration: '',
    courseEndDate: '',
    initialChqDate: '',
    initialBankName: '',
    initialChqNo: '',
    loanGiven: '',
    numPDC: 1,
    pdcChecks: [{
      pdcAmount: '',
      pdcChqNo: '',
      pdcBankName: '',
      pdcChqDate: ''
    }],
    blankChqAmount: '',
    blankChqDate: '',
    blankChqBankName: '',
    blankChqNo: '',
    mobileStud: '',
    mobileFat: '',
    mobileMot: ''
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePDCInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPDCChecks = formData.pdcChecks.map((check, idx) =>
      idx === index ? { ...check, [name]: value } : check
    );
    setFormData({ ...formData, pdcChecks: updatedPDCChecks });
  };

  const handleNumPDCChange = (e) => {
    const numPDC = parseInt(e.target.value, 10);
    const pdcChecks = Array.from({ length: numPDC }, () => ({
      pdcAmount: '',
      pdcChqNo: '',
      pdcBankName: '',
      pdcChqDate: ''
    }));
    setFormData({ ...formData, numPDC, pdcChecks });
  };

  const validateMobile = (mobile) => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateChequeNumber = (chqNo) => {
    return chqNo.length >= 6;
  };

  const validateForm = () => {
    const { loanGiven, pdcChecks, mobileStud, mobileFat, mobileMot, email, initialChqNo, blankChqNo } = formData;

    if (!validateEmail(email)) {
      toast.error('Invalid email address.');
      return false;
    }

    if (!validateMobile(mobileStud) || !validateMobile(mobileFat) || !validateMobile(mobileMot)) {
      toast.error('Invalid mobile number. Please enter a 10-digit number.');
      return false;
    }

    if (!validateChequeNumber(initialChqNo) || !validateChequeNumber(blankChqNo) || !pdcChecks.every(check => validateChequeNumber(check.pdcChqNo))) {
      toast.error('Cheque number must be at least 6 digits.');
      return false;
    }

    const totalPDCAmount = pdcChecks.reduce((total, check) => total + parseFloat(check.pdcAmount || 0), 0);
    if (totalPDCAmount !== parseFloat(loanGiven)) {
      toast.error('Total PDC amount must equal the loan amount given.');
      return false;
    }

    const uniqueChequeNumbers = new Set(pdcChecks.map(check => check.pdcChqNo));
    if (uniqueChequeNumbers.size !== pdcChecks.length) {
      toast.error('PDC cheque numbers must be unique.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
      toast.success('Form submitted successfully!');
    }
  };

  const handleExport = () => {
    const {
      studentName, email, currentStudy, courseDuration, courseEndDate,
      initialChqDate, initialBankName, initialChqNo, loanGiven,
      blankChqAmount, blankChqDate, blankChqBankName, blankChqNo,
      mobileStud, mobileFat, mobileMot, pdcChecks
    } = formData;
  
    // Create the main row with basic student information
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
  
    // Create a header for the worksheet
    const header = [
      "Sr.", "Student Name", "Email", "Current Study", "Course Duration", "Course End Date",
      "Initial Cheque Date", "Initial Bank Name", "Initial Cheque Number", "Loan Given",
      "PDC Cheque Amount", "PDC Cheque Number", "PDC Bank Name", "PDC Cheque Date",
      "Blank Cheque Amount", "Blank Cheque Date", "Blank Cheque Bank Name", "Blank Cheque Number",
      "Student Mobile", "Father's Mobile", "Mother's Mobile"
    ];
  
    // Create an array for the PDC data, to be added to the main row
    const pdcData = pdcChecks.map((check, index) => ({
      "PDC Cheque Amount": check.pdcAmount,
      "PDC Cheque Number": check.pdcChqNo,
      "PDC Bank Name": check.pdcBankName,
      "PDC Cheque Date": check.pdcChqDate
    }));
  
    // Create an array to hold the rows
    const rows = [mainData];
  
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
        "Blank Cheque Amount": '',
        "Blank Cheque Date": '',
        "Blank Cheque Bank Name": '',
        "Blank Cheque Number": '',
        "Student Mobile": '',
        "Father's Mobile": '',
        "Mother's Mobile": ''
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
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StudentData");
    XLSX.writeFile(wb, "StudentData.xlsx");
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-6  shadow-md w-full max-w-7xl mx-auto">
      <ToastContainer />
      <button
        onClick={() => router.push('/')}
        className="mb-4 -ml-2   py-2 px-4 rounded  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      > 
        &larr; Back to Dashboard
      </button>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Student Name</label>
        <input
          name="studentName"
          value={formData.studentName}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Current Study</label>
        <input
          name="currentStudy"
          value={formData.currentStudy}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Course Duration (Years)</label>
        <input
          name="courseDuration"
          value={formData.courseDuration}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Course End Date</label>
        <input
          type="date"
          name="courseEndDate"
          value={formData.courseEndDate}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-bold mb-2">Initial Cheque Date</label>
        <input
          type="date"
          name="initialChqDate"
          value={formData.initialChqDate}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
        <div>
          <label className="block text-sm font-bold mb-2">Initial Bank Name</label>
          <input
            name="initialBankName"
            value={formData.initialBankName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Initial Cheque Number</label>
          <input
            name="initialChqNo"
            value={formData.initialChqNo}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Loan Given (Amount)</label>
        <input
          name="loanGiven"
          type="number"
          value={formData.loanGiven}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Number of PDC Checks</label>
        <input
          name="numPDC"
          type="number"
          value={formData.numPDC}
          onChange={handleNumPDCChange}
          className="input input-bordered w-full"
          min="0"
          required
        />
      </div>
      {formData.pdcChecks.map((check, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-2">PDC Cheque Amount</label>
            <input
              name="pdcAmount"
              type="number"
              value={check.pdcAmount}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">PDC Cheque Number</label>
            <input
              name="pdcChqNo"
              value={check.pdcChqNo}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">PDC Bank Name</label>
            <input
              name="pdcBankName"
              value={check.pdcBankName}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">PDC Cheque Date</label>
            <input
              type="date"
              name="pdcChqDate"
              value={check.pdcChqDate}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Blank Cheque Amount</label>
          <input
            name="blankChqAmount"
            type="number"
            value={formData.blankChqAmount}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Blank Cheque Date</label>
          <input
            type="date"
            name="blankChqDate"
            value={formData.blankChqDate}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Blank Cheque Bank Name</label>
          <input
            name="blankChqBankName"
            value={formData.blankChqBankName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Blank Cheque Number</label>
          <input
            name="blankChqNo"
            value={formData.blankChqNo}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Student Mobile</label>
          <input
            name="mobileStud"
            value={formData.mobileStud}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Father&apos;s Mobile</label>
          <input
            name="mobileFat"
            value={formData.mobileFat}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Mother&apos;s Mobile</label>
          <input
            name="mobileMot"
            value={formData.mobileMot}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="button" onClick={handleExport} className="btn btn-secondary">Export as Excel</button>
      </div>
    </form>
  );
};

export default StudentForm;
