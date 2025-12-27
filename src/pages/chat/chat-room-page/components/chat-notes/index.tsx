import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "common/components/icons";
import useChatNotes from "../../hooks/useChatNotes";
import {
  NotesContainer,
  NotesHeader,
  NotesTitle,
  AddNoteButton,
  NotesList,
  NoteItem,
  NoteContent,
  NoteDate,
  NoteActions,
  EditButton,
  DeleteButton,
  NoteInput,
  NoteForm,
  SaveButton,
  CancelButton,
  EmptyState,
} from "./styles";

type ChatNotesProps = {
  chatId: string;
};

export default function ChatNotes({ chatId }: ChatNotesProps) {
  const { t } = useTranslation();
  const { notes, isLoading, addNote, updateNote, deleteNote } = useChatNotes(chatId);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const handleAddNote = () => {
    setIsAdding(true);
    setNoteText("");
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;

    try {
      if (editingId) {
        await updateNote(editingId, noteText);
        setEditingId(null);
      } else {
        await addNote(noteText);
        setIsAdding(false);
      }
      setNoteText("");
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNoteText("");
  };

  const handleEdit = (note: { id: string; content: string }) => {
    setEditingId(note.id);
    setNoteText(note.content);
    setIsAdding(false);
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm(t("chatNotes.confirmDelete"))) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  return (
    <NotesContainer>
      <NotesHeader>
        <NotesTitle>{t("chatNotes.title")}</NotesTitle>
        {!isAdding && !editingId && (
          <AddNoteButton onClick={handleAddNote}>
            <Icon id="attachDocument" className="icon" />
            {t("chatNotes.addNote")}
          </AddNoteButton>
        )}
      </NotesHeader>

      {(isAdding || editingId) && (
        <NoteForm>
          <NoteInput
            placeholder={t("chatNotes.placeholder")}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            autoFocus
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <SaveButton onClick={handleSaveNote} disabled={!noteText.trim()}>
              {t("chatNotes.save")}
            </SaveButton>
            <CancelButton onClick={handleCancel}>{t("chatNotes.cancel")}</CancelButton>
          </div>
        </NoteForm>
      )}

      {isLoading ? (
        <EmptyState>{t("chatNotes.loading")}</EmptyState>
      ) : notes.length === 0 && !isAdding ? (
        <EmptyState>{t("chatNotes.noNotes")}</EmptyState>
      ) : (
        <NotesList>
          {notes.map((note) => (
            <NoteItem key={note.id}>
              {editingId === note.id ? (
                <NoteForm>
                  <NoteInput
                    placeholder={t("chatNotes.placeholder")}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={4}
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <SaveButton onClick={handleSaveNote} disabled={!noteText.trim()}>
                      {t("chatNotes.save")}
                    </SaveButton>
                    <CancelButton onClick={handleCancel}>{t("chatNotes.cancel")}</CancelButton>
                  </div>
                </NoteForm>
              ) : (
                <>
                  <NoteContent>{note.content}</NoteContent>
                  <NoteDate>{new Date(note.createdAt).toLocaleString()}</NoteDate>
                  <NoteActions>
                    <EditButton onClick={() => handleEdit(note)} title={t("chatNotes.edit")}>
                      <Icon id="attachDocument" className="icon" />
                    </EditButton>
                    <DeleteButton onClick={() => handleDelete(note.id)} title={t("chatNotes.delete")}>
                      <Icon id="delete" className="icon" />
                    </DeleteButton>
                  </NoteActions>
                </>
              )}
            </NoteItem>
          ))}
        </NotesList>
      )}
    </NotesContainer>
  );
}

