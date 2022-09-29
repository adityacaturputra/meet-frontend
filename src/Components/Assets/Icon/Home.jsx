import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function Home({ width }) {
  return <Icon icon="el:home" color="#016DB2" width={width} />;
}

Home.propTypes = {
  width: PropTypes.number.isRequired,
};
