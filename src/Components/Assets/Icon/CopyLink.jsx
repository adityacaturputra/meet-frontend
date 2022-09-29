// eslint-disable-next-line import/no-extraneous-dependencies
import { Icon } from "@iconify/react";

import React from "react";

function CopyLink({ ...rest }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon icon="carbon:copy-link" {...rest} />;
}

export default CopyLink;
