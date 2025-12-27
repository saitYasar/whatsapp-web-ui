import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 10px 12px;
  background: ${(props) => props.theme.common.primaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }

  .arrow-icon {
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme.common.headerIconColor};
    transition: transform 0.2s;
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const SelectedCount = styled.span`
  color: ${(props) => props.theme.common.tertiaryColor};
  font-weight: 600;
  margin-left: 4px;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: ${(props) => props.theme.common.secondaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  box-shadow: ${(props) => props.theme.options.boxShadow};
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

export const Option = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${(props) =>
    props.$isSelected ? props.theme.common.primaryColor : "transparent"};

  &:hover {
    background: ${(props) => props.theme.common.primaryColor};
  }
`;

export const Checkbox = styled.div<{ $isSelected: boolean }>`
  width: 18px;
  height: 18px;
  border: 2px solid
    ${(props) =>
      props.$isSelected
        ? props.theme.common.tertiaryColor
        : props.theme.common.borderColor};
  border-radius: 3px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$isSelected ? props.theme.common.tertiaryColor : "transparent"};
  transition: all 0.2s;

  svg {
    width: 12px;
    height: 12px;
    color: white;
  }
`;

export const Label = styled.span`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.9rem;
`;


