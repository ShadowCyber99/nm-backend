/* eslint-disable no-useless-concat */
/* eslint-disable no-useless-escape */
export const VALID_URL =
  /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

/**
 * True for 12345, 84001
 * False for 1234, 123456
 */
export const VALID_US_ZIP = /^\d{5}(-\d{4})?$/;

export const VALID_LARGE_NUMBER = /(\d)(?=(\d{3})+(?!\d))/g;

export const FIRST_CHARACTER_IN_WORDS = /\b\w/g;

export const VALID_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i;

export const NEW_VALID_EMAIL = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

export const VALID_TEN_DIGIT_PHONE = /^\d{10}$/;

export const INVALID_NUMBER = /[^\d]/g;

export const INVALID_CHARACTERS = /^\s+$/;

export const TRIM_WHITE_SPACE_AT_END = /\s*$/;

export const STARTING_WITH_HTTPS_OR_HTTPS = /^(\/\/|http|https)/;

export const WHITE_SPACE = /\[(\w+)\]/g;

export const LEADING_DOTS = /^\./;

export const SPECIAL_CHARACTERS = /[ &\/\\#, +()$~%.'":*?<>{}]/g;

export const VALID_NAME = /([a-zA-Z ]){2,30}$/;

export const FIRST_NAME = /^([a-zA-Z-]\s?)+/;

// /^[a-zA-Z-]+([a-zA-Z-\s]+)*/;

export const ALPHA_NUMERIC = /^[a-z0-9]+$/i;

export const MINIMUM_LENGTH = /^.{16,18}$/;
export const VALID_DOB = /^\d{2}\/\d{2}\/\d{4}$/; 

/**
 * At least one lowercase letter, one upper case letter and one number with optional special characters
 */
export const VALID_PASSWORD =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

/**
 * True for 0, 1, 1.0, 1.5, etc
 * False for -1, 1.23, 1.1 etc
 */
export const PART_OF_VALID_NUMBER_OR_HALF_DECIMAL_UP_TO_ONE_PLACE =
  /(^\d+\.$)|(^\d+(\.[0|5])?$)/;

/**
 * True for 0, 1, 1., 1.0, 1.5, etc
 * False for -1, 1.23, 1.1 etc
 */
export const VALID_NUMBER_OR_HALF_DECIMAL_UP_TO_ONE_PLACE = /^\d+(\.[0|5])?$/;

/**
 * True for 3.4, 45.7, etc
 * False for 3.34, 5.67 etc
 *
 */

export const NUMBER_UPTO_ONE_DECIMAL = /^(\d+)?([.]?\d{0,1})?$/;

export const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return (
      "+" + match[1] + " " + "(" + match[2] + ") " + match[3] + "-" + match[4]
    );
  }
  return phoneNumberString;
};
