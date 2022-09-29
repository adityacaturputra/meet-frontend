import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function HQ({ width }) {
  return <Icon icon="ri:hq-fill" color="#016DB2" width={width} />;
}

HQ.propTypes = {
  width: PropTypes.number.isRequired,
};
