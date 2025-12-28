import styled from "styled-components";
import Icon from "common/components/icons";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.splash.bg};
  padding: 20px;
`;

export const LoginCard = styled.div`
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${(props) => props.theme.layout.contentBoxShadowColor};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LogoWrapper = styled.div`
  margin-bottom: 30px;
  position: relative;
`;

export const Logo = styled(Icon)`
  fill: ${(props) => props.theme.common.tertiaryColor};
  width: 80px;
  height: 80px;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 10px;
  text-align: center;
`;

export const SubTitle = styled.p`
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.9rem;
  margin-bottom: 30px;
  text-align: center;
  line-height: 1.5;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  .lock-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.common.subHeadingColor};
    width: 20px;
    height: 20px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 45px 12px 15px;
  background: ${(props) => props.theme.common.primaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${(props) => props.theme.common.subHeadingColor};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: ${(props) => props.theme.chatRoom.profileActionColor};
  font-size: 0.85rem;
  text-align: center;
  padding: 8px;
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 4px;
`;

export const FooterText = styled.p`
  margin-top: 30px;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.8rem;
  text-align: center;
`;

export const FooterLink = styled.a`
  color: ${(props) => props.theme.common.tertiaryColor};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const AdminButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  color: ${(props) => props.theme.common.tertiaryColor};
  border: 1px solid ${(props) => props.theme.common.tertiaryColor};
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.common.tertiaryColor};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


