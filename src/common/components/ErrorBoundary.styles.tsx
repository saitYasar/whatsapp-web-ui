import styled from "styled-components";

export const Container = styled.div`
  background: ${(props) => props.theme.unselectedChat.bg};
  padding: 20px;
  height: 100%;
  flex: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-bottom: 6px solid ${(props) => props.theme.common.tertiaryColor};
`;

export const ImageWrapper = styled.div`
  width: 550px;
  margin-bottom: 20px;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

export const ErrorCode = styled.div`
  font-size: 4rem;
  font-weight: 300;
  color: ${(props) => props.theme.common.mainHeadingColor};
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 10px;
`;

export const Text = styled.p`
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 500px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const Link = styled.a`
  margin-left: 5px;
  text-decoration: underline;
  color: ${(props) => props.theme.common.tertiaryColor};

  &:hover {
    text-decoration: underline;
  }
`;

export const IconWrapper = styled.i`
  color: red;
  margin-left: 2px;
`;

export const Button = styled.button`
  padding: 12px 24px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.9;
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`;

export const ReloadButton = styled(Button)`
  background: ${(props) => props.theme.common.secondaryColor};
  color: ${(props) => props.theme.common.mainHeadingColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};

  &:hover {
    background: ${(props) => props.theme.common.primaryColor};
  }
`;

export const ErrorDetails = styled.div`
  background: ${(props) => props.theme.common.primaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  padding: 15px;
  margin-top: 20px;
  max-width: 600px;
  text-align: left;
  font-size: 0.85rem;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-family: monospace;
  overflow-x: auto;

  strong {
    color: ${(props) => props.theme.chatRoom.profileActionColor || "#dc3545"};
  }
`;

