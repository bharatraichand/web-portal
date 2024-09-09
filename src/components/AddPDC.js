"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPDC = ({ isOpen, onClose ,general_id}) => {
  const [formData, setFormData] = useState({
    pdcAmount: '',
    pdcChqNo: '',
    pdcBankName:'',
    pdcChqDate: '',
    pdcRemark: '',
    pdcGivenName: '',
  });

  const handlePDCInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) =>  {
    e.preventDefault();
    console.log(formData);
    if(formData.pdcChqNo.length >= 6){
      const formattedData ={
        general_id:general_id,
        pdcs:{
          pdc_amount: formData?.pdcAmount,
          pdc_chq_no: formData?.pdcChqNo,
          pdc_bank_name: formData?.pdcBankName,
          pdc_chq_date: formData?.pdcChqDate,
          pdc_remark:formData?.pdcRemark,
          state:0,
          pdc_given_name:formData?.pdcGivenName,
        }
      }
      try {
        const response = await axios.post('http://localhost:8000/api/pdc/add_pdc/', formattedData);
        if (response.status === 201 || response.status === 200) {
          toast.success('PDC added successfully!');
          window.location.reload();
          onClose();
        } else {
          toast.error('Failed to add PDC. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        toast.error('An error occurred while submitting the form. Please try again.');
      }
    }
    else{
      tostify.error("PDC Cheque Number should be of 6 digits");
    }
    //onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"> 
      <div className="bg-gray-900 z-10 p-8 w-1/2">
      <form>
      <div  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-bold mb-2">PDC Cheque Amount</label>
        <input
          name="pdcAmount"
          type="number"
          value={formData.pdcAmount}
          onChange={handlePDCInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">PDC Cheque Number</label>
        <input
          name="pdcChqNo"
          value={formData.pdcChqNo}
          onChange={handlePDCInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">PDC Bank Name</label>
        <input
          name="pdcBankName"
          value={formData.pdcBankName}
          onChange={handlePDCInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">PDC Cheque Date</label>
        <input
          type="date"
          name="pdcChqDate"
          value={formData.pdcChqDate}
          onChange={handlePDCInputChange}
          className="input input-bordered w-full"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
        <label className="block text-sm font-bold mb-2">PDC Remarks</label>
        <input
          name="pdcRemark"
          value={formData.pdcRemark}
          onChange={handlePDCInputChange}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">PDC Cheque Given Name</label>
        <input
          name="pdcGivenName"
          value={formData.pdcGivenName}
          onChange={handlePDCInputChange}
          className="input input-bordered w-full"
        />
      </div>
      </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        </div>
    )
  );
};

export default AddPDC;
