import { strictValidNumber, strictValidObjectWithKeys } from './common-utils';

// 5 ===> Admin , 8 ===> Super Admin  6 ===> Manager
export const checkRolesPermissions = (user) => {
  const key =
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id;
  switch (key) {
    case 5:
      return false;
    case 6:
      return false;
    case 8:
      return false;
    default:
      return true;
  }
};
// 5 ===> Admin , 8 ===> Super Admin  11 ===> Manager

export const editBalanceRolesPermissions = (user) => {
  const key =
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id;
  switch (key) {
    case 5:
      return false;
    case 11:
      return false;
    case 8:
      return false;
    default:
      return true;
  }
};

export const OnlySuperAdmin = (user) => {
  const key =
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id;
  switch (key) {
    case 8:
      return true;
    default:
      return false;
  }
};
export const OnlyAdmins = (user) => {
  const key =
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id;
  switch (key) {
    case 8:
      return true;
    case 5:
      return true;
    default:
      return false;
  }
};
