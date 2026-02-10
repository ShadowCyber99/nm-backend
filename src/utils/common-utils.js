/* eslint-disable array-callback-return */
/* eslint-disable no-useless-escape */
import React, { useContext, useEffect, useCallback } from 'react';
import {
  UNSAFE_NavigationContext as NavigationContext,
  Link,
} from 'react-router-dom';
import {
  VALID_URL,
  VALID_US_ZIP,
  VALID_LARGE_NUMBER,
  FIRST_CHARACTER_IN_WORDS,
  NUMBER_UPTO_ONE_DECIMAL,
  VALID_EMAIL,
  MINIMUM_LENGTH,
} from './regexs';
import history from '../redux/lib/history';
import momentTime from 'moment';
import {
  DateTime,
  DefaultDate,
  DefaultDateTime,
  DefaultDOBDate,
  DefaultTime,
} from './constant';
import moment from 'moment-timezone';
import CryptoJS from 'crypto-js';
import axios from 'axios';
const secretKey = process.env.REACT_APP_SECRET_KEY;
/**
 * Checks if a valid string;
 * @param val: number/string/object/array != (undefined or null)
 */
export const validValue = (val) =>
  typeof val !== 'undefined' && val !== undefined && val !== null;

/**
 * Get window width and height
 */
export const getWindowDimensions = () => {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
  return {
    width: x,
    height: y,
  };
};

/**
 * get element offset (width & height)
 * @param el: object
 */
export const getElementOffset = (el) => {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};

/**
 * Serailize json to query string
 * @param {*} object
 */
export const jsonToQueryString = (obj) =>
  strictValidObject(obj) &&
  Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');

/**
 * Checks if a valid string
 * @param str: string
 */
export const strictValidString = (str) => !!str && typeof str === 'string';

/**
 * Checks if a valid string and validate with min length.
 * @param str: string
 */
export const strictValidStringWithMinLength = (str, length = 1) =>
  !!str && typeof str === 'string' && str.length >= length;

/**
 * Checks if a valid string which when split with a delimeter will give an array with specified minimum length
 * @param str: string
 * @param delimeter: string
 * @param minLength: integer
 */
export const strictValidSplittableStringWithMinLength = (
  str,
  delimeter,
  minLength,
) =>
  strictValidString(str) &&
  strictValidArrayWithMinLength(str.split(delimeter), minLength);

/**
 * Typecast or converts forcefully a string, an object or an array to string else returns null
 * @param str: string
 */
export const typeCastToString = (str) =>
  (!!str &&
    ((strictValidString(str) && str) ||
      str.toString() ||
      JSON.stringify(str))) ||
  '';

/**
 * Capitalizes the first letter of every word in string
 * @param str: string
 */
export const capitalizeFirstLetter = (str) =>
  (strictValidString(str) &&
    str.replace(FIRST_CHARACTER_IN_WORDS, (l) => l.toUpperCase())) ||
  null;

/**
 * Capitalizes the first letter of every word in string but not word after apostrophe
 * @param str: string
 */
export const titleCase = (str = '') => {
  if (!strictValidString(str)) return null;
  const strArr = str.toLowerCase().split(' ');
  for (let i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
  }
  return strArr.join(' ');
};

/**
 * Get name & extension from fileName
 * @param fileName: string
 */
export const getFileNameAndExtension = (fileName) =>
  (strictValidString(fileName) &&
    strictValidSplittableStringWithMinLength(fileName, '.', 2) && {
      name: fileName.split('.')[0],
      ext: fileName.split('.')[1],
    }) ||
  {};

export const validAlert = (alert) =>
  validObjectWithParameterKeys(alert, ['message', 'type']) &&
  validValue(alert.message) &&
  validValue(alert.type);

/**
 * Checks if given value is strictly a number
 * @param num: number
 */
export const strictValidNumber = (num) =>
  validValue(num) && typeof num === 'number';

export const strictIsPositiveValidNumber = (num) => {
  num = parseInt(num);
  return validValue(num) && typeof num === 'number' && num > 0;
};

/**
 * Checks if a valid array
 * @param arr: array
 */
export const strictValidArray = (arr) => arr && Array.isArray(arr);

/**
 * Checks if a valid array with minimum specified length
 * @param arr: array
 * @param minLength: integer
 */
export const strictValidArrayWithMinLength = (arr, minLength) =>
  strictValidArray(arr) && arr.length >= minLength;

/**
 * Checks if a valid array with length
 * @param arr: array
 */
export const strictValidArrayWithLength = (arr) =>
  strictValidArray(arr) && !!arr.length;

/**
 * Checks if a valid object
 * @param obj: object
 */

export const strictValidObjWithKeysAndArrayWithLength = (obj) =>
  strictValidObject(obj) &&
  !!Object.keys(obj).length &&
  strictValidArray(obj.data) &&
  !!obj.data.length;

export const zoneFormat = (zone) => {
  switch (zone) {
    case 'Zone1':
      return '(Z1)';
    case 'Zone2':
      return '(Z2)';
    case 'Zone3':
      return '(Z3)';
    default:
      return zone;
  }
};
export const strictValidObject = (obj) =>
  obj &&
  obj === Object(obj) &&
  Object.prototype.toString.call(obj) !== '[object Array]';

/**
 * Checks if a valid object with keys
 * @param obj: object
 */
export const strictValidObjectWithKeys = (obj) =>
  strictValidObject(obj) && !!Object.keys(obj).length;

/**
 * Checks if a valid object with specified keys
 * @param obj: object
 * @param parameterKeys: array
 */
export const validObjectWithParameterKeys = (obj, parameterKeys = []) =>
  strictValidObjectWithKeys(obj) &&
  strictValidArrayWithLength(parameterKeys) &&
  Object.keys(obj).filter((k) => parameterKeys.indexOf(k) > -1).length ===
    parameterKeys.length;

/**
 * Generates a regular expression from a given list of regular expressions
 * @param regExpList: array of regular expression strings
 */

export const validStringinArray = (array) => {
  const hasBlankString = array.some(
    (value) => value === '' || value === undefined,
  );
  if (hasBlankString) {
    return true;
  }
};
export const concatenateRegularExpressions = (regExpList = []) => {
  let regExp = new RegExp();
  if (strictValidArrayWithLength(regExpList)) {
    try {
      regExp = new RegExp(regExpList.join(''));
    } catch (error) {
      // Do nothing
    }
  }
  return regExp;
};

/**
 * Gets file extension
 * @param fileName: string
 */
export const getFileExtension = (fileName) =>
  (strictValidString(fileName) &&
    fileName.substring(fileName.lastIndexOf('.'), fileName.length)) ||
  '';

/**
 * Typecasts a key value pair (k, v) to string and appends it to or appends a specified string value to it
 * based on appendAfter boolean variable
 * @param k: string
 * @param v: string
 * @param appendString: string
 * @param appendAfter: boolean
 */
export const addKeyValuePairAsString = (
  k,
  v,
  appendString = '',
  appendAfter = true,
) => {
  let str = '';
  if (!appendAfter) {
    str += typeCastToString(appendString);
  }
  if (validValue(v)) {
    if (['string', 'number', 'boolean'].indexOf(typeof v) > -1) {
      str = `${k}: ${typeCastToString(v)}`;
    } else if (strictValidArrayWithLength(v)) {
      str = `${k}: [${v.join(', ')}]`;
    } else {
      str = `${k}: [${JSON.stringify(v)}]`;
    }
  } else {
    str = `${k}: `;
  }
  if (appendAfter) {
    str += typeCastToString(appendString);
  }
  return str;
};

/**
 * Typecasts an immutable reducer object to its actual values
 * @param immutableObject: object
 */
export const typeCastToKeyValueObject = (immutableObject) =>
  (strictValidObject(immutableObject) &&
    immutableObject instanceof Map &&
    immutableObject.toJSON()) ||
  (strictValidObject(immutableObject) &&
    validObjectWithParameterKeys(immutableObject, ['size', '_root']) &&
    immutableObject.toJSON()) ||
  (strictValidObject(immutableObject) && immutableObject) ||
  (!strictValidObject(immutableObject) &&
    validValue(immutableObject) &&
    immutableObject);

/**
 * Imports all files in a directory
 * @param importedObj: object
 */
export const importImagesFromImageDirectory = (importedObj) => {
  let filesObj = {};
  importedObj.keys().forEach((file) => {
    filesObj[file.replace('./', '')] = importedObj(file);
  });
  return filesObj;
};

/**
 * Loads a route
 * @param dispatch: function
 * @param route: string
 */
export const loadRoute = (route) => {
  if (route) {
    history.push(route);
    return;
  }
  history.push('/');
};

export const goBack = () => {
  window.history.back();
};

export const strictFilterArrayWithKey = (target, key_name) => {
  let return_object = [0];
  if (target.length > 0) {
    return_object = target.map(function (key) {
      return key[key_name];
    });
  }
  return return_object;
};

export const strictValidArrayWithKey = (array, key_name) => {
  return array.includes(key_name);
};

export const strictFindObjectWithKey = (mulArray, key, val) => {
  return mulArray.find((x) => x[key] === val);
};

export const isAuthenticated = (user) => {
  return (
    strictValidObjectWithKeys(user) &&
    validObjectWithParameterKeys(user, ['role_id', 'email_id', 'role_name'])
  );
};
/**
 * Remove null or undefined key value pairs from an object
 * @param obj: object
 * @param removeEmptyArray: bool
 */
export const removeInValidKeyValuePairs = (obj, removeEmptyArray) => {
  const res = {};
  if (strictValidObjectWithKeys(obj)) {
    Object.values(obj).forEach((v, k) => {
      if (
        (validValue(v) && !strictValidArray(v)) ||
        strictValidArrayWithLength(v) ||
        (removeEmptyArray && strictValidArrayWithLength(v))
      ) {
        res[Object.keys(obj)[k]] = v;
      }
    });
  }
  return res;
};
export const checktheItemInArray = (arr, val) => {
  const d = arr.indexOf(val);
  return d !== -1;
};
/**
 * Is valid url
 * @param url: string
 */
export const isURLValid = (url) =>
  strictValidString(url) && VALID_URL.test(url);

/**
 * Is valid zip
 * @param zip: string
 */
export const isZipValid = (zip) =>
  strictValidString(zip) && VALID_US_ZIP.test(zip);

/**
 * Get random color
 * @param opacity: string
 */
//we may need to change the below process of getting random colors so thats why i have commented the code for future use
export const randomBGColor = () => {
  var colors = [
    'RED',
    'GREEN',
    'BLUE',
    'DARKSLATEGRAY',
    'MAROON',
    'GRAY',
    'TEAL',
    'PURPLE',
    'MEDIUMVIOLETRED',
    'INDIGO',
    'DARKSLATEBLUE',
    'BROWN',
    'PURPLE',
  ];
  var bgColor = colors[Math.floor(Math.random() * colors.length)];
  // strictValidString(opacity) ?
  // 	"rgb(" + x + "," + y + "," + z + ", " + opacity + ")" :
  // 	"rgb(" + x + "," + y + "," + z + ")"
  return bgColor;
};

/**
 * Formatting number for thousand seperator
 */
export const formatNumber = (num) =>
  strictValidNumber(num) && num.toString().replace(VALID_LARGE_NUMBER, '$1,');

/**
 * Formatting number for thousand seperator
 *
 */
export const formatNumberWithCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

/**
 * Converts integer to double digit example 9 -> 09, 12 -> 12, 992 -> 992
 * @param integer: string
 */
export const integerToDoubleDigit = (integer) =>
  (strictValidNumber(integer) && ('0' + integer).slice(-2)) || '00';

/**
 * Add http to the url;
 * @param integer: string
 */
export const addhttp = (url) => {
  if (strictValidString(url) && !/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = 'http://' + url;
  }
  return url;
};

export const isBlank = (str) => {
  return !str || /^\s*$/.test(str);
};

/**
 * Extract file name from aws s3 path
 * @param url: string
 */
export const extractFileName = (url) => {
  const delimeter = '_';
  let response = (strictValidString(url) && url.split('/').pop()) || '';
  let fileNameArr = [];
  if (strictValidSplittableStringWithMinLength(response, delimeter, 1)) {
    fileNameArr = response.split(delimeter);
    fileNameArr.shift();
    response = fileNameArr.join(delimeter);
  }
  return response;
};

export const getHours = (hours) => {
  return hours > 1 ? `${hours} Hrs` : `${hours} Hr`;
};

export const getIntegerValue = (val) => Math.round(val);

/**
 * Round off an Integer to 2 decimal places
 * @param value: Integer
 */
export const roundOffTo2Decimals = (value) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

/**
 * Normalize a phone number
 * @param value: String
 */
export const normalizePhone = (value) => {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d]/g, '');
  if (onlyNums.length <= 3) return onlyNums;
  if (onlyNums.length <= 7)
    return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 7)}`;
  return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10,
  )}`;
};

export const deNormalizePhone = (value) =>
  value ? value.replace(/[^\d]/g, '').slice(0, 10) : value;

export const createNavigationLink = (
  link,
  value,
  willOpenInBlankPage = false,
) => {
  return willOpenInBlankPage ? (
    <Link target="_blank" to={link}>
      {value}
    </Link>
  ) : (
    <Link to={link}>{value}</Link>
  );
};

/**
 * Note - This will return number with upto one decimal without round Off
 *
 * function('34.567') = '34.5'
 *
 * @param {value}: Number or(string) eg 8 or '8'
 */

export const uptoOneDecimal = (value = '') => {
  if (!NUMBER_UPTO_ONE_DECIMAL.test(value) && strictValidString(value)) {
    const index = value.indexOf('.');
    return value.substring(0, index + 2);
  }
  return value ? parseFloat(value) : value;
};

/**
 * Scroll modal to top
 */
export const scrollModalToTop = () => {
  const modal = document.getElementsByClassName('modal');
  if (modal.length) {
    modal[0].scrollTop = 0;
  }
};

/**
 * Typecast response from api to specified type, default string
 * @param object: string or object containing key: string
 * @param key: string in object
 * @param type: string
 * @param defaultValue: any
 */
export const typeCastResponse = (
  object,
  key,
  type = 'string',
  defaultValue = null,
) => {
  let response = null;
  switch (type) {
    default:
      break;
    case 'number':
      response =
        (validObjectWithParameterKeys(object, [key]) && Number(object[key])) ||
        defaultValue ||
        0;
      break;
    case 'string':
      response =
        (validObjectWithParameterKeys(object, [key]) &&
          typeCastToString(object[key])) ||
        defaultValue ||
        null;
      break;
    case 'object':
      response =
        (validObjectWithParameterKeys(object, [key]) &&
          strictValidObject(object[key]) &&
          object[key]) ||
        defaultValue ||
        {};
      break;
    case 'array':
      response =
        (validObjectWithParameterKeys(object, [key]) &&
          strictValidArray(object[key]) &&
          object[key]) ||
        defaultValue ||
        [];
      break;
  }
  return response;
};

/**
 * format date in the given format
 */
// export const formatDate = (date, format = 'MM/DD/YYYY') => {
//   return moment(date).format(format);
// };

/**
 * This function convert Mins To Hrs (Hrs:Mins) even given parameter is nagative.
 * e.g (m = -210) -> (-3:30)
 * @param min: Number
 */
export const convertMinsToHrsMins = (min) => {
  let hrs = Math.floor(min / 60);
  hrs += hrs < 0 ? 1 : 0;
  let min2 = Math.round(Math.abs(min % 60));
  min2 = min2 < 10 ? '0' + min2 : min2;
  return hrs + ':' + min2;
};

export const decimalNoToHours = (value) => {
  if (!value) return '0:00';
  return convertMinsToHrsMins(value * 60);
};

/**
 * print address
 * @param {*} str
 * @param {*} length
 */

export const deepCopy = (srcObj) => {
  let outObj = Array.isArray(srcObj) ? [] : {};
  if (typeof srcObj !== 'object' || srcObj === null) {
    return srcObj;
  }
  for (let key in srcObj) {
    outObj[key] = deepCopy(srcObj[key]);
  }
  return outObj;
};

/**
 * Convert minutes to hours and minutes
 */
export function toHoursAndMinutes(mins) {
  if (isNaN(mins) || mins === 0) return '-';

  const hours = Math.floor(mins / 60);
  const minutes = Math.floor(mins % 60);

  let hoursText;
  let minutesText;

  if (hours === 0) {
    hoursText = '';
  } else if (hours === 1) {
    hoursText = `${hours} hour`;
  } else {
    hoursText = `${hours} hours`;
  }

  if (minutes === 0) {
    minutesText = '';
  } else if (minutes === 1) {
    minutesText = `${minutes} minute`;
  } else {
    minutesText = `${minutes} minutes`;
  }

  if (hours === 0 && minutes > 0) {
    return minutesText;
  }

  if (hours > 0 && minutes === 0) {
    return hoursText;
  }

  return `${hoursText} and ${minutesText}`;
}

// checks for http/https and www. prefix

export const formatDuration = (d) => {
  d = Number(d * 60);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  var hDisplay = h > 0 ? h + (h === 1 ? 'h ' : 'h ') : '';
  var mDisplay = m > 0 ? m + (h > 0 ? '' : 'm ') : '';
  var sDisplay = s > 0 ? s + (s === 1 ? 's' : 's') : '';
  return hDisplay + mDisplay + sDisplay;
};

export const popupCenter = (url, title, w, h) => {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `,
  );

  if (window.focus) newWindow.focus();
  return newWindow;
};

export const getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function changeTimezone(date, ianatz) {
  // suppose the date is 12:00 UTC
  var invdate = new Date(
    date.toLocaleString('en-US', {
      timeZone: ianatz,
    }),
  );

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime() - diff); // needs to substract
}

// E.g.

export const getPhoenixDateTime = () => {
  var here = new Date();
  var there = changeTimezone(here, 'America/Phoenix');
  return Date.parse(there);
};
export function formatDateToTimestamp(dateString) {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Get the Unix timestamp in milliseconds
  const timestamp = date.getTime();

  return timestamp;
}
// Add 1 Hour
export const getPhoenixDateTimeAddOneHour = () => {
  var here = new Date();
  here.setHours(here.getHours() + 1);
  var there = changeTimezone(here, 'America/Phoenix');
  return Date.parse(there);
};

export const defaultFormatDateTime = (time, format = DateTime) => {
  // const getTimezone = moment.tz.guess();
  const getTimezone = 'America/Phoenix';
  const getAbbr = moment.tz(getTimezone).format('z');
  const timeFormat = momentTime(time).utcOffset('-0700').format(format);
  return `${timeFormat} ${getAbbr}`;
};

export const defaultPhoenixDateTime = (time, format = DateTime) => {
  const timeFormat = momentTime(time).utcOffset('-0700').format(format);
  return `${timeFormat}`;
};

export const formatDateTime = (time, format = DefaultDateTime) => {
  const timeFormat = momentTime(time).format(format);
  const checkname = timeFormat === 'Invalid date' || null ? 'N/A' : timeFormat;
  return checkname;
};

export const formatNewDateTime = (time, format = DefaultDateTime) => {
  const timeFormat = momentTime(time).format(format);
  const checkname = timeFormat === 'Invalid date' ? null : timeFormat;
  return checkname;
};

export const formatDate = (time, format = DefaultDate) => {
  const timeFormat = momentTime(time).format(format);
  const checkname = timeFormat === 'Invalid date' || null ? 'N/A' : timeFormat;
  return checkname;
};
export const formatTime = (time, format = DefaultTime) => {
  const timeFormat = momentTime(time).format(format);
  return timeFormat;
};
export const dobFormatTime = (time, format = DefaultDOBDate) => {
  const timeFormat = momentTime(time).format(format);
  return timeFormat;
};
export const removeObjectById = (list, id) => {
  if (strictValidNumber(id)) {
    var lists = list.filter((x) => {
      return x.value !== id;
    });
    return lists;
  }
};

export const matchById = (list, id) => {
  if (strictValidNumber(id)) {
    var lists = list.filter((x) => {
      return x.id === id;
    });
    return lists;
  }
};

export const minValue = (min) => (value) =>
  isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;

export const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined,
    );

export const checkArrayObjectOfKeys = (keys, rowData, checkEmail = false) => {
  let required = keys;
  let errors = {};
  let formIsValid = false;
  let data = rowData;

  required.forEach((w) => {
    strictValidArrayWithLength(rowData) &&
      data.map((a) => {
        if (checkEmail) {
          if (a.email_id && !VALID_EMAIL.test(a.email_id)) {
            formIsValid = true;
            errors[w] = 'Please Enter valid Email Id';
          }
          const membersArrayErrors = [];
          if (strictValidArrayWithLength(a.phone_number)) {
            a.phone_number.forEach((member, memberIndex) => {
              if (member && !MINIMUM_LENGTH.test(member)) {
                formIsValid = true;
                errors[w] = 'Please Enter valid Phone Number';
                membersArrayErrors[memberIndex] =
                  'Please Enter Valid Phone Number';
              }
            });
          }
        }

        if (!a[w]) {
          formIsValid = true;
          errors[w] = 'Please fill the required fields';
        }
      });
  });

  if (!strictValidArrayWithLength(rowData)) {
    formIsValid = false;
    errors['roles'] = 'Please select at least one role';
  }
  return formIsValid;
};
export const sampleDecrypt = () => {
  const data =
    'U2FsdGVkX18JkgQRuEEFDj/7eawdbsDevCOFt7YfTZMXa1KR08IqB/FpNck64fRhTZnSu8e5DdD92y59wvWk9bGyv0LcH0SDlrCyOVJiVlFoLWlQSy4C7gWe3X/j9V/S6fSIxjXIwQM1CrFsppRsdilV0GghFcpZcWMcEevGyV+mXIjMFpdB/hnwq0xpPW/N/J1bfDfpArxfGrGwn/R6ilcxpK4NmruzUvjXJa6yRZQZocGBfEOa5UmV3LVjsTHhac6QAlcIi4i9540oz0MadSwJ4R/9aStuAwzLYmO+sfKHPQsEfgzBmj3Y/iG3qKVa+z7DstjSnJ9fr1MMjL8j/DpdVGFlRmfE49Kwm9v+ZCAFGvXk6jpMqR5qNs4ghoUJopfToTji+b6BYgVkd3ECldh5xsb6S/b6SPra66QjPeG6Q/DGx+WSaS2VOCIOyZWULaUjVSnX6zGpPOJWQV18MqfzZrvL2OHx02GcdqhaTdoJatJtEfDTt33wOW3hRcNw1n1t77cnT20p4VsfTEMJREqfbWqHBa0fL7u5WfTr4GCjgEjgUuAleB9pZqi6HyrFJ8Gywnt1CPbTJrOntiEGKBA1r7XNvzl1lQ2jkUOc628=';

  var bytes = CryptoJS.AES.decrypt(data, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  const parsed = JSON.parse(originalText);
  return parsed;
};

export const decrypted = (data) => {
  var bytes = CryptoJS.AES.decrypt(data, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  const parsed = JSON.parse(originalText);
  return parsed;
};

export const encrypted = (data) => {
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey,
  ).toString();
  const jsonData = { encrypt: ciphertext };
  return jsonData;
};
// data: ""
export function useBlocker(blocker, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}
/**
 * Prompts the user with an Alert before they leave the current screen.
 *
 * @param  message
 * @param  when
 */
export function usePrompt(message, when = true) {
  const blocker = useCallback(
    (tx) => {
      let response;
      if (typeof message === 'function') {
        response = message(tx?.location, tx?.action);
        if (typeof response === 'string') {
          response = window.confirm(response);
        }
      } else if (typeof message === 'string') {
        response = window.confirm(message);
      }
      if (response) {
        tx.retry();
      }
    },
    [message],
  );
  return useBlocker(blocker, when);
}
export const getFirstCharcterFromString = (text = '') => {
  if (!strictValidString(text)) {
    return null;
  } else {
    const val = text.charAt(0);
    return titleCase(val);
  }
};
export function limitWords(element, length = 10) {
  return element;
}

const findComponent = (addressComponenets, componentId) => {
  let result;
  addressComponenets.forEach((addressComponenet) => {
    if (addressComponenet.types.indexOf(componentId) >= 0) {
      result = addressComponenet;
    }
  });
  return result;
};

export const parseGoogleAddress = (place) => {
  const addressComponenets = place.address_components;
  const zipComponent = findComponent(addressComponenets, 'postal_code');
  const countryComponent = findComponent(addressComponenets, 'country');
  const cityComponent = findComponent(
    addressComponenets,
    'administrative_area_level_2',
  );
  const stateComponent = findComponent(
    addressComponenets,
    'administrative_area_level_1',
  );
  const localityComponent = findComponent(addressComponenets, 'locality');
  const subLocalityComponent = findComponent(addressComponenets, 'sublocality');
  const address = {
    fullAddress: place.formatted_address,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    zip: zipComponent ? zipComponent.long_name : undefined,
    country: countryComponent ? countryComponent.long_name : undefined,
    city: cityComponent ? cityComponent.long_name : undefined,
    state: stateComponent ? stateComponent.long_name : undefined,
    subLocality: subLocalityComponent
      ? subLocalityComponent.long_name
      : undefined,
    locality: localityComponent ? localityComponent.long_name : undefined,
  };
  return address;
};
export const defaultPropGetter = () => ({});

export const defaultCurrencyFormat = (string) => {
  const num = Number(string);
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const getDistanceFromLatLonInKm = async (lat, long) => {
  try {
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat}&destinations=${long}&departure_time=now&key=${'key'}`,
    );
    return strictValidObjectWithKeys(response.data.rows[0].elements[0].distance)
      ? response.data.rows[0].elements[0]?.distance.text
      : '0.0 miles';
  } catch (error) {}
};

export const getBuildDate = (epoch) => {
  const buildDate = moment(epoch).format('DD-MM-YYY HH:MM');
  return buildDate;
};

export const convertToPounds = (weight, unit) => {
  if (unit === 'KG') {
    return (weight / 2.205).toFixed(2);
  }
  return parseFloat(weight).toFixed(2);
};
export const convertToPoundsWithoutdecimals = (weight, unit) => {
  if (unit === 'KG') {
    return parseFloat(weight).toFixed(0);
  }
  return parseFloat(weight).toFixed(0);
};
