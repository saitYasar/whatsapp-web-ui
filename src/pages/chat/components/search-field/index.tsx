import { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfig } from "common/context/app-config";
import Icon from "common/components/icons";
import { SearchWrapper, IconContainer, Input } from "./styles";

type SearchFieldProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  [x: string]: any;
};

export default function SearchField(props: SearchFieldProps) {
  const { placeholder, value: controlledValue, onChange, onSearch, ...rest } = props;
  const { t } = useTranslation();
  const { appName } = useAppConfig();
  const [internalValue, setInternalValue] = useState("");

  const isControlled = controlledValue !== undefined;
  const searchValue = isControlled ? controlledValue : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
    onSearch?.(newValue);
  };

  const defaultPlaceholder = placeholder ?? t("sidebar.searchPlaceholder", { appName });

  return (
    <SearchWrapper {...rest}>
      <IconContainer>
        <Icon id="search" className="search-icon" />
        <button className="search__back-btn">
          <Icon id="back" />
        </button>
      </IconContainer>
      <Input
        placeholder={defaultPlaceholder}
        value={searchValue}
        onChange={handleChange}
      />
    </SearchWrapper>
  );
}
