export function arrayToObject(array, keySelector, valueSelector) {
  return array
    .map((item) => ({ [keySelector(item)]: valueSelector(item) }))
    .reduce((p, n) => ({ ...p, ...n }), {});
}

export function insertItemToObject(object, keyToInsert, valueToInsert) {
  return {
    ...object,
    [keyToInsert]: valueToInsert,
  };
}

export function removeItemFromObject(object, keyToDelete) {
  const { [keyToDelete]: deleted, ...remainingItems } = object;
  return remainingItems;
}

export function updateItemInObject(
  object,
  keyToUpdate,
  valueToUpdate,
  ensureAlreadyExists,
) {
  return !ensureAlreadyExists || object.hasOwnProperty(keyToUpdate)
    ? {
        ...object,
        [keyToUpdate]:
          typeof valueToUpdate === 'object'
            ? {
                ...object[keyToUpdate],
                ...valueToUpdate,
              }
            : valueToUpdate,
      }
    : object;
}

export function updateMultipleItemsInObject(
  object,
  keyValueMap,
  ensureAlreadyExists,
) {
  Object.keys(keyValueMap).forEach((keyToUpdate) => {
    object = updateItemInObject(
      object,
      keyToUpdate,
      keyValueMap[keyToUpdate],
      ensureAlreadyExists,
    );
  });
  return object;
}

export function removeMultipleItemsFromObject(object, keysToDelete) {
  keysToDelete.forEach((keyToDelete) => {
    object = removeItemFromObject(object, keyToDelete);
  });
  return object;
}

export function insertItemToArray(array, indexToInsert, itemToInsert) {
  return [
    ...array.slice(0, indexToInsert),
    itemToInsert,
    ...array.slice(indexToInsert),
  ];
}

export function removeItemFromArray(array, indexToRemove) {
  return indexToRemove !== -1
    ? [...array.slice(0, indexToRemove), ...array.slice(indexToRemove + 1)]
    : [...array];
}

export function appendItemToArray(array, itemToAppend) {
  return [...array, itemToAppend];
}

export function appendMultipleItemsToArray(array, itemsToAppend) {
  return [...array, ...itemsToAppend];
}

export function prependItemToArray(array, itemToPrepend) {
  return [itemToPrepend, ...array];
}

export function prependMultipleItemsToArray(array, itemsToPrepend) {
  return [...itemsToPrepend, ...array];
}

export function popFirstItemFromArray(array) {
  return removeItemFromArray(array, 0);
}

export function popLastItemFromArray(array) {
  return removeItemFromArray(array, array.length - 1);
}

export function updateItemInArray(
  array,
  indexToUpdate,
  itemToUpdate,
  ensureAlreadyExists,
) {
  if (indexToUpdate !== -1) {
    return array.map((item, index) => {
      if (index !== indexToUpdate) {
        return item;
      }
      return {
        ...item,
        ...itemToUpdate,
      };
    });
  } else if (!ensureAlreadyExists) {
    return appendItemToArray(array, itemToUpdate);
  } else {
    return array;
  }
}

export function updateMultipleItemsInArray(
  array,
  indexValueMap,
  ensureAlreadyExists,
) {
  Object.keys(indexValueMap).forEach((indexToUpdate) => {
    array = updateItemInArray(
      array,
      Number(indexToUpdate),
      indexValueMap[indexToUpdate],
      ensureAlreadyExists,
    );
  });
  return array;
}

export function removeMultipleItemsFromArray(array, indexesToRemove) {
  let object = { ...array };
  object = removeMultipleItemsFromObject(object, indexesToRemove);
  return Object.values(object);
}

export function sortArrayByMultipleFields(array, sortDetails) {
  const getValue = (arrayItem, sortDetail) => {
    let value = arrayItem[sortDetail.sortField];
    if (
      (typeof value === 'undefined' || value === null) &&
      sortDetail.nullReplacer
    ) {
      value = sortDetail.nullReplacer;
    }
    return value;
  };

  sortDetails = [...sortDetails].reverse();
  return array.sort((a, b) => {
    let result = 0;
    sortDetails.forEach((sortDetail, i) => {
      if (getValue(a, sortDetail) > getValue(b, sortDetail)) {
        result += (sortDetail.sortDirection !== 'desc' ? 1 : -1) * 10 ** i;
      } else if (getValue(b, sortDetail) > getValue(a, sortDetail)) {
        result += (sortDetail.sortDirection !== 'desc' ? -1 : 1) * 10 ** i;
      }
    });
    return result;
  });
}

export function sortArrayByField(
  array,
  sortField,
  sortDirection = 'asc',
  nullReplacer = null,
) {
  return sortArrayByMultipleFields(array, [
    { sortField, sortDirection, nullReplacer },
  ]);
}

export function filterArrayByField(array, filterField, query) {
  return array.filter(
    (row) => row[filterField].toString().indexOf(query || '') > -1,
  );
}

export function arrayMove(array, fromIndex, toIndex) {
  const item = array.splice(fromIndex, 1)[0];
  array.splice(toIndex, 0, item);
  return array;
}

export function filterBySearchKeywords(items, valueSelector, searchKeywords) {
  return items.filter(
    (item) =>
      searchKeywords.length === 0 ||
      searchKeywords.every(
        (keyword) =>
          valueSelector(item).toLowerCase().indexOf(keyword.toLowerCase()) !==
          -1,
      ),
  );
}

export function distinctArrayByProperty(items, property) {
  return Array.from(new Set(items.map((s) => s[property]))).map((propVal) =>
    items.find((x) => x[property] === propVal),
  );
}
export const updateItem = (array, id, whichvalue, newvalue) => {
  var index = array.findIndex((x) => x.id === id);
  let g = array[index];
  g[whichvalue] = newvalue;

  if (index === -1) {
    // handle error
  } else {
    const d = [...array.slice(0, index), g, ...array.slice(index + 1)];
    return d;
  }
};
