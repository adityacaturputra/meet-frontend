import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

function DiamondFill({ className, width }) {
  return (
    <Icon
      icon="bi:x-diamond-fill"
      className={className}
      width={width}
    />
  );
}

export default DiamondFill;

DiamondFill.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
};
