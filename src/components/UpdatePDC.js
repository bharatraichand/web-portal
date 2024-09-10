"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const UpdatePDC = ({ isOpen, onClose , data}) => {
  const [formData, setFormData] = useState({
    pdcAmount: '',
    pdcChqNo: '',
    pdcBankName:'',
    pdcChqDate: '',
    pdcRemark: '',
    pdcGivenName: '',
    state:0,
  });

  const handlePDCInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const fetchPDCData = ( ) => {
    const data2 = {
        pdcId: data.pdcId,
        state: data.state,
      pdcAmount: data.pdcAmount,
      pdcChqNo: data.pdcChqNo,
      pdcBankName: data.pdcBankName,
      pdcChqDate: formatDate(data.pdcChqDate),
      pdcRemark: data.pdcRemark,
      pdcGivenName: data.pdcGivenName}
    setFormData(data2);
  }
  function formatDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}
  useEffect(()=>{
    fetchPDCData();
  },[])
  const handleSubmit = async (e) =>  {
    e.preventDefault();
    console.log(formData);
    await Swal.fire({
    
        title: 'Are you sure, You want to edit?',
         
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Edit'
      }).then(async (result) => {
          if (result.isConfirmed) {
            if(formData.pdcChqNo.length >= 6){
                const formattedData ={
                    pdc_id: data.pdcId,
                    pdc_amount: formData?.pdcAmount,
                    pdc_chq_no: formData?.pdcChqNo,
                    pdc_bank_name: formData?.pdcBankName,
                    pdc_chq_date: formData?.pdcChqDate,
                    remark:formData?.pdcRemark,
                    state:formData?.state,
                    pdc_given_name:formData?.pdcGivenName,
                }
                console.log(formattedData+"formattedData");
                try {
                  const response = await axios.post('http://localhost:8000/api/pdc/update_pdc/', formattedData);
                  if (response.status === 201 || response.status === 200) {
                    toast.success('PDC edited successfully!');
                    window.location.reload();
                    onClose();
                  } else {
                    toast.error('Failed to edit PDC. Please try again.');
                  }
                } catch (error) {
                  console.error('Error editing the PDC:', error);
                  toast.error('An error occurred while editing the PDC. Please try again.');
                }
              }
              else{
                tostify.error("PDC Cheque Number should be of 6 digits");
              }
              Swal.fire(
                  'Edited!',
                  'Your file has been edited.',
                  'success'
              );
          }
      });
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

export default UpdatePDC;
