import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function Ask({ width, color }) {
  return (
    <Icon icon="simple-icons:askubuntu" width={width} color={color} />
  );
}

Ask.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  color: PropTypes.string,
};

Ask.defaultProps = {
  color: "#016DB2",
};
