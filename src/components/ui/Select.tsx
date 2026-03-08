import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface SelectProps {
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ label, value, onValueChange, placeholder, options, required }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#8B949E] mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              'flex items-center justify-between w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all duration-200'
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <ChevronDown className="w-4 h-4 text-[#8B949E]" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl shadow-black/20 overflow-hidden z-50"
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      'relative flex items-center px-3 py-2 rounded-md text-sm text-[#F0F6FC] cursor-pointer select-none outline-none',
                      'data-[highlighted]:bg-[#21262D] data-[highlighted]:text-[#F0F6FC]'
                    )}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute right-2">
                      <Check className="w-4 h-4 text-[#7C3AED]" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
