interface LinkIconProps {
  size?: number;
  className?: string;
}

export const LinkIcon = ({ size = 16, className }: LinkIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M11.167 8.83363L12.0003 8.0003C13.1049 6.89573 13.1049 5.10487 12.0003 4.0003C10.8957 2.89573 9.10487 2.89573 8.0003 4.0003L7.16697 4.83364M4.83364 7.16697L4.0003 8.0003C2.89573 9.10487 2.89573 10.8957 4.0003 12.0003C5.10487 13.1049 6.89573 13.1049 8.0003 12.0003L8.83363 11.167M9.5003 6.5003L6.5003 9.5003"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
