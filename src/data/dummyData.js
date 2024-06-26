const dummyData = [
    {
      id: 1,
      studentName: 'Aayush Nimesh Gangji Nisar',
      email: 'aayush@example.com',
      currentStudy: 'SYBtech',
      courseDuration: '4yrs',
      courseEndDate: '07/2026',
      initialChqDate: '15/12/23',
      initialBankName: 'PNB',
      initialChqNo: '566064',
      loanGiven: 150000,
      blankChqAmount: 150000,
      blankChqDate: '01/12/23',
      blankChqBankName: 'SBI',
      blankChqNo: '516391',
      mobileStud: '9096025409',
      mobileFat: '8779437528',
      mobileMot: '9619404295',
      pdcChecks: [
        { pdcAmount: 16666, pdcChqNo: '516392', pdcBankName: 'SBI', pdcChqDate: '07/11/26', collected: false },
        { pdcAmount: 16666, pdcChqNo: '516393', pdcBankName: 'SBI', pdcChqDate: '07/12/26', collected: false },
        { pdcAmount: 16666, pdcChqNo: '516394', pdcBankName: 'SBI', pdcChqDate: '07/01/27', collected: false },
        { pdcAmount: 16666, pdcChqNo: '516395', pdcBankName: 'SBI', pdcChqDate: '07/02/27', collected: false },
        { pdcAmount: 16666, pdcChqNo: '516396', pdcBankName: 'SBI', pdcChqDate: '07/03/27', collected: false },
        { pdcAmount: 16666, pdcChqNo: '516397', pdcBankName: 'SBI', pdcChqDate: '07/04/27', collected: false },
        { pdcAmount: 16666, pdcChqNo: '516398', pdcBankName: 'SBI', pdcChqDate: '07/05/27', collected: false },
        { pdcAmount: 16666, pdcChqNo: '516399', pdcBankName: 'SBI', pdcChqDate: '07/06/27', collected: false },
        { pdcAmount: 16672, pdcChqNo: '516400', pdcBankName: 'SBI', pdcChqDate: '07/07/27', collected: false }
      ]
    },
    {
      id: 2,
      studentName: 'Neha Sharma',
      email: 'neha@example.com',
      currentStudy: 'MCom',
      courseDuration: '2yrs',
      courseEndDate: '05/2025',
      initialChqDate: '01/01/24',
      initialBankName: 'HDFC',
      initialChqNo: '765432',
      loanGiven: 80000,
      blankChqAmount: 80000,
      blankChqDate: '02/01/24',
      blankChqBankName: 'HDFC',
      blankChqNo: '987654',
      mobileStud: '9823456789',
      mobileFat: '9912345678',
      mobileMot: '9923456789',
      pdcChecks: [
        { pdcAmount: 20000, pdcChqNo: '876543', pdcBankName: 'HDFC', pdcChqDate: '15/07/23', collected: false },
        { pdcAmount: 20000, pdcChqNo: '876544', pdcBankName: 'HDFC', pdcChqDate: '15/08/23', collected: false },
        { pdcAmount: 20000, pdcChqNo: '876545', pdcBankName: 'HDFC', pdcChqDate: '15/09/23', collected: false },
        { pdcAmount: 20000, pdcChqNo: '876546', pdcBankName: 'HDFC', pdcChqDate: '15/10/23', collected: false }
      ]
    },
    {
      id: 3,
      studentName: 'Rohan Kumar',
      email: 'rohan@example.com',
      currentStudy: 'MBA',
      courseDuration: '2yrs',
      courseEndDate: '06/2025',
      initialChqDate: '05/01/24',
      initialBankName: 'ICICI',
      initialChqNo: '234567',
      loanGiven: 120000,
      blankChqAmount: 120000,
      blankChqDate: '05/02/24',
      blankChqBankName: 'ICICI',
      blankChqNo: '345678',
      mobileStud: '9988776655',
      mobileFat: '9876543210',
      mobileMot: '9765432109',
      pdcChecks: [
        { pdcAmount: 30000, pdcChqNo: '654321', pdcBankName: 'ICICI', pdcChqDate: '10/07/24', collected: false },
        { pdcAmount: 30000, pdcChqNo: '654322', pdcBankName: 'ICICI', pdcChqDate: '10/08/24', collected: false },
        { pdcAmount: 30000, pdcChqNo: '654324', pdcBankName: 'ICICI', pdcChqDate: '10/09/24', collected: false },
        { pdcAmount: 30000, pdcChqNo: '654324', pdcBankName: 'ICICI', pdcChqDate: '10/10/24', collected: false }
      ]
    },
    {
      id: 4,
      studentName: 'Priya Mehta',
      email: 'priya@example.com',
      currentStudy: 'BBA',
      courseDuration: '3yrs',
      courseEndDate: '07/2025',
      initialChqDate: '15/01/24',
      initialBankName: 'Axis',
      initialChqNo: '123456',
      loanGiven: 90000,
      blankChqAmount: 90000,
      blankChqDate: '16/01/24',
      blankChqBankName: 'Axis',
      blankChqNo: '654321',
      mobileStud: '9876543211',
      mobileFat: '9765432108',
      mobileMot: '9654321098',
      pdcChecks: [
        { pdcAmount: 22500, pdcChqNo: '321654', pdcBankName: 'Axis', pdcChqDate: '01/07/24', collected: false },
        { pdcAmount: 22500, pdcChqNo: '321655', pdcBankName: 'Axis', pdcChqDate: '01/08/24', collected: false },
        { pdcAmount: 22500, pdcChqNo: '321656', pdcBankName: 'Axis', pdcChqDate: '01/09/24', collected: false },
        { pdcAmount: 22500, pdcChqNo: '321657', pdcBankName: 'Axis', pdcChqDate: '01/10/24', collected: false }
      ]
    },
    {
      id: 5,
      studentName: 'Karan Joshi',
      email: 'karan@example.com',
      currentStudy: 'BSc',
      courseDuration: '3yrs',
      courseEndDate: '07/2025',
      initialChqDate: '20/01/24',
      initialBankName: 'Kotak',
      initialChqNo: '456789',
      loanGiven: 70000,
      blankChqAmount: 70000,
      blankChqDate: '22/01/24',
      blankChqBankName: 'Kotak',
      blankChqNo: '789012',
      mobileStud: '9123456780',
      mobileFat: '9234567890',
      mobileMot: '9345678901',
      pdcChecks: [
        { pdcAmount: 17500, pdcChqNo: '789012', pdcBankName: 'Kotak', pdcChqDate: '02/07/24', collected: false },
        { pdcAmount: 17500, pdcChqNo: '789013', pdcBankName: 'Kotak', pdcChqDate: '02/08/24', collected: false },
        { pdcAmount: 17500, pdcChqNo: '789014', pdcBankName: 'Kotak', pdcChqDate: '02/09/24', collected: false },
        { pdcAmount: 17500, pdcChqNo: '789015', pdcBankName: 'Kotak', pdcChqDate: '02/10/24', collected: false }
      ]
    },
    {
      id: 6,
      studentName: 'Simran Kaur',
      email: 'simran@example.com',
      currentStudy: 'BA',
      courseDuration: '3yrs',
      courseEndDate: '06/2025',
      initialChqDate: '10/02/24',
      initialBankName: 'Yes Bank',
      initialChqNo: '987654',
      loanGiven: 60000,
      blankChqAmount: 60000,
      blankChqDate: '12/02/24',
      blankChqBankName: 'Yes Bank',
      blankChqNo: '123789',
      mobileStud: '9012345678',
      mobileFat: '9123456789',
      mobileMot: '9234567890',
      pdcChecks: [
        { pdcAmount: 15000, pdcChqNo: '456123', pdcBankName: 'Yes Bank', pdcChqDate: '20/07/24', collected: false },
        { pdcAmount: 15000, pdcChqNo: '456124', pdcBankName: 'Yes Bank', pdcChqDate: '20/08/24', collected: false },
        { pdcAmount: 15000, pdcChqNo: '456125', pdcBankName: 'Yes Bank', pdcChqDate: '20/09/24', collected: false },
        { pdcAmount: 15000, pdcChqNo: '456126', pdcBankName: 'Yes Bank', pdcChqDate: '20/10/24', collected: false }
      ]
    }
  ];
  
  export default dummyData;
  