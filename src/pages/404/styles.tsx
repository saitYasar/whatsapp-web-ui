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
  opacity: 0.3;
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
  margin-bottom: 20px;
`;

export const ErrorCode = styled.div`
  font-size: 6rem;
  font-weight: 300;
  color: ${(props) => props.theme.common.mainHeadingColor};
  opacity: 0.4;
  line-height: 1;
  letter-spacing: 8px;
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 2rem;
  font-weight: 400;
  margin: 0;
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
  margin: 0;

  &:last-of-type {
    padding-top: 30px;
    font-size: 0.85rem;
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`;

export const Link = styled.a`
  margin-left: 5px;
  text-decoration: underline;
  color: ${(props) => props.theme.common.tertiaryColor};
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

export const IconWrapper = styled.i`
  color: ${(props) => props.theme.chatRoom.profileActionColor};
  margin-left: 2px;
  animation: heartbeat 1.5s ease-in-out infinite;

  @keyframes heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

