const user_roles = [
  {
    title: 'Driver Manager',
    value: 1,
  },
  {
    title: 'Dispatcher',
    value: 2,
  },
  {
    title: 'Driver',
    value: 3,
  },
  {
    title: 'Reservationist',
    value: 4,
  },
  {
    title: 'Manager',
    value: 6,
  },
  {
    title: 'Account User',
    value: 7,
  },
  {
    title: 'Billing Clerk',
    value: 10,
  },
];

const capability_roles = [
  {
    title: 'Trainee',
    value: 1,
  },
  {
    title: 'Weights over 350 lbs',
    value: 2,
  },
  {
    title: 'Can do out of town',
    value: 3,
  },
  {
    title: 'Can do AMB',
    value: 4,
  },
  {
    title: 'Can STR',
    value: 5,
  },
  {
    title: 'WC',
    value: 6,
  },
];

export const transportStatus = (name) => {
  switch (name) {
    case 'dispatch_requested':
      return 'Dispatch Requested';
    case 'noshow':
      return 'No Show';
    case 'en_route':
      return 'En Route';
    case 'arrived_at_pick_up':
      return 'Arrived at PU';
    case 'confirm_dob':
      return 'Confirmed DOB';
    case 'patient_loaded':
      return 'Patient loaded';
    case 'arrived_at_drop_off':
      return 'Arrived at DO';
    case 'rejected':
      return 'Rejected';
    case 'completed':
      return 'Completed';
    case 'planned':
      return 'Planned';
    case 'accepted':
      return 'Accepted';
    case 'cancelled':
      return 'Canceled';
    case 'aborted':
      return 'Aborted';
    case 'requested':
      return 'Requested';
    case 'unassigned':
      return 'Unassigned';
    case 'expired':
      return 'Expired';
    case 'allocated':
      return 'Allocated';
    case 'dispatched':
      return 'Dispatched';
    // Invoice Status
    case 'validated':
      return 'Validated';
    case 'locked':
      return 'Locked';
    case 'uninvoiced':
      return 'Uninvoiced';
    case 'part_paid':
      return 'Partially Paid';
    case 'disputed':
      return 'Disputed';
    case 'fully_paid':
      return 'Fully Paid';
    case 'refunded':
      return 'Refunded';
    case 'send_invoiced':
      return 'Invoice Sent';
    case 'sent':
      return 'Sent';
    case 'dispute_accepted':
      return 'Dispute Accepted';
    case 'invoiced':
      return 'Invoiced';
    case 'on_hold':
      return 'On Hold';
    case 'none':
      return 'N/A';
    case 'in_progress':
      return 'In Progress';
    case 'cancelled_no_billable':
      return 'Canceled No Billable';
    default:
      return name;
  }
};
export { user_roles, capability_roles };

export const DefaultDateTime = 'MM/DD/YY HHmm';
export const DateTime = 'ddd, MM/DD/YY - HHmm';
export const DefaultDate = 'MM/DD/YY';
export const DefaultDOBDate = 'MM/DD/YYYY';
export const DefaultTime = 'HHmm';

export const TransportStatusPreDefined = [
  {
    title: 'Accepted',
    value: 'accepted',
  },
  {
    title: 'Rejected',
    value: 'rejected',
  },
  {
    title: 'En Route',
    value: 'en_route',
  },
  {
    title: 'Arrived at pick-up',
    value: 'arrived_at_pick_up',
  },
  {
    title: 'Patient loaded',
    value: 'patient_loaded',
  },
  // {
  //   title: 'On Hold',
  //   value: 'on_hold',
  // },
  {
    title: 'Arrived at drop-off',
    value: 'arrived_at_drop_off',
  },
  {
    title: 'Completed',
    value: 'completed',
  },
  {
    title: 'Aborted',
    value: 'aborted',
  },
  {
    title: 'No Show',
    value: 'noshow',
  },
];

export const BillingStatus = {
  VALIDATED_STATUS: 'validated',
  LOCKED_STATUS: 'locked',
  UNINVOICED_STATUS: 'uninvoiced',
  PARTIALLY_PAID_STATUS: 'part_paid',
  FULLY_PAID_STATUS: 'fully_paid',
  DISPUTED_STATUS: 'disputed',
  DISPUTE_ACCEPTED_STATUS: 'dispute_accepted',
  CANCELLED_STATUS: 'cancelled',
  REFUNDED_STATUS: 'refunded',
  SEND_INVOICE_STATUS: 'send_invoiced',
  ARCHIVE_STATUS: 'archive',
};

export const renderBillingStatus = (type) => {
  switch (type) {
    case 'validated':
      return 'Validated';
    case 'locked':
      return 'Locked';
    case 'uninvoiced':
      return 'Uninvoiced';
    case 'part_paid':
      return 'Partially Paid';
    case 'fully_paid':
      return 'Fully Paid';
    case 'disputed':
      return 'Disputed';
    case 'dispute_accepted':
      return 'Dispute Accepted';
    case 'cancelled':
      return 'Canceled';
    case 'refunded':
      return 'Refunded';
    case 'send_invoiced':
      return 'Send Invoice';
    default:
      return type;
  }
};
export const renderPaymentType = (type) => {
  switch (type) {
    case 'partially':
      return 'Partially Paid';
    case 'fully':
      return 'Fully Paid';
    case 'cc':
      return 'CC';
    case 'check':
      return 'Check';
    case 'ach':
      return 'ACH';
    case 'cash':
      return 'Cash';
    case 'credit_memo':
      return 'Credit Memo';
    case 'debit_memo':
      return 'Debit Memo';
    case 'other':
      return 'Other';
    default:
      return type;
  }
};

export const renderPaymentStatus = (type) => {
  switch (type) {
    case 'created':
      return 'Created';
    case 'applied':
      return 'Applied';
    case 'applied_partially':
      return 'Applied Partially';
    default:
      return type;
  }
};
export const BillingStatusAdminPreDefined = [
  {
    title: 'Initialized',
    value: 'initialized',
  },
  {
    title: 'Validated',
    value: 'validated',
  },
  {
    title: 'Send Invoice',
    value: 'send_invoiced',
  },
  {
    title: 'Locked',
    value: 'locked',
  },
  {
    title: 'Uninvoiced',
    value: 'uninvoiced',
  },
  {
    title: 'Partially Paid',
    value: 'part_paid',
  },
  {
    title: 'Fully Paid',
    value: 'fully_paid',
  },

  {
    title: 'Disputed',
    value: 'disputed',
  },
  {
    title: 'Dispute Accepted',
    value: 'dispute_accepted',
  },
  {
    title: 'Canceled',
    value: 'cancelled',
  },
  {
    title: 'Refunded',
    value: 'refunded',
  },
];
export const BillingStatusPreDefined = [
  {
    title: 'Initialized',
    value: 'initialized',
  },
  {
    title: 'Validated',
    value: 'validated',
  },
  {
    title: 'Send Invoice',
    value: 'send_invoiced',
  },
  {
    title: 'Locked',
    value: 'locked',
  },
  {
    title: 'Uninvoiced',
    value: 'uninvoiced',
  },
  {
    title: 'Disputed',
    value: 'disputed',
  },
  {
    title: 'Dispute Accepted',
    value: 'dispute_accepted',
  },
  {
    title: 'Canceled',
    value: 'cancelled',
  },
];


export const generateTripTypes = (value) => {
  switch (value) {
    case 'scheduled':
      // Do something for 'scheduled' option
      return 'Scheduled';
    case 'will_call':
      return 'Will Call';
    case 'on_hold':
      return 'On Hold';
    default:
     return value;
  }
}
export const invalidChars = ['-', '+', 'e', 'E'];
export const invalidSymbol = ['e', 'E'];
// export const GanttData = [
//   {
//     taskID: 1,
//     taskName: "Project Schedule",
//     startDate: new Date("02/02/2019 01:00"),
//     endDate: new Date("02/02/2019 04:00"),
//     duration: 6,
//     subtasks: [
//       {
//         TaskID: 2,
//         TaskName: "Identify site location",
//         StartDate: new Date("03/29/2019"),
//         Duration: 3,
//         Progress: 30,
//         work: 10,
//         resources: [{ resourceId: 1, resourceUnit: 50 }],
//       },
//       {
//         TaskID: 3,
//         TaskName: "Perform soil test",
//         StartDate: new Date("04/03/2019"),
//         Duration: 4,
//         resources: [{ resourceId: 1, resourceUnit: 70 }],
//         Predecessor: 2,
//         Progress: 30,
//         work: 20,
//       },
//       {
//         TaskID: 4,
//         TaskName: "Soil test approval",
//         StartDate: new Date("04/09/2019"),
//         Duration: 4,
//         resources: [{ resourceId: 1, resourceUnit: 25 }],
//         Predecessor: 3,
//         Progress: 30,
//         work: 10,
//       },
//     ],
//   },
//   {
//     taskID: 1,
//     taskName: "Project Schedule",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     // parentID: 1,
//     duration: 3,
//   },
//   {
//     taskID: 3,
//     taskName: "Plan timeline",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     duration: 6,
//     progress: "90",
//     // parentID: 1,
//   },
//   {
//     taskID: 4,
//     taskName: "Plan budget",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     duration: 6,
//     progress: "90",
//     // parentID: 2,
//   },
//   {
//     taskID: 5,
//     taskName: "Allocate resources",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     duration: 6,
//     progress: "75",
//     // parentID: 2,
//   },
//   {
//     taskID: 6,
//     taskName: "Planning complete",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     duration: 3,
//     // parentID: 2,
//   },
//   {
//     taskID: 7,
//     taskName: "Design",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     // parentID: 1,
//   },
//   {
//     taskID: 8,
//     taskName: "Software Specification",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 11:00"),
//     duration: 3,
//     progress: "60",
//     // parentID: 7,
//   },
//   {
//     taskID: 9,
//     taskName: "Develop prototype",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     duration: 3,
//     progress: "100",
//     // parentID: 7,
//   },
//   {
//     taskID: 10,
//     taskName: "Get approval from customer",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     duration: 2,
//     progress: "100",
//     // parentID: 7,
//   },
//   {
//     taskID: 11,
//     taskName: "Design complete",
//     startDate: new Date("02/02/2019 08:00"),
//     endDate: new Date("02/02/2019 10:00"),
//     duration: 2,
//     // parentID: 7,
//   },
// ];

export const GanttData = [
  {
    TaskID: 1,
    TaskName: 'Project initiation',
    StartDate: new Date('02/02/2022 02:00'),
    EndDate: new Date('02/03/2022 22:00'),
    subtasks: [
      {
        TaskID: 2,
        TaskName: 'Identify site location',
        StartDate: new Date('02/02/2022 10:00'),
        EndDate: new Date('02/02/2022 12:00'),
        Duration: 6,
        Progress: 90,
        work: 10,
        resources: [{ resourceId: 1, resourceUnit: 50 }],
      },
      // {
      //   TaskID: 3,
      //   TaskName: "Perform soil test",
      //   StartDate: new Date("02/02/2022 19:00"),
      //   Duration: 4,
      //   resources: [{ resourceId: 1, resourceUnit: 70 }],
      //   Predecessor: 2,
      //   Progress: 30,
      //   work: 20,
      // },
      // {
      //   TaskID: 4,
      //   TaskName: "Soil test approval",
      //   StartDate: new Date("02/02/2022 07:00"),
      //   Duration: 4,
      //   resources: [{ resourceId: 1, resourceUnit: 25 }],
      //   Predecessor: 3,
      //   Progress: 30,
      //   work: 10,
      // },
    ],
  },
  {
    TaskID: 2,
    TaskName: 'Project initiation',
    StartDate: new Date('02/02/2022 08:00'),
    EndDate: new Date('02/02/2022 22:00'),
    subtasks: [
      {
        TaskID: 3,
        TaskName: 'Identify site location',
        StartDate: new Date('02/02/2022 09:00'),
        EndDate: new Date('02/02/2022 12:00'),
        Duration: 6,
        Progress: 90,
        work: 10,
        // resources: [{ resourceId: 3, resourceUnit: 100 }],
      },
    ],
  },
  // {
  //   TaskID: 5,
  //   TaskName: "Project estimation",
  //   StartDate: new Date("03/29/2019"),
  //   EndDate: new Date("04/21/2019"),
  //   subtasks: [
  //     {
  //       TaskID: 6,
  //       TaskName: "Develop floor plan for estimation",
  //       StartDate: new Date("04/01/2019"),
  //       Duration: 5,
  //       Progress: 30,
  //       resources: [{ resourceId: 2, resourceUnit: 50 }],
  //       work: 30,
  //     },
  //     {
  //       TaskID: 7,
  //       TaskName: "List materials",
  //       StartDate: new Date("04/04/2019"),
  //       Duration: 4,
  //       resources: [{ resourceId: 2, resourceUnit: 40 }],
  //       Predecessor: "6FS-2",
  //       Progress: 30,
  //       work: 40,
  //     },
  //     {
  //       TaskID: 8,
  //       TaskName: "Estimation approval",
  //       StartDate: new Date("04/09/2019"),
  //       Duration: 4,
  //       resources: [{ resourceId: 2, resourceUnit: 75 }],
  //       Predecessor: "7FS-1",
  //       Progress: 30,
  //       work: 60,
  //     },
  //   ],
  // },
  // {
  //   TaskID: 9,
  //   TaskName: "Site work",
  //   StartDate: new Date("04/04/2019"),
  //   EndDate: new Date("04/21/2019"),
  //   subtasks: [
  //     {
  //       TaskID: 10,
  //       TaskName: "Install temporary power service",
  //       StartDate: new Date("04/01/2019"),
  //       Duration: 14,
  //       Progress: 30,
  //       resources: [{ resourceId: 3, resourceUnit: 75 }],
  //     },
  //     {
  //       TaskID: 11,
  //       TaskName: "Clear the building site",
  //       StartDate: new Date("04/08/2019"),
  //       Duration: 9,
  //       Progress: 30,
  //       Predecessor: "10FS-9",
  //       resources: [3],
  //     },
  //     {
  //       TaskID: 12,
  //       TaskName: "Sign contract",
  //       StartDate: new Date("04/12/2019"),
  //       Duration: 5,
  //       resources: [3],
  //       Predecessor: "11FS-5",
  //     },
  //   ],
  // },
  // {
  //   TaskID: 13,
  //   TaskName: "Foundation",
  //   StartDate: new Date("04/04/2019"),
  //   EndDate: new Date("04/21/2019"),
  //   subtasks: [
  //     {
  //       TaskID: 14,
  //       TaskName: "Excavate for foundations",
  //       StartDate: new Date("04/01/2019"),
  //       Duration: 2,
  //       Progress: 30,
  //       resources: [4],
  //     },
  //     {
  //       TaskID: 15,
  //       TaskName: "Dig footer",
  //       StartDate: new Date("04/04/2019"),
  //       Duration: 2,
  //       Predecessor: "14FS + 1",
  //       resources: [4],
  //     },
  //     {
  //       TaskID: 16,
  //       TaskName: "Install plumbing grounds",
  //       StartDate: new Date("04/08/2019"),
  //       Duration: 2,
  //       Progress: 30,
  //       Predecessor: 15,
  //       resources: [4],
  //     },
  //   ],
  // },
  // {
  //   TaskID: 17,
  //   TaskName: "Framing",
  //   StartDate: new Date("04/04/2019"),
  //   EndDate: new Date("04/21/2019"),
  //   subtasks: [
  //     {
  //       TaskID: 18,
  //       TaskName: "Add load-bearing structure",
  //       StartDate: new Date("04/03/2019"),
  //       Duration: 2,
  //       Progress: 30,
  //       resources: [5],
  //     },
  //     {
  //       TaskID: 19,
  //       TaskName: "Natural gas utilities",
  //       StartDate: new Date("04/08/2019"),
  //       Duration: 4,
  //       Predecessor: "18",
  //       resources: [5],
  //     },
  //     {
  //       TaskID: 20,
  //       TaskName: "Electrical utilities",
  //       StartDate: new Date("04/11/2019"),
  //       Duration: 2,
  //       Progress: 30,
  //       Predecessor: "19FS + 1",
  //       resources: [5],
  //     },
  //   ],
  // },
];
