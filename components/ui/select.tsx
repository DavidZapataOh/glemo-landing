import React, { forwardRef } from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import * as SelectPrimitive from '@radix-ui/react-select';

const Select = forwardRef<
  HTMLDivElement,
  {
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
  }
>(({ options, value, onValueChange, placeholder, disabled, className }, ref) => {
  return (
    <div ref={ref} className={className}>
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className="flex h-10 w-full items-center justify-between rounded-md border border-elementBackground bg-background px-3 py-2 text-sm text-text placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SelectPrimitive.Value placeholder={placeholder || "Select an option"} />
          <SelectPrimitive.Icon>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="animate-in fade-in-80 relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-elementBackground bg-background text-text shadow-md"
            position="popper"
            sideOffset={5}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-elementBackground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <CheckIcon className="h-4 w-4 text-primary" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
});

Select.displayName = "Select";

export { Select }; 