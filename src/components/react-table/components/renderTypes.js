import { Stack, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import React from 'react';
import { useSelector } from 'react-redux';
import { Caccount } from '../../../assets/icons';

import {
  strictValidArrayWithLength,
  strictValidString,
  strictValidObjectWithKeys,
} from '../../../utils/common-utils';
import { user_roles } from '../../../utils/constant';

const CellTypes = ({ value, type, larger = false }) => {
  const capability_roles = useSelector((state) => state.drivers.roles);

  const checkValue = (activeIds) => {
    const d = activeIds.replace(/^"(.*)"$/, '$1');
    const e = d.split(',');
    let ret_vals = {};
    let ret_val = [];
    e.filter((item) => {
      ret_vals = capability_roles.find(
        (x) => x.capability_id === parseInt(item),
      );
      ret_val.push(ret_vals);
      return ret_val;
    });
    return ret_val;
  };

  if (type === 'role') {
    const roleName = user_roles.find((x) => x.value === value);
    return (
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="body">{roleName.title}</Typography>
      </Stack>
    );
  } else if (type === 'vehicle_status') {
    return (
      <Chip
        size="small"
        style={{
          textTransform: 'uppercase',
          marginTop: 5,
        }}
        color={value === 1 ? 'primary' : 'error'}
        label={value === 1 ? 'In Service' : 'Out of Service'}
      />
    );
  } else if (type === 'capability_role') {
    const roleName = strictValidArrayWithLength(capability_roles)
      ? checkValue(value)
      : [];
    return (
      <Stack
        direction="row"
        spacing={0.5}
        style={{
          flexWrap: 'wrap',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {strictValidArrayWithLength(roleName) &&
          roleName.map((res) => {
            return (
              <>
                {strictValidObjectWithKeys(res) &&
                strictValidString(res.name) ? (
                  <Chip
                    size={larger ? 'medium' : 'small'}
                    style={{
                      textTransform: 'uppercase',
                      marginTop: 5,
                      backgroundColor: res.color,
                      color: '#ffff',
                      fontSize: larger ? 20 : 14,
                    }}
                    // color="primary"
                    label={res.name}
                  />
                ) : null}
              </>
            );
          })}
      </Stack>
    );
  } else {
    return (
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Caccount />
        <Typography variant="body">{value}</Typography>
      </Stack>
    );
  }
};
export default CellTypes;
