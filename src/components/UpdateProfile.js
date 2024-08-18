"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import axios from 'axios';

const UpdateProfile = ({studentId}) => {
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
    blankChqAmount: '',
    blankChqDate: '',
    blankChqBankName: '',
    blankChqNo: '',
    mobileStud: '',
    mobileFat: '',
    mobileMot: '',
    motEmail:'',
    motName:'',
    fatEmail:'',
    fatName:''
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateMobile = (mobile) => {
    if(!mobile || mobile.length==0)return true;
    const mobilePattern = /^[0-9]{10}$/;
    return mobilePattern.test(mobile);
  };

  const validateEmail = (email) => {
    if(!email || email.length==0)return true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateChequeNumber = (chqNo) => {
    if(!chqNo || chqNo.length==0)return true;
    return chqNo.length >= 6;
  };

  const validateForm = () => {
    const { mobileStud, mobileFat, mobileMot, email, initialChqNo, blankChqNo, motEmail, fatEmail} = formData;

    if (!validateEmail(email)|| !validateEmail(motEmail) || !validateEmail(fatEmail)) {
      toast.error('Invalid email address.');
      return false;
    }

    if (!validateMobile(mobileStud) || !validateMobile(mobileFat) || !validateMobile(mobileMot)) {
      toast.error('Invalid mobile number. Please enter a 10-digit number.');
      return false;
    }

    if (!validateChequeNumber(initialChqNo) || !validateChequeNumber(blankChqNo) ) {
      toast.error('Cheque number must be at least 6 digits.');
      return false;
    }

    return true;
  };

  const fetchStudentData = async () => {
    try {
        
      const response = await fetch('http://localhost:8000/api/students/student_detail/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: studentId })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const formattedData = {
        studentName: data?.general?.name,
        email: data?.general?.email,
        currentStudy: data?.general?.current_study,
        courseDuration: data?.general?.course_duration,
        courseEndDate: data?.general?.course_end_date,
        initialChqDate: data?.general?.initial_chq_date,
        initialBankName: data?.general?.initial_bank_name,
        initialChqNo: data?.general?.initial_chq_no,
        loanGiven: data?.general?.loanamt,
        blankChqAmount: data?.general?.blank_chq_amount,
        blankChqDate: data?.general?.blank_chq_date,
        blankChqBankName: data?.general?.blank_chq_bank_name,
        blankChqNo: data?.general?.blank_chq_no,
        mobileStud: data?.general?.mobile_stu,
        mobileFat: data?.general?.mobile_fat,
        mobileMot: data?.general?.mobile_mot,
        motEmail: data?.general?.mother_email,
        motName: data?.general?.mother_name,
        fatEmail: data?.general?.father_email,
        fatName: data?.general?.father_name,
      };
  
      setFormData(formattedData)
    } catch (error) {
      console.error('Error fetching student data:', error);
      return null;
    }
  };

  useEffect(()=>{
    fetchStudentData();
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const {
        studentName, email, currentStudy, courseDuration, courseEndDate,
        initialChqDate, initialBankName, initialChqNo, loanGiven,
        blankChqAmount, blankChqDate, blankChqBankName, blankChqNo,
        mobileStud, mobileFat, mobileMot, motEmail, fatEmail, motName, fatName
      } = formData;
  
      // Format data for the backend
      const formattedData = {
            id:studentId,
          name: studentName,
          email,
          current_study: currentStudy,
          course_duration: parseInt(courseDuration, 10),
          course_end_date: courseEndDate,
          mobile_stu: mobileStud,
          mobile_fat: mobileFat,
          mobile_mot: mobileMot,
          blank_chq_amount: blankChqAmount,
          blank_chq_date: blankChqDate,
          blank_chq_bank_name: blankChqBankName,
          blank_chq_no: blankChqNo,
          initial_chq_date: initialChqDate,
          initial_bank_name: initialBankName,
          initial_chq_no: initialChqNo,
          loanamt: loanGiven,
          father_name: fatName,
          father_email: fatEmail,
          mother_email: motEmail,
          mother_name: motName
      };
      
  
      try {
        const response = await axios.post('http://localhost:8000/api/students/update/', formattedData);
        if (response.status === 200) {
          toast.success('Form submitted successfully!');
        } else {
          toast.error('Failed to submit the form. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        toast.error('An error occurred while submitting the form. Please try again.');
      }
    }
  };
  

  return (
    <form className="p-6  shadow-md w-full max-w-7xl mx-auto">
      <ToastContainer />
      <button
        onClick={(e) => {
            e.preventDefault();
            router.push("/")
        }}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Sec. Dep. Chq Amount</label>
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
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Sec. Dep. Chq Number</label>
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
        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Update</button>
        {/* <button type="button" onClick={handleExport} className="btn btn-secondary">Export as Excel</button> */}
      </div>
    </form>
  );
};

export default UpdateProfile;
