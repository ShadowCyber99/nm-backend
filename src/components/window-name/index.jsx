import React from "react";
import { Helmet } from "react-helmet-async";
import { strictValidString } from "../../utils/common-utils";

function WindowTitle({ title = "" }) {
  return (
    <Helmet>
      <title>
        {title} {strictValidString(title) ? '||' : ''} GMTCare New Mexico
      </title>
    </Helmet>
  );
}

export default WindowTitle;
