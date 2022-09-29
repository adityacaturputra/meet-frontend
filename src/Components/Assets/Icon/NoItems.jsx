import PropTypes from "prop-types";
import NoData from "./NoData";

function NoItems({
  label,
  classNames = { wrapper: "", icon: "", label: "" },
}) {
  return (
    <div
      className={`mx-auto my-auto flex text-grey items-center justify-center flex-col gap-5 ${classNames.wrapper}`}
    >
      <NoData className={`w-32 h-32 ${classNames.icon}`} />
      <p className={`text-2xl font-normal ${classNames.label}`}>
        {label}
      </p>
    </div>
  );
}

NoItems.propTypes = {
  label: PropTypes.string,
  classNames: PropTypes.shape({
    wrapper: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
  }),
};

NoItems.defaultProps = {
  label: "No items",
  classNames: {
    wrapper: "",
    icon: "",
    label: "",
  },
};

export default NoItems;
