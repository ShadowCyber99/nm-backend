import { Stack, Typography } from "@mui/material";
import React from "react";
import {
  strictValidArray,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from "../../../utils/common-utils";
import { formatPhoneNumber } from "../../../utils/regexs";

function CellMapTypes({ data, type, renderValue, renderType }) {
  const returnValue = (a) => {
    if (renderType === "phone") {
      return formatPhoneNumber(a);
    } else {
      return a;
    }
  };
  if (type === "company_contact") {
    return (
      <div>
        {strictValidArrayWithLength(data) ? (
          data.map((a) => {
            return (
              <>
                <Typography
                  style={{
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    color: "#5C6878",
                    fontStyle: "normal",
                    fontWeight: "normal",
                  }}
                >
                  {strictValidObjectWithKeys(a) && strictValidString(a[renderValue])
                    ? strictValidString(a.last_name) && renderValue === "first_name"
                      ? `${a.last_name}, ${returnValue(a[renderValue])}`
                      : returnValue(a[renderValue])
                    : "N/A"}
                </Typography>
              </>
            );
          })
        ) : (
          <Typography
            style={{
              fontSize: 14,
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.1)",
              color: "#5C6878",
              fontStyle: "normal",
              fontWeight: "normal",
            }}
          >
            N/A
          </Typography>
        )}
      </div>
    );
  } else if (type === "corporate_contact_phone") {
    return (
      <div>
        {strictValidArrayWithLength(data) ? (
          data.map((a) => {
            return (
              <>
                {a.enabled === 1 && (
                  <Typography
                    style={{
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      color: "#5C6878",
                      fontStyle: "normal",
                      fontWeight: "normal",
                    }}
                  >
                    {a.phone_number.map((b, index) => {
                      return <Stack>{strictValidString(b) ? returnValue(b) : "N/A"}</Stack>;
                    })}
                  </Typography>
                )}
              </>
            );
          })
        ) : (
          <Typography
            style={{
              fontSize: 14,
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.1)",
              color: "#5C6878",
              fontStyle: "normal",
              fontWeight: "normal",
            }}
          >
            N/A
          </Typography>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {strictValidArrayWithLength(data) ? (
          data.map((a) => {
            return (
              <>
                {a.enabled === 1 && (
                  <Typography
                    style={{
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      color: "#5C6878",
                      fontStyle: "normal",
                      fontWeight: "normal",
                    }}
                  >
                    <Stack>
                      {strictValidObjectWithKeys(a) && strictValidString(a[renderValue])
                        ? strictValidString(a.last_name) && renderValue === "first_name"
                          ? `${a.last_name}, ${returnValue(a[renderValue])}`
                          : returnValue(a[renderValue])
                        : "N/A"}
                      {strictValidObjectWithKeys(a) && strictValidArray(a.phone_number) ? (
                        <>
                          {a.phone_number.map((c, index) => {
                            return <>{index !== 0 && <span>&nbsp; </span>}</>;
                          })}
                        </>
                      ) : null}
                    </Stack>
                  </Typography>
                )}
              </>
            );
          })
        ) : (
          <Typography
            style={{
              fontSize: 14,
              borderWidth: 1,
              borderColor: "rgba(0, 0, 0, 0.1)",
              color: "#5C6878",
              fontStyle: "normal",
              fontWeight: "normal",
            }}
          >
            N/A
          </Typography>
        )}
      </div>
    );
  }
}

export default CellMapTypes;
