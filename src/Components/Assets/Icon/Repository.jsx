import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function Repository({ width }) {
  return (
    <Icon
      icon="fluent:document-28-filled"
      color="#016DB2"
      width={width}
    />
  );
}

Repository.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};
