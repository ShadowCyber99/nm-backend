// 12 Account Receivable
//13 - Account Payable
//10 Billing Clerk
//11 Billing Manager

export const buttonRoleAccess = (data, role_id) => {
  switch (data) {
    case 'CreateInvoices':
      return [12, 13].includes(role_id);
    case 'InvoicingSelectTrips':
      return [12, 13].includes(role_id);
    case 'InvoicingValidateAll':
      return [12, 13].includes(role_id);
    case 'InvoicingLockAll':
      return [10, 12, 13].includes(role_id);
    case 'InvoicingSentAll':
      return [10, 12, 13].includes(role_id);
    case 'sendReceiveDissabled':
      return [10, 13].includes(role_id);
    case 'sendReceiveAction':
      return [12, 13].includes(role_id);
    case 'sendActionUnInvoice':
      return [10].includes(role_id);
    case 'initializedCancelInvoice':
      return [10, 12, 13].includes(role_id);
    case 'initializedValidateInvoice':
      return [12, 13].includes(role_id);
    case 'validatedLockInvoice':
      return [10, 12, 13].includes(role_id);
    case 'validatedAction':
      return [12, 13].includes(role_id);
    case 'lockedSendInvoice':
      return [10, 12, 13].includes(role_id);
    case 'lockedAction':
      return [12, 13].includes(role_id);
    case 'partPaidReceive':
      return [10, 13].includes(role_id);
    case 'partPaidAction':
      return [10, 12].includes(role_id);
    case 'fullyPaidRefundInvoice':
      return [10, 12].includes(role_id);
    case 'validateCancelInvoice':
      return [10, 12, 13].includes(role_id);
    case 'validatedUnInvoice':
      return [10].includes(role_id);
    case 'disputedAccepted':
      return [12, 13].includes(role_id);
    case 'completedTripEditButton':
      return [12, 13].includes(role_id);
    case 'completedTripEditButtonBilling':
      return [10, 11].includes(role_id);
    default:
      return false;
  }
};
