import { ButtonProps } from "@/app/types/components/ui/Button";

export function Button({
  children,
  className,
  onClick,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (type !== "submit") e.preventDefault(); // Only prevent default for non-submit buttons
        if (onClick) onClick(e);
      }}
      disabled={disabled}
      {...props}
      type={type}
      className={`${className} rounded-full font-medium text-center disabled:hover:bg-opacity-100 hover:bg-opacity-85 transition-all duration-300 text-[16px] w-full py-4 px-4`}
    >
      {children}
    </button>
  );
}
