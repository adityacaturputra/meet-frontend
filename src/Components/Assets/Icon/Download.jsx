// eslint-disable-next-line import/no-extraneous-dependencies
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function Download({ color = "#878D96" }) {
  return (
    <Icon
      icon="ant-design:download-outlined"
      color={color}
      fontSize={19}
    />
  );
}

Download.propTypes = {
  color: PropTypes.string.isRequired,
};
