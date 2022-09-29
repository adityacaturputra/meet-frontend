import PropTypes from "prop-types";

export default function SMEIcon({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <rect width="20" height="20" rx="10" fill="#016DB2" />
      <g clipPath="url(#clip0_3378_18582)">
        <path
          d="M10.7875 4.32625C10.3525 3.89125 9.6475 3.89125 9.2125 4.32625L7.03525 6.50425L10 9.46975L12.9655 6.50425L10.7867 4.32625H10.7875ZM13.495 7.0345L10.531 10L13.4965 12.9655L15.6745 10.7867C16.1095 10.3517 16.1095 9.6475 15.6745 9.21325L13.4965 7.0345H13.495ZM12.9655 13.495L10 10.531L7.0345 13.4965L9.21325 15.6745C9.64825 16.1095 10.3525 16.1095 10.7867 15.6745L12.9655 13.4965V13.495ZM6.505 12.9655L9.469 10L6.50425 7.0345L4.32625 9.21325C3.89125 9.64825 3.89125 10.3525 4.32625 10.7867L6.50425 12.9655H6.505Z"
          fill="#F2F4F8"
        />
      </g>
      <defs>
        <clipPath id="clip0_3378_18582">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(4 4)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

SMEIcon.propTypes = {
  size: PropTypes.number,
};

SMEIcon.defaultProps = {
  size: 18,
};
