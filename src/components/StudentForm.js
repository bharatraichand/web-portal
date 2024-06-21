"use client"

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
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
        pdcBankName: ''
      }],
    blankChqAmount: '',
    blankChqDate: '',
    blankChqBankName: '',
    blankChqNo: '',
    mobileStudent: '',
    mobileFather: '',
    mobileMother: ''
  });

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
      pdcBankName: ''
    }));
    setFormData({ ...formData, numPDC, pdcChecks });
  };

  const validateMobile = (mobile) => {
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
  };

  const validateForm = () => {
    const { loanGiven, pdcChecks, mobileStudent, mobileFather, mobileMother } = formData;

    if (!validateMobile(mobileStudent) || !validateMobile(mobileFather) || !validateMobile(mobileMother)) {
      toast.error('Invalid mobile number. Please enter a 10-digit number.');
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

  return (
    <form onSubmit={handleSubmit} className="p-6  shadow-md w-full max-w-7xl mx-auto">
      <ToastContainer />
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
        <label className="block text-sm font-bold mb-2">Current Study</label>
        <input
          name="currentStudy"
          value={formData.currentStudy}
          onChange={handleInputChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Course Duration</label>
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
        <label className="block text-sm font-bold mb-2">Loan Given</label>
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
          type="number"
          name="numPDC"
          value={formData.numPDC}
          onChange={handleNumPDCChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      {formData.pdcChecks.map((check, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <h3 className="text-lg font-bold mb-2">PDC Check {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Cheque Amount</label>
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
              <label className="block text-sm font-bold mb-2">Cheque Number</label>
              <input
                name="pdcChqNo"
                value={check.pdcChqNo}
                onChange={(e) => handlePDCInputChange(index, e)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Bank Name</label>
              <input
                name="pdcBankName"
                value={check.pdcBankName}
                onChange={(e) => handlePDCInputChange(index, e)}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
        </div>
      ))}
      <div className="mb-4">
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
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Blank Cheque Date (Optional)</label>
        <input
          type="date"
          name="blankChqDate"
          value={formData.blankChqDate}
          onChange={handleInputChange}
          className="input input-bordered w-full"
        />
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
            name="mobileStudent"
            value={formData.mobileStudent}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Father&apos;s Mobile</label>
          <input
            name="mobileFather"
            value={formData.mobileFather}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Mother&apos;s Mobile</label>
          <input
            name="mobileMother"
            value={formData.mobileMother}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-full">Submit</button>
    </form>
  );
};

export default StudentForm;
