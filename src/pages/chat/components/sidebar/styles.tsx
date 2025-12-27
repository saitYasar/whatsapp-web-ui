import styled from "styled-components";

export const SidebarContainer = styled.aside`
  min-width: 300px;
  flex: 40%;
  border-right: 1px solid ${(props) => props.theme.common.borderColor};
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1000px) and (max-width: 1300px) {
    flex: 35%;

    & ~ div {
      flex: 65%;
    }
  }

  @media screen and (min-width: 1301px) {
    flex: 30%;

    & ~ div {
      flex: 70%;
    }
  }

  .icon {
    color: ${(props) => props.theme.common.headerIconColor};
  }
`;

export const Header = styled.header`
  background: ${(props) => props.theme.common.primaryColor};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 10px 16px;
  min-height: 60px;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & > * {
    cursor: pointer;
  }
`;

export const ThemeIconContainer = styled.div`
  svg {
    margin-bottom: 2px;
    width: 20px;
    height: 20px;
    fill: ${(props) => props.theme.common.headerIconColor};
  }
`;

export const LanguageIconContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: ${(props) => props.theme.common.primaryColor};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const LanguageText = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(props) => props.theme.common.headerIconColor};
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const FilterWrapper = styled.div`
  padding: 10px 16px;
  background: ${(props) => props.theme.common.secondaryColor};
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const ContactContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
  background: ${(props) => props.theme.common.secondaryColor};
  border-top: 1px solid ${(props) => props.theme.common.borderColor};
`;
