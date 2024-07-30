"use client"

import axios from 'axios';
import { useState, useEffect } from 'react';

const useStudentsData = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/students/');
      const fetchedStudents = response.data.students.map((student, index) => ({
        id: student.general.studentId,
        studentName: student.general.studentName,
        email: student.general.email,
        currentStudy: student.general.currentStudy,
        courseDuration: `${student.general.courseDuration}yrs`,
        courseEndDate: new Date(student.general.courseEndDate).toLocaleDateString('en-GB'),
        initialChqDate: new Date(student.general.initialChqDate).toLocaleDateString('en-GB'),
        initialBankName: student.general.initialBankName,
        initialChqNo: student.general.initialChqNo,
        loanGiven: student.general.loanGiven,
        blankChqAmount: student.general.blankChqAmount,
        blankChqDate: new Date(student.general.blankChqDate).toLocaleDateString('en-GB'),
        blankChqBankName: student.general.blankChqBankName,
        blankChqNo: student.general.blankChqNo,
        mobileStud: student.general.mobileStud,
        mobileFat: student.general.mobileFat,
        mobileMot: student.general.mobileMot,
        pdcChecks: student.pdc.map(check => ({
          pdcId: check.pdcChqId,
          pdcAmount: check.pdcAmount,
          pdcChqNo: check.pdcChqNo,
          pdcBankName: check.pdcBankName,
          pdcChqDate: new Date(check.pdcChqDate).toLocaleDateString('en-GB'),
          collected: check.state === 1
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

  return students;
};

export default useStudentsData;
