import styled from "styled-components";

export const NotesContainer = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.common.secondaryColor};
`;

export const NotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const NotesTitle = styled.h2`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1.2rem;
  font-weight: 400;
  margin: 0;
`;

export const AddNoteButton = styled.button`
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

export const NotesList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const NoteItem = styled.div`
  padding: 15px;
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  position: relative;
`;

export const NoteContent = styled.div`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 10px;
`;

export const NoteDate = styled.div`
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.75rem;
  margin-bottom: 10px;
`;

export const NoteActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 10px;
`;

export const EditButton = styled.button`
  padding: 6px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 6px;
  color: ${(props) => props.theme.common.subHeadingColor};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
    border-color: ${(props) => props.theme.common.tertiaryColor};
    color: ${(props) => props.theme.common.tertiaryColor};
  }

  .icon {
    width: 16px;
    height: 16px;
  }
`;

export const DeleteButton = styled.button`
  padding: 6px;
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

export const NoteForm = styled.div`
  margin-bottom: 15px;
`;

export const NoteInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 6px;
  background: ${(props) => props.theme.unselectedChat.bg};
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }

  &::placeholder {
    color: ${(props) => props.theme.common.subHeadingColor};
  }
`;

export const SaveButton = styled.button`
  padding: 8px 16px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: ${(props) => props.theme.common.subHeadingColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.9rem;
  padding: 40px 20px;
`;

