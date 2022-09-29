import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function MenuFill({ width }) {
  return <Icon icon="eva:menu-fill" color="#016DB2" width={width} />;
}

MenuFill.propTypes = {
  width: PropTypes.number.isRequired,
};
