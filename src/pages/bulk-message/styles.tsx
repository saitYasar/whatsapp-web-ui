import styled from "styled-components";

export const Container = styled.div`
  background: ${(props) => props.theme.unselectedChat.bg};
  padding: 20px;
  height: 100%;
  flex: 60%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-bottom: 6px solid ${(props) => props.theme.common.tertiaryColor};
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 20px;
`;

export const UploadArea = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

export const UploadInput = styled.input`
  display: none;
`;

export const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  border: 2px dashed ${(props) => props.theme.common.borderColor};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => props.theme.common.secondaryColor};

  &:hover {
    border-color: ${(props) => props.theme.common.tertiaryColor};
    background: ${(props) => props.theme.common.primaryColor};
  }

  .icon {
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.common.tertiaryColor};
  }
`;

export const FileInfo = styled.div`
  margin-top: 10px;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.9rem;
  text-align: center;
`;

export const MessageInput = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 8px;
  background: ${(props) => props.theme.common.secondaryColor};
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PreviewSection = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
`;

export const PreviewList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

export const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};

  &:last-child {
    border-bottom: none;
  }

  span {
    color: ${(props) => props.theme.common.subHeadingColor};
    font-size: 0.9rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

export const Button = styled.button<{ secondary?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${(props) => (props.secondary ? "transparent" : props.theme.common.tertiaryColor)};
  color: ${(props) => (props.secondary ? props.theme.common.tertiaryColor : "white")};
  border: ${(props) => (props.secondary ? `1px solid ${props.theme.common.tertiaryColor}` : "none")};
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`;

export const ErrorText = styled.div`
  color: ${(props) => props.theme.chatRoom.profileActionColor};
  font-size: 0.9rem;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 4px;
`;

export const SuccessText = styled.div`
  color: ${(props) => props.theme.common.tertiaryColor};
  font-size: 0.9rem;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 4px;
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
`;

export const StatItem = styled.div<{ success?: boolean; error?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  span:first-child {
    color: ${(props) => props.theme.common.subHeadingColor};
    font-size: 0.85rem;
  }

  span:last-child {
    color: ${(props) => {
      if (props.success) return props.theme.common.tertiaryColor;
      if (props.error) return props.theme.chatRoom.profileActionColor;
      return props.theme.common.mainHeadingColor;
    }};
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

export const VariableHint = styled.div`
  margin-top: -15px;
  margin-bottom: 20px;
  padding: 10px;
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 4px;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.85rem;
  line-height: 1.5;

  code {
    background: ${(props) => props.theme.common.secondaryColor};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
    color: ${(props) => props.theme.common.tertiaryColor};
    margin: 0 2px;
  }
`;

export const VariablesSection = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
`;

export const VariablesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  > div:first-child {
    flex: 1;
  }
`;

export const VariableCountInfo = styled.div`
  margin-top: 5px;
  font-size: 0.85rem;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-weight: 400;
`;

export const AddVariableButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .icon {
    width: 16px;
    height: 16px;
  }
`;

export const VariablesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const VariableItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 6px;
`;

export const VariableButton = styled.button`
  padding: 8px 12px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: monospace;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

export const VariableInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 6px;
  background: ${(props) => props.theme.unselectedChat.bg};
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const RemoveVariableButton = styled.button`
  padding: 8px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.chatRoom.profileActionColor};
  border-radius: 6px;
  color: ${(props) => props.theme.chatRoom.profileActionColor};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.chatRoom.profileActionColor};
    color: white;
  }

  .icon {
    width: 16px;
    height: 16px;
  }
`;

export const MessagePreviewSection = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
`;

export const MessagePreviewBox = styled.div`
  padding: 15px;
  background: ${(props) => props.theme.common.secondaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 8px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  line-height: 1.6;
  min-height: 60px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 1.2rem;
`;

