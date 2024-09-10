"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import axios from 'axios';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    id: '',
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
      pdcChqDate: '',
      pdcRemark:'',
      pdcGivenName:''
    }],
    blankChqAmount: '',
    blankChqDate: '',
    blankChqBankName: '',
    blankChqNo: '',
    mobileStud: '',
    mobileFat: '',
    mobileMot: '',
    fatName:'',
    motName:'',
    fatEmail:'',
    motEmail:''
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
      pdcChqDate: '',
      pdcRemark:'',
      pdcGivenName:''
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
    const { loanGiven, pdcChecks, mobileStud, mobileFat, mobileMot, email, initialChqNo, blankChqNo, fatEmail, motEmail } = formData;

    // if (!validateEmail(email) || !validateEmail(motEmail) || !validateEmail(fatEmail)) {
    //   toast.error('Invalid email address.');
    //   return false;
    // }

    // if (!validateMobile(mobileStud) || !validateMobile(mobileFat) || !validateMobile(mobileMot)) {
    //   toast.error('Invalid mobile number. Please enter a 10-digit number.');
    //   return false;
    // }

    // if (!validateChequeNumber(initialChqNo) || !validateChequeNumber(blankChqNo) || !pdcChecks.every(check => validateChequeNumber(check.pdcChqNo))) {
    //   toast.error('Cheque number must be at least 6 digits.');
    //   return false;
    // }

    // const totalPDCAmount = pdcChecks.reduce((total, check) => total + parseFloat(check.pdcAmount || 0), 0);
    // if (totalPDCAmount !== parseFloat(loanGiven)) {
    //   toast.error('Total PDC amount must equal the loan amount given.');
    //   return false;
    // }

    const uniqueChequeNumbers = new Set(pdcChecks.map(check => check.pdcChqNo));
    if (uniqueChequeNumbers.size !== pdcChecks.length) {
      toast.error('PDC cheque numbers must be unique.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const {
        id,studentName, email, currentStudy, courseDuration, courseEndDate,
        initialChqDate, initialBankName, initialChqNo, loanGiven,
        blankChqAmount, blankChqDate, blankChqBankName, blankChqNo,
        mobileStud, mobileFat, mobileMot, pdcChecks, motEmail, fatEmail, motName, fatName
      } = formData;
  
      // Format data for the backend
      const formattedData = {
        general: {
          id:id,
          name: studentName,
          email,
          current_study: currentStudy,
          course_duration: parseInt(courseDuration, 10),
          course_end_date: courseEndDate,
          mobile_stu: mobileStud,
          mobile_fat: mobileFat,
          mobile_mot: mobileMot,
          loan_rep_sec_chq_amt: blankChqAmount,
          loan_rep_sec_chq_date: blankChqDate,
          loan_rep_sec_chq_bank_name: blankChqBankName,
          loan_rep_sec_chq_no: blankChqNo,
          initial_chq_date: initialChqDate,
          initial_bank_name: initialBankName,
          initial_chq_no: initialChqNo,
          loanamt: loanGiven,
          fathers_name: fatName,
          fathers_mail: fatEmail,
          mothers_mail: motEmail,
          mothers_name: motName      
        },
        pdc: pdcChecks.map(check => ({
          pdc_amount: check?.pdcAmount,
          pdc_chq_no: check?.pdcChqNo,
          pdc_bank_name: check?.pdcBankName,
          pdc_chq_date: check?.pdcChqDate,
          pdc_remark:check?.pdcRemark,
          pdc_given_name:check?.pdcGivenName,
        }))
      };
      
  
      try {
        const response = await axios.post('http://localhost:8000/api/students/add/', formattedData);
        if (response.status === 201 || response.status === 200) {
          toast.success('Form submitted successfully!');
          router.push('/');
        } else {
          toast.error('Failed to submit the form. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        toast.error('An error occurred while submitting the form. Please try again.');
      }
    }
  };
  
  const handleBackToDashboard = (event) => {
    event.preventDefault();
    router.push('/');
  };

  const handleExport = () => {
    const {
      id,studentName, email, currentStudy, courseDuration, courseEndDate,
      initialChqDate, initialBankName, initialChqNo, loanGiven,
      blankChqAmount, blankChqDate, blankChqBankName, blankChqNo,
      mobileStud, mobileFat, mobileMot, pdcChecks, motEmail, fatEmail, motName, fatName
    } = formData;
  
    // Create the main row with basic student information
    const mainData = {
      "Id": id,
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
  
    // Create a header for the worksheet
    const header = [
      "ID", "Student Name", "Email", "Current Study", "Course Duration", "Course End Date",
      "Initial Cheque Date", "Initial Bank Name", "Initial Cheque Number", "Loan Given",
      "PDC Cheque Amount", "PDC Cheque Number", "PDC Bank Name", "PDC Cheque Date", "PDC Remarks","PDC Chq Given Name",
      "Sec. Dep. Chq Amount", "Sec. Dep. Chq Date", "Sec. Dep. Chq Bank Name", "Sec. Dep. Chq Number",
      "Student Mobile","Father's Name",  "Father's Mobile",  "Father's Email",
      "Mother's Name","Mother's Mobile","Mother's Email",
    ];
  
    // Create an array for the PDC data, to be added to the main row
    const pdcData = pdcChecks.map((check, index) => ({
      "PDC Cheque Amount": check?.pdcAmount,
      "PDC Cheque Number": check?.pdcChqNo,
      "PDC Bank Name": check?.pdcBankName,
      "PDC Cheque Date": check?.pdcChqDate,
      "PDC Remarks": check?.pdcRemark,
      "PDC Chq Given Name": check?.pdcGivenName,
    }));
  
    // Create an array to hold the rows
    const rows = [mainData];
  
    // Add PDC data as separate rows with empty values for non-PDC fields
    pdcData.forEach((pdc) => {
      rows.push({
        "ID.": '',
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
    <form className="p-6  shadow-md w-full max-w-7xl mx-auto">
      <ToastContainer />
      <button
        onClick={handleBackToDashboard}
        className="mb-4 -ml-2   py-2 px-4 rounded  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      > 
        &larr; Back to Dashboard
      </button>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">ID</label>
        <input
          name="id"
          type="number"
          value={formData.id}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Student Name</label>
        <input
          name="studentName"
          value={formData.studentName}
          onChange={handleInputChange}
          className="input input-bordered w-full"
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
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Current Study</label>
        <input
          name="currentStudy"
          value={formData.currentStudy}
          onChange={handleInputChange}
          className="input input-bordered w-full"
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
        />
      </div>
        <div>
          <label className="block text-sm font-bold mb-2">Initial Bank Name</label>
          <input
            name="initialBankName"
            value={formData.initialBankName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Initial Cheque Number</label>
          <input
            name="initialChqNo"
            value={formData.initialChqNo}
            onChange={handleInputChange}
            className="input input-bordered w-full"
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
        />
      </div>
      {formData.pdcChecks.map((check, index) => (
        <div key={index}>
        <div  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-2">PDC Cheque Amount</label>
            <input
              name="pdcAmount"
              type="number"
              value={check.pdcAmount}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">PDC Cheque Number</label>
            <input
              name="pdcChqNo"
              value={check.pdcChqNo}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">PDC Bank Name</label>
            <input
              name="pdcBankName"
              value={check.pdcBankName}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
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
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
            <label className="block text-sm font-bold mb-2">PDC Remarks</label>
            <input
              name="pdcRemark"
              value={check.pdcRemark}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">PDC Cheque Given Name</label>
            <input
              name="pdcGivenName"
              value={check.pdcGivenName}
              onChange={(e) => handlePDCInputChange(index, e)}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        </div>
      ))}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Sec. Dep. Chq Amount</label>
          <input
            name="blankChqAmount"
            type="number"
            value={formData.blankChqAmount}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Sec. Dep. Chq Date</label>
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
          <label className="block text-sm font-bold mb-2">Sec. Dep. Chq Bank Name</label>
          <input
            name="blankChqBankName"
            value={formData.blankChqBankName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Sec. Dep. Chq Number</label>
          <input
            name="blankChqNo"
            value={formData.blankChqNo}
            onChange={handleInputChange}
            className="input input-bordered w-full"
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
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Father&apos;s Mobile</label>
          <input
            name="mobileFat"
            value={formData.mobileFat}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Mother&apos;s Mobile</label>
          <input
            name="mobileMot"
            value={formData.mobileMot}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
          <label className="block text-sm font-bold mb-2">Father&apos;s Name</label>
          <input
            name="fatName"
            value={formData.fatName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Father&apos;s Email</label>
          <input
            name="fatEmail"
            value={formData.fatEmail}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
          <label className="block text-sm font-bold mb-2">Mother&apos;s Name</label>
          <input
            name="motName"
            value={formData.motName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Mother&apos;s Email</label>
          <input
            name="motEmail"
            value={formData.motEmail}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={handleExport} className="btn btn-secondary">Export as Excel</button>
      </div>
    </form>
  );
};

export default StudentForm;
