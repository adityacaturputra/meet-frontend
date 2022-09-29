export default function Ppt({ size }) {
  let rescale = size;
  if (!size) {
    rescale = 0;
  }
  return (
    <svg
      width={93 + rescale}
      height={114 + rescale}
      viewBox="0 0 93 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.1985 0C23.7081 0 20.3607 1.38583 17.8927 3.85264C15.4246 6.31944 14.0381 9.66514 14.0381 13.1537V92.0761C14.0381 95.5647 15.4246 98.9104 17.8927 101.377C20.3607 103.844 23.7081 105.23 27.1985 105.23H79.84C83.3303 105.23 86.6777 103.844 89.1458 101.377C91.6138 98.9104 93.0004 95.5647 93.0004 92.0761V35.6071C92.998 32.9916 91.9566 30.484 90.1051 28.6357L64.3502 2.88724C62.4999 1.03902 59.9911 0.000558253 57.3752 0H27.1985ZM20.6183 13.1537C20.6183 11.4094 21.3115 9.73658 22.5456 8.50318C23.7796 7.26978 25.4533 6.57686 27.1985 6.57686H53.5192V29.5959C53.5192 32.2123 54.5591 34.7216 56.4102 36.5717C58.2612 38.4218 60.7717 39.4612 63.3895 39.4612H86.4202V92.0761C86.4202 93.8204 85.7269 95.4932 84.4929 96.7266C83.2588 97.96 81.5851 98.6529 79.84 98.6529H27.1985C25.4533 98.6529 23.7796 97.96 22.5456 96.7266C21.3115 95.4932 20.6183 93.8204 20.6183 92.0761V13.1537ZM85.0581 32.8843H63.3895C62.5169 32.8843 61.6801 32.5379 61.0631 31.9212C60.446 31.3045 60.0994 30.468 60.0994 29.5959V7.93827L85.0581 32.8843Z"
        fill="#F2F4F8"
      />
      <rect
        x="33.316"
        y="46.316"
        width="40.3679"
        height="37.3679"
        rx="2.1934"
        stroke="#F2F4F8"
        strokeWidth="2.63208"
      />
      <circle cx="40.5" cy="51.5" r="11.5" fill="#F2F4F8" />
      <rect
        x="51"
        y="60"
        width="23.3962"
        height="5.35893"
        fill="#F2F4F8"
      />
      <rect x="40" y="51" width="14" height="2" fill="white" />
      <rect x="40" y="51" width="14" height="2" fill="white" />
      <rect
        x="41"
        y="39"
        width="14"
        height="2"
        transform="rotate(90 41 39)"
        fill="white"
      />
      <rect
        x="41"
        y="39"
        width="14"
        height="2"
        transform="rotate(90 41 39)"
        fill="white"
      />
      <rect x="45" y="68" width="30" height="5" fill="#F2F4F8" />
      <rect x="38" y="76" width="35" height="5" fill="#F2F4F8" />
      <rect
        y="91.1992"
        width="45.6226"
        height="22.7998"
        rx="1.75472"
        fill="#EB9647"
      />
      <path
        d="M11.3866 108V98.228H15.5866C16.492 98.228 17.192 98.494 17.6866 99.026C18.1813 99.558 18.4286 100.272 18.4286 101.168C18.4286 102.064 18.1813 102.778 17.6866 103.31C17.192 103.842 16.492 104.108 15.5866 104.108H12.9686V108H11.3866ZM12.9686 102.722H15.4886C15.89 102.722 16.2026 102.619 16.4266 102.414C16.6506 102.199 16.7626 101.896 16.7626 101.504V100.832C16.7626 100.44 16.6506 100.141 16.4266 99.936C16.2026 99.7213 15.89 99.614 15.4886 99.614H12.9686V102.722ZM20.164 108V98.228H24.364C25.2693 98.228 25.9693 98.494 26.464 99.026C26.9586 99.558 27.206 100.272 27.206 101.168C27.206 102.064 26.9586 102.778 26.464 103.31C25.9693 103.842 25.2693 104.108 24.364 104.108H21.746V108H20.164ZM21.746 102.722H24.266C24.6673 102.722 24.98 102.619 25.204 102.414C25.428 102.199 25.54 101.896 25.54 101.504V100.832C25.54 100.44 25.428 100.141 25.204 99.936C24.98 99.7213 24.6673 99.614 24.266 99.614H21.746V102.722ZM32.5673 99.628V108H30.9853V99.628H28.0733V98.228H35.4793V99.628H32.5673Z"
        fill="white"
      />
    </svg>
  );
}