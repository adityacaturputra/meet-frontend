import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function ArrowDown({ width }) {
  return <Icon icon="ep:arrow-down-bold" width={width} />;
}

ArrowDown.propTypes = {
  width: PropTypes.number.isRequired,
};
