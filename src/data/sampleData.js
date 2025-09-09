export const sampleProjects = [
  {
    id: 'PROJ-001',
    name: 'Islamabad Expressway Expansion',
    directorate: 'North',
    category: 'Road',
    location: 'Islamabad',
    scope: '20km road expansion, 4 bridges, 8 culverts, drainage system',
    client: 'Capital Development Authority',
    consultant: 'National Engineering Services Pakistan',
    caValue: 2500000000,
    revisedCaValue: 2650000000,
    startDate: '2023-01-15',
    completionDate: '2024-06-15',
    revisedCompletionDate: '2024-08-15',
    status: 'In Progress',
    createdAt: '2022-11-10T08:30:00Z',
    updatedAt: '2023-10-15T14:20:00Z',
    plannedProfitability: 15,
    targets: [
      { month: '2023-06', value: 150000000 },
      { month: '2023-07', value: 180000000 },
      { month: '2023-08', value: 200000000 },
      { month: '2023-09', value: 220000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 850000000,
          escalationPercentage: 5,
          vettedRevenue: 800000000,
          amountReceived: 750000000
        },
        currentMonth: {
          workDone: 200000000,
          escalationPercentage: 5,
          vettedRevenue: 190000000,
          amountReceived: 180000000
        },
        calculations: {
          escalationDuringMonth: 10000000,
          uptoDateActualWorkDone: 1050000000,
          uptoDateEscalation: 52500000,
          uptoDateActualRevenue: 1102500000,
          uptoDateVettedRevenue: 990000000,
          uptoDateAmountReceived: 930000000,
          uptoDateSlippage: 112500000,
          uptoDateReceivable: 60000000
        },
        expenditures: {
          'Subcontractor Cost': 600000000,
          'Material Cost': 250000000,
          'Hiring Cost': 50000000,
          'Engineer Facilities': 30000000,
          'Pays & Allowances': 40000000,
          'General Administration': 20000000,
          'Other Costs': 10000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 6,
      subcontractorCost: 1200000000,
      materialCost: 800000000,
      engineerFacilityCost: 100000000,
      hrCost: 150000000,
      generalAdmCost: 100000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-002',
    name: 'Karachi Coastal Highway',
    directorate: 'Sindh',
    category: 'Road',
    location: 'Karachi',
    scope: '15km coastal highway with sea protection walls',
    client: 'Sindh Highway Department',
    consultant: 'Associated Consulting Engineers',
    caValue: 1800000000,
    revisedCaValue: 1950000000,
    startDate: '2023-03-01',
    completionDate: '2024-05-01',
    revisedCompletionDate: '2024-07-01',
    status: 'In Progress',
    createdAt: '2022-12-15T10:15:00Z',
    updatedAt: '2023-09-20T11:45:00Z',
    plannedProfitability: 12,
    targets: [
      { month: '2023-06', value: 120000000 },
      { month: '2023-07', value: 140000000 },
      { month: '2023-08', value: 160000000 },
      { month: '2023-09', value: 180000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 650000000,
          escalationPercentage: 4,
          vettedRevenue: 620000000,
          amountReceived: 600000000
        },
        currentMonth: {
          workDone: 160000000,
          escalationPercentage: 4,
          vettedRevenue: 150000000,
          amountReceived: 140000000
        },
        calculations: {
          escalationDuringMonth: 6400000,
          uptoDateActualWorkDone: 810000000,
          uptoDateEscalation: 32400000,
          uptoDateActualRevenue: 842400000,
          uptoDateVettedRevenue: 770000000,
          uptoDateAmountReceived: 740000000,
          uptoDateSlippage: 72400000,
          uptoDateReceivable: 30000000
        },
        expenditures: {
          'Subcontractor Cost': 450000000,
          'Material Cost': 200000000,
          'Hiring Cost': 40000000,
          'Engineer Facilities': 25000000,
          'Pays & Allowances': 35000000,
          'General Administration': 15000000,
          'Other Costs': 8000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 5,
      subcontractorCost: 900000000,
      materialCost: 600000000,
      engineerFacilityCost: 80000000,
      hrCost: 120000000,
      generalAdmCost: 80000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-003',
    name: 'Lahore Metro Bus Extension',
    directorate: 'Centre',
    category: 'Infrastructure',
    location: 'Lahore',
    scope: '12km metro bus corridor with 8 stations',
    client: 'Punjab Mass Transit Authority',
    consultant: 'Urban Transport Consultants',
    caValue: 3200000000,
    revisedCaValue: 3500000000,
    startDate: '2023-02-10',
    completionDate: '2024-08-10',
    revisedCompletionDate: '2024-10-10',
    status: 'In Progress',
    createdAt: '2022-10-20T09:45:00Z',
    updatedAt: '2023-10-10T16:30:00Z',
    plannedProfitability: 18,
    targets: [
      { month: '2023-06', value: 200000000 },
      { month: '2023-07', value: 220000000 },
      { month: '2023-08', value: 240000000 },
      { month: '2023-09', value: 260000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 1200000000,
          escalationPercentage: 7,
          vettedRevenue: 1150000000,
          amountReceived: 1100000000
        },
        currentMonth: {
          workDone: 250000000,
          escalationPercentage: 7,
          vettedRevenue: 240000000,
          amountReceived: 230000000
        },
        calculations: {
          escalationDuringMonth: 17500000,
          uptoDateActualWorkDone: 1450000000,
          uptoDateEscalation: 101500000,
          uptoDateActualRevenue: 1551500000,
          uptoDateVettedRevenue: 1390000000,
          uptoDateAmountReceived: 1330000000,
          uptoDateSlippage: 161500000,
          uptoDateReceivable: 60000000
        },
        expenditures: {
          'Subcontractor Cost': 800000000,
          'Material Cost': 350000000,
          'Hiring Cost': 70000000,
          'Engineer Facilities': 50000000,
          'Pays & Allowances': 60000000,
          'General Administration': 30000000,
          'Other Costs': 15000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 8,
      subcontractorCost: 1600000000,
      materialCost: 1000000000,
      engineerFacilityCost: 150000000,
      hrCost: 200000000,
      generalAdmCost: 120000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-004',
    name: 'Peshawar Northern Bypass',
    directorate: 'KPK',
    category: 'Road',
    location: 'Peshawar',
    scope: '22km bypass road with 2 interchanges',
    client: 'KPK Highway Authority',
    consultant: 'Frontier Engineering Consultants',
    caValue: 1500000000,
    revisedCaValue: 1600000000,
    startDate: '2023-04-01',
    completionDate: '2024-04-01',
    revisedCompletionDate: '2024-06-01',
    status: 'In Progress',
    createdAt: '2023-01-15T14:20:00Z',
    updatedAt: '2023-09-25T10:15:00Z',
    plannedProfitability: 14,
    targets: [
      { month: '2023-06', value: 110000000 },
      { month: '2023-07', value: 130000000 },
      { month: '2023-08', value: 150000000 },
      { month: '2023-09', value: 170000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 600000000,
          escalationPercentage: 6,
          vettedRevenue: 570000000,
          amountReceived: 550000000
        },
        currentMonth: {
          workDone: 170000000,
          escalationPercentage: 6,
          vettedRevenue: 160000000,
          amountReceived: 150000000
        },
        calculations: {
          escalationDuringMonth: 10200000,
          uptoDateActualWorkDone: 770000000,
          uptoDateEscalation: 46200000,
          uptoDateActualRevenue: 816200000,
          uptoDateVettedRevenue: 730000000,
          uptoDateAmountReceived: 700000000,
          uptoDateSlippage: 86200000,
          uptoDateReceivable: 30000000
        },
        expenditures: {
          'Subcontractor Cost': 400000000,
          'Material Cost': 180000000,
          'Hiring Cost': 35000000,
          'Engineer Facilities': 20000000,
          'Pays & Allowances': 30000000,
          'General Administration': 15000000,
          'Other Costs': 7000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 7,
      subcontractorCost: 750000000,
      materialCost: 500000000,
      engineerFacilityCost: 60000000,
      hrCost: 100000000,
      generalAdmCost: 60000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-005',
    name: 'Quetta Water Supply Scheme',
    directorate: 'Baluchistan',
    category: 'Infrastructure',
    location: 'Quetta',
    scope: 'Water treatment plant and distribution network',
    client: 'Quetta Water Board',
    consultant: 'Water Resources Consultants',
    caValue: 1200000000,
    revisedCaValue: 1300000000,
    startDate: '2023-05-15',
    completionDate: '2024-05-15',
    revisedCompletionDate: '2024-07-15',
    status: 'In Progress',
    createdAt: '2023-02-10T11:30:00Z',
    updatedAt: '2023-10-05T09:20:00Z',
    plannedProfitability: 13,
    targets: [
      { month: '2023-06', value: 90000000 },
      { month: '2023-07', value: 110000000 },
      { month: '2023-08', value: 130000000 },
      { month: '2023-09', value: 150000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 500000000,
          escalationPercentage: 5,
          vettedRevenue: 480000000,
          amountReceived: 460000000
        },
        currentMonth: {
          workDone: 150000000,
          escalationPercentage: 5,
          vettedRevenue: 140000000,
          amountReceived: 130000000
        },
        calculations: {
          escalationDuringMonth: 7500000,
          uptoDateActualWorkDone: 650000000,
          uptoDateEscalation: 32500000,
          uptoDateActualRevenue: 682500000,
          uptoDateVettedRevenue: 620000000,
          uptoDateAmountReceived: 590000000,
          uptoDateSlippage: 62500000,
          uptoDateReceivable: 30000000
        },
        expenditures: {
          'Subcontractor Cost': 350000000,
          'Material Cost': 150000000,
          'Hiring Cost': 30000000,
          'Engineer Facilities': 15000000,
          'Pays & Allowances': 25000000,
          'General Administration': 10000000,
          'Other Costs': 5000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 6,
      subcontractorCost: 600000000,
      materialCost: 400000000,
      engineerFacilityCost: 50000000,
      hrCost: 80000000,
      generalAdmCost: 50000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-006',
    name: 'Multan Industrial Zone',
    directorate: 'Centre',
    category: 'Building',
    location: 'Multan',
    scope: 'Industrial buildings and infrastructure development',
    client: 'Punjab Industrial Development Board',
    consultant: 'Industrial Infrastructure Consultants',
    caValue: 2800000000,
    revisedCaValue: 3000000000,
    startDate: '2023-01-20',
    completionDate: '2024-07-20',
    revisedCompletionDate: '2024-09-20',
    status: 'In Progress',
    createdAt: '2022-11-30T13:45:00Z',
    updatedAt: '2023-10-12T15:10:00Z',
    plannedProfitability: 16,
    targets: [
      { month: '2023-06', value: 180000000 },
      { month: '2023-07', value: 200000000 },
      { month: '2023-08', value: 220000000 },
      { month: '2023-09', value: 240000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 1100000000,
          escalationPercentage: 8,
          vettedRevenue: 1050000000,
          amountReceived: 1000000000
        },
        currentMonth: {
          workDone: 240000000,
          escalationPercentage: 8,
          vettedRevenue: 230000000,
          amountReceived: 220000000
        },
        calculations: {
          escalationDuringMonth: 19200000,
          uptoDateActualWorkDone: 1340000000,
          uptoDateEscalation: 107200000,
          uptoDateActualRevenue: 1447200000,
          uptoDateVettedRevenue: 1280000000,
          uptoDateAmountReceived: 1220000000,
          uptoDateSlippage: 167200000,
          uptoDateReceivable: 60000000
        },
        expenditures: {
          'Subcontractor Cost': 700000000,
          'Material Cost': 350000000,
          'Hiring Cost': 60000000,
          'Engineer Facilities': 40000000,
          'Pays & Allowances': 50000000,
          'General Administration': 25000000,
          'Other Costs': 12000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 9,
      subcontractorCost: 1400000000,
      materialCost: 900000000,
      engineerFacilityCost: 120000000,
      hrCost: 180000000,
      generalAdmCost: 100000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-007',
    name: 'Gwadar Deep Sea Port Phase II',
    directorate: 'Baluchistan',
    category: 'Infrastructure',
    location: 'Gwadar',
    scope: 'Port expansion and container terminal development',
    client: 'Gwadar Port Authority',
    consultant: 'Marine Infrastructure Consultants',
    caValue: 5000000000,
    revisedCaValue: 5500000000,
    startDate: '2023-03-15',
    completionDate: '2025-03-15',
    revisedCompletionDate: '2025-06-15',
    status: 'In Progress',
    createdAt: '2022-12-10T10:20:00Z',
    updatedAt: '2023-10-08T14:45:00Z',
    plannedProfitability: 20,
    targets: [
      { month: '2023-06', value: 300000000 },
      { month: '2023-07', value: 320000000 },
      { month: '2023-08', value: 340000000 },
      { month: '2023-09', value: 360000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 1800000000,
          escalationPercentage: 10,
          vettedRevenue: 1700000000,
          amountReceived: 1650000000
        },
        currentMonth: {
          workDone: 360000000,
          escalationPercentage: 10,
          vettedRevenue: 340000000,
          amountReceived: 330000000
        },
        calculations: {
          escalationDuringMonth: 36000000,
          uptoDateActualWorkDone: 2160000000,
          uptoDateEscalation: 216000000,
          uptoDateActualRevenue: 2376000000,
          uptoDateVettedRevenue: 2040000000,
          uptoDateAmountReceived: 1980000000,
          uptoDateSlippage: 336000000,
          uptoDateReceivable: 60000000
        },
        expenditures: {
          'Subcontractor Cost': 1200000000,
          'Material Cost': 600000000,
          'Hiring Cost': 100000000,
          'Engineer Facilities': 80000000,
          'Pays & Allowances': 90000000,
          'General Administration': 40000000,
          'Other Costs': 20000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 12,
      subcontractorCost: 2500000000,
      materialCost: 1800000000,
      engineerFacilityCost: 200000000,
      hrCost: 300000000,
      generalAdmCost: 150000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-008',
    name: 'Faisalabad Ring Road',
    directorate: 'Centre',
    category: 'Road',
    location: 'Faisalabad',
    scope: '45km ring road with 4 interchanges',
    client: 'Faisalabad Development Authority',
    consultant: 'Transport Infrastructure Consultants',
    caValue: 3800000000,
    revisedCaValue: 4000000000,
    startDate: '2023-02-05',
    completionDate: '2024-10-05',
    revisedCompletionDate: '2025-01-05',
    status: 'In Progress',
    createdAt: '2022-11-15T09:30:00Z',
    updatedAt: '2023-10-10T16:20:00Z',
    plannedProfitability: 17,
    targets: [
      { month: '2023-06', value: 220000000 },
      { month: '2023-07', value: 240000000 },
      { month: '2023-08', value: 260000000 },
      { month: '2023-09', value: 280000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 1400000000,
          escalationPercentage: 9,
          vettedRevenue: 1350000000,
          amountReceived: 1300000000
        },
        currentMonth: {
          workDone: 280000000,
          escalationPercentage: 9,
          vettedRevenue: 270000000,
          amountReceived: 260000000
        },
        calculations: {
          escalationDuringMonth: 25200000,
          uptoDateActualWorkDone: 1680000000,
          uptoDateEscalation: 151200000,
          uptoDateActualRevenue: 1831200000,
          uptoDateVettedRevenue: 1620000000,
          uptoDateAmountReceived: 1560000000,
          uptoDateSlippage: 211200000,
          uptoDateReceivable: 60000000
        },
        expenditures: {
          'Subcontractor Cost': 900000000,
          'Material Cost': 450000000,
          'Hiring Cost': 80000000,
          'Engineer Facilities': 60000000,
          'Pays & Allowances': 70000000,
          'General Administration': 35000000,
          'Other Costs': 18000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 10,
      subcontractorCost: 1900000000,
      materialCost: 1200000000,
      engineerFacilityCost: 150000000,
      hrCost: 220000000,
      generalAdmCost: 120000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-009',
    name: 'Hyderabad Sewerage System',
    directorate: 'Sindh',
    category: 'Infrastructure',
    location: 'Hyderabad',
    scope: 'Sewerage treatment plant and pipeline network',
    client: 'Hyderabad Municipal Corporation',
    consultant: 'Water & Sanitation Consultants',
    caValue: 1600000000,
    revisedCaValue: 1700000000,
    startDate: '2023-04-10',
    completionDate: '2024-06-10',
    revisedCompletionDate: '2024-08-10',
    status: 'In Progress',
    createdAt: '2023-01-20T14:10:00Z',
    updatedAt: '2023-09-28T11:30:00Z',
    plannedProfitability: 14,
    targets: [
      { month: '2023-06', value: 120000000 },
      { month: '2023-07', value: 140000000 },
      { month: '2023-08', value: 160000000 },
      { month: '2023-09', value: 180000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 700000000,
          escalationPercentage: 7,
          vettedRevenue: 670000000,
          amountReceived: 650000000
        },
        currentMonth: {
          workDone: 180000000,
          escalationPercentage: 7,
          vettedRevenue: 170000000,
          amountReceived: 160000000
        },
        calculations: {
          escalationDuringMonth: 12600000,
          uptoDateActualWorkDone: 880000000,
          uptoDateEscalation: 61600000,
          uptoDateActualRevenue: 941600000,
          uptoDateVettedRevenue: 840000000,
          uptoDateAmountReceived: 810000000,
          uptoDateSlippage: 101600000,
          uptoDateReceivable: 30000000
        },
        expenditures: {
          'Subcontractor Cost': 450000000,
          'Material Cost': 200000000,
          'Hiring Cost': 40000000,
          'Engineer Facilities': 25000000,
          'Pays & Allowances': 35000000,
          'General Administration': 15000000,
          'Other Costs': 8000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 8,
      subcontractorCost: 800000000,
      materialCost: 500000000,
      engineerFacilityCost: 70000000,
      hrCost: 120000000,
      generalAdmCost: 70000000,
      overheadCalculationMethod: 'detailed'
    }
  },
  {
    id: 'PROJ-010',
    name: 'Sialkot International Airport Expansion',
    directorate: 'North',
    category: 'Infrastructure',
    location: 'Sialkot',
    scope: 'Airport terminal expansion and runway extension',
    client: 'Sialkot International Airport Limited',
    consultant: 'Aviation Infrastructure Consultants',
    caValue: 2200000000,
    revisedCaValue: 2400000000,
    startDate: '2023-03-01',
    completionDate: '2024-09-01',
    revisedCompletionDate: '2024-11-01',
    status: 'In Progress',
    createdAt: '2022-12-20T11:15:00Z',
    updatedAt: '2023-10-05T14:30:00Z',
    plannedProfitability: 15,
    targets: [
      { month: '2023-06', value: 150000000 },
      { month: '2023-07', value: 170000000 },
      { month: '2023-08', value: 190000000 },
      { month: '2023-09', value: 210000000 }
    ],
    progress: [
      {
        date: '2023-10-01T00:00:00Z',
        previousMonth: {
          actualWorkDone: 900000000,
          escalationPercentage: 6,
          vettedRevenue: 850000000,
          amountReceived: 820000000
        },
        currentMonth: {
          workDone: 210000000,
          escalationPercentage: 6,
          vettedRevenue: 200000000,
          amountReceived: 190000000
        },
        calculations: {
          escalationDuringMonth: 12600000,
          uptoDateActualWorkDone: 1110000000,
          uptoDateEscalation: 66600000,
          uptoDateActualRevenue: 1176600000,
          uptoDateVettedRevenue: 1050000000,
          uptoDateAmountReceived: 1010000000,
          uptoDateSlippage: 126600000,
          uptoDateReceivable: 40000000
        },
        expenditures: {
          'Subcontractor Cost': 600000000,
          'Material Cost': 280000000,
          'Hiring Cost': 50000000,
          'Engineer Facilities': 35000000,
          'Pays & Allowances': 45000000,
          'General Administration': 20000000,
          'Other Costs': 10000000
        }
      }
    ],
    budget: {
      tentativeEscalation: 7,
      subcontractorCost: 1100000000,
      materialCost: 700000000,
      engineerFacilityCost: 90000000,
      hrCost: 140000000,
      generalAdmCost: 80000000,
      overheadCalculationMethod: 'detailed'
    }
  }
];
