export const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="12"
      r="4.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="17.2" cy="6.8" r="1.35" fill="currentColor" />
  </svg>
);

export const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.198.297-.766.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.373-.025-.522-.075-.148-.67-1.612-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.007-.373-.009-.572-.009-.198 0-.52.074-.793.373-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.883 1.213 3.082.149.198 2.095 3.2 5.076 4.487.709.306 1.26.488 1.691.624.71.226 1.357.194 1.868.118.57-.085 1.758-.719 2.006-1.414.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18.18A8.18 8.18 0 113.82 12 8.193 8.193 0 0112 20.18z" />
  </svg>
);
