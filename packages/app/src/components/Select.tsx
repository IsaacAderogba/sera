import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useManagedState } from "../hooks/useManagedState";
import {
  Dropdown,
  DropdownOption,
  DropdownProps,
  isDropdownItem
} from "./Dropdown";

export interface SelectProps extends DropdownProps {}

export const Select: React.FC<SelectProps> = ({
  defaultValue: defaultValueProp = "",
  value: valueProp,
  onValueChange: onValueChangeProp,

  options,
  ...props
}) => {
  const [value, onValueChange] = useManagedState({
    defaultState: defaultValueProp,
    state: valueProp,
    onStateChange: onValueChangeProp
  });

  const children = options
    .filter(isDropdownItem)
    .find(option => option.value === value)?.label;

  return (
    <Dropdown
      {...props}
      position="absolute"
      options={options}
      value={value}
      onValueChange={onValueChange}
      portalCSS={{ minWidth: "100%", left: 0 }}
    >
      <DropdownOption>{children}</DropdownOption>
      <ChevronDownIcon width={20} style={{ marginRight: 8 }} />
    </Dropdown>
  );
};
