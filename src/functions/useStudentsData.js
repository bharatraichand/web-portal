"use client"

import axios from 'axios';
import { useState, useEffect } from 'react';

const useStudentsData = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/students/');
      console.log(response);
      const fetchedStudents = response.data.students.map((student, index) => ({
        id: student.general.id,
        studentName: student.general.studentName,
        email: student.general.email,
        currentStudy: student.general.currentStudy,
        courseDuration: `${student.general.courseDuration}yrs`,
        courseEndDate: new Date(student.general.courseEndDate).toLocaleDateString('en-GB'),
        initialChqDate: new Date(student.general.initialChqDate).toLocaleDateString('en-GB'),
        initialBankName: student.general.initialBankName,
        initialChqNo: student.general.initialChqNo,
        loanGiven: student.general.loanGiven,
        blankChqAmount: student.general.loanRepSecChqAmt,
        blankChqDate: new Date(student.general.loanRepSecChqDate).toLocaleDateString('en-GB'),
        blankChqBankName: student.general.loanRepSecChqBankName,
        blankChqNo: student.general.loanRepSecChqNo,
        mobileStud: student.general.mobileStud,
        mobileFat: student.general.mobileFat,
        mobileMot: student.general.mobileMot,
        motName:student.general.mothersName,
        fatName:student.general.fathersName,
        fathersEmail:student.general.fathersMail,
        mothersEmail:student.general.mothersMail,
        //two fields like initialpdccheckdate and lastpdccheckdate are to be taken?
        pdcChecks: student.pdc.map(check => ({
          pdcId: check.pdcChqId, //where do i get the id from?
          pdcAmount: check.pdcAmount,
          pdcChqNo: check.pdcChqNo,
          pdcBankName: check.pdcBankName,
          pdcChqDate: new Date(check.pdcChqDate).toLocaleDateString('en-GB'),
          collected: check.state === 1
          // do i make fields for remark and givenName
        }))
      }));
      setStudents(fetchedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {students,setStudents};
};

export default useStudentsData;
