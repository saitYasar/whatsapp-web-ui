import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../icons";
import {
  Container,
  SelectButton,
  Dropdown,
  Option,
  Checkbox,
  Label,
  SelectedCount,
} from "./styles";

export type MultiSelectOption = {
  id: string;
  label: string;
  labelKey?: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function MultiSelect({
  options,
  selectedIds,
  onChange,
  placeholder,
  className,
}: MultiSelectProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const getLabel = (option: MultiSelectOption) => {
    return option.labelKey ? t(option.labelKey) : option.label;
  };

  const selectedLabels = selectedIds
    .map((id) => {
      const option = options.find((opt) => opt.id === id);
      return option ? getLabel(option) : null;
    })
    .filter(Boolean)
    .join(", ");

  return (
    <Container ref={containerRef} className={className}>
      <SelectButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <span>
          {selectedIds.length > 0 ? (
            <>
              {selectedLabels}
              <SelectedCount>({selectedIds.length})</SelectedCount>
            </>
          ) : (
            placeholder || t("messageTypes.selectPlaceholder")
          )}
        </span>
        <Icon id="downArrow" className="arrow-icon" />
      </SelectButton>
      {isOpen && (
        <Dropdown>
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <Option
                key={option.id}
                onClick={() => handleToggle(option.id)}
                $isSelected={isSelected}
              >
                <Checkbox $isSelected={isSelected}>
                  {isSelected && <Icon id="check" />}
                </Checkbox>
                <Label>{getLabel(option)}</Label>
              </Option>
            );
          })}
        </Dropdown>
      )}
    </Container>
  );
}


