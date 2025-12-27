import { useState, useEffect } from "react";

export type ChatNote = {
  id: string;
  chatId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function useChatNotes(chatId: string) {
  const [notes, setNotes] = useState<ChatNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatId) {
      fetchNotes();
    }
  }, [chatId]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/chats/${chatId}/notes`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setNotes(data.notes);
      // }

      // Mock data for now
      setNotes([]);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (content: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/chats/${chatId}/notes`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ content }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setNotes((prev) => [data.note, ...prev]);
      //   return data.note;
      // }

      // Mock: Create new note
      const newNote: ChatNote = {
        id: `note-${Date.now()}`,
        chatId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error("Failed to add note:", error);
      throw error;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/chats/${chatId}/notes/${noteId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ content }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setNotes((prev) =>
      //     prev.map((note) => (note.id === noteId ? data.note : note))
      //   );
      //   return data.note;
      // }

      // Mock: Update note
      const updatedNote: ChatNote = {
        id: noteId,
        chatId,
        content,
        createdAt: notes.find((n) => n.id === noteId)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)));
      return updatedNote;
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/chats/${chatId}/notes/${noteId}`, {
      //   method: "DELETE",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setNotes((prev) => prev.filter((note) => note.id !== noteId));
      // }

      // Mock: Delete note
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes,
  };
}

