import styled from "styled-components";

export const MenuContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

export const MenuButton = styled.button<{ $isOpen?: boolean }>`
  background: ${(props) => (props.$isOpen ? props.theme.common.primaryColor : "transparent")};
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 4px;
  opacity: 0;
  min-width: 28px;
  min-height: 28px;

  .icon {
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme.common.subHeadingColor};
  }

  &:hover {
    background: ${(props) => props.theme.common.subHeadingColor}20;
    opacity: 1;
  }
`;

export const MenuPopover = styled.div<{ $isOpponent?: boolean }>`
  position: absolute;
  top: 0;
  ${(props) => (props.$isOpponent ? "right: calc(100% + 8px);" : "left: calc(100% + 8px);")}
  min-width: 200px;
  background: ${(props) => props.theme.common.secondaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.options.boxShadow};
  z-index: 1000;
  padding: 4px 0;
  overflow: hidden;
`;

export const MenuItem = styled.div<{ $isDanger?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${(props) =>
    props.$isDanger ? props.theme.common.errorColor : props.theme.common.mainHeadingColor};

  &:hover {
    background: ${(props) => props.theme.common.primaryColor};
  }

  &:active {
    background: ${(props) => props.theme.common.borderColor};
  }
`;

export const MenuItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 20px;

  .icon {
    width: 18px;
    height: 18px;
  }
`;

export const MenuItemText = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  flex: 1;
`;

