import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function Analytics({ width }) {
  return (
    <Icon
      icon="ic:sharp-space-dashboard"
      color="#016DB2"
      width={width}
    />
  );
}

Analytics.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};
