import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function Community({ width }) {
  return (
    <Icon
      icon="fluent:people-community-add-28-filled"
      color="#016DB2"
      width={width}
    />
  );
}

Community.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};
