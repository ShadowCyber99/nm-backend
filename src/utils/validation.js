import {
  strictValidArrayWithMinLength,
  strictValidNumber,
  strictValidString,
} from './common-utils';

export const validateField = (value) => {
  if (strictValidString(value)) {
    return false;
  } else if (strictValidNumber(value)) {
    return false;
  } else if (strictValidArrayWithMinLength(value, 1)) {
    return false;
  } else {
    return true;
  }
};

const validationRuleForCapabilities = [
  ['AMB', 'WC'],
  ['AMB', 'WC', 'STR'],
  ['AMB', 'WC', 'BAR'],
  ['AMB', 'WC', 'ISO'],
  ['WC', 'STR', 'BAR'],
  ['WC', 'STR', 'ISO'],
  ['AMB', 'WC', 'STR', 'BAR', 'ISO'],
  ['AMB', 'WC', 'STR', 'BAR'],
  ['AMB', 'WC', 'STR', 'ISO'],
  ['AMB', 'WC', 'BAR', 'ISO'],
  ['WC', 'STR', 'BAR', 'ISO'],
  ['AMB', 'STR'],
  ['STR', 'BAR', 'ISO', 'AMB'],
  ['AMB', 'STR', 'ISO'],
  ['AMB', 'STR', 'BAR'],
  ['STR', 'WC'],
  ['BAR'],
  ['ISO'],
];
export const checkCapabilityCombination = (names) => {
  const sortedNames = names.slice().sort();
  const result = validationRuleForCapabilities.some((rule) => {
    const sortedRule = rule.slice().sort();
    return (
      sortedRule.length === sortedNames.length &&
      sortedRule.every((val, i) => val === sortedNames[i])
    );
  });

  return result;
};

// export const checkCapabilityCombination = (names) => {
//   console.log('names: ', names);
//   const result = validationRuleForCapabilities.some((rule) =>
//     rule.every((val, i) => val === names[i]),
//   );
//   return result;
// };
