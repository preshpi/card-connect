import { InputProps } from "@/app/types/components/ui/Input";
import Image from "next/image";
import { forwardRef, useState } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value,
      name,
      id,
      type,
      registration,
      additionalClasses,
      placeholder,
      onChange,
      additionalAttributes,
      textarea,
      password,
      pattern,
      rows,
      readOnly,
      cols,
      disabled,
      required,
      minLength,
      maxLength,
      autoComplete,
      options,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
      <div className="flex w-full flex-col gap-y-2">
        <label className="text-left font-medium capitalize px-2 text-white text-[14px]">
          {label}
        </label>
        {!textarea && !options && (
          <div className="relative">
            <input
              name={name}
              id={id}
              value={value}
              ref={ref}
              className={`${
                additionalClasses
                  ? additionalClasses + "w-full text-base"
                  : "w-full rounded-full bg-[#272C39] text-white placeholder:text-[#64748B] px-4 py-3.75 text-base font-normal focus:ring-1 ring-[#64748B] outline-none"
              }`}
              type={!visible ? type : "text"}
              required={required}
              readOnly={readOnly}
              minLength={minLength}
              maxLength={maxLength}
              autoComplete={autoComplete}
              pattern={pattern}
              placeholder={placeholder}
              disabled={disabled}
              onChange={onChange}
              {...registration}
              {...additionalAttributes}
            />
            {password && (
              <i className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-[#64748B]">
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? "Hide password" : "Show password"}
                >
                  <span className="sr-only">
                    {visible ? "Hide password" : "Show password"}
                  </span>
                  {visible ? (
                    <Image
                      src="/icons/Hide.svg"
                      alt="Hide password"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Image
                      src="/icons/Show.svg"
                      alt="Show password"
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </i>
            )}
          </div>
        )}
        {textarea && (
          <textarea
            className="w-full outline-none focus:ring-1 ring-black rounded-md border border-gray-100 bg-transparent px-4 py-4 text-[14px] font-light"
            rows={rows}
            cols={cols}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={onChange}
          ></textarea>
        )}
        {options && (
          <select
            name={name}
            id={id}
            value={value}
            ref={ref as React.Ref<HTMLSelectElement>}
            className={`${
              additionalClasses
                ? additionalClasses + "w-full text-base"
                : "w-full rounded-md border border-gray-100 bg-transparent px-4 py-4 text-base font-light  focus:ring-1 ring-black outline-none"
            }`}
            required={required}
            disabled={disabled}
            onChange={onChange}
            {...additionalAttributes}
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options.map(
              (
                option: string,
                index: number, // Add typing here
              ) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ),
            )}
          </select>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
