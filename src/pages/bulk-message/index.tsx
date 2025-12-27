import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChatLayout from "../chat/layouts";
import Icon from "common/components/icons";
import {
  Container,
  Title,
  UploadArea,
  UploadInput,
  UploadLabel,
  FileInfo,
  MessageInput,
  PreviewSection,
  PreviewList,
  PreviewItem,
  Button,
  ButtonContainer,
  ErrorText,
  SuccessText,
  StatsContainer,
  StatItem,
  LoadingOverlay,
  VariablesSection,
  VariablesHeader,
  VariablesList,
  VariableItem,
  VariableButton,
  VariableInput,
  AddVariableButton,
  RemoveVariableButton,
  MessagePreviewSection,
  MessagePreviewBox,
  VariableCountInfo,
} from "./styles";

type Contact = {
  phone: string;
  name?: string;
  message?: string;
  variables?: Record<string, string>;
};

type Variable = {
  name: string;
  previewValue: string;
};

export default function BulkMessagePage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [message, setMessage] = useState("");
  const [variables, setVariables] = useState<Variable[]>([
    { name: "degisken_1", previewValue: "" },
    { name: "degisken_2", previewValue: "" },
    { name: "degisken_3", previewValue: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState({ sent: 0, failed: 0, total: 0 });
  const [fileVariableCount, setFileVariableCount] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setSuccess(null);

    try {
      // Parse Excel/CSV file
      const text = await selectedFile.text();
      const { contacts: parsedContacts, variableCount } = parseFile(text, selectedFile.name);
      setContacts(parsedContacts);
      setFileVariableCount(variableCount);
      
      // Check if variable count matches
      if (variables.length > 0 && variableCount !== variables.length) {
        setError(t("bulkMessage.variableCountMismatch", { 
          expected: variables.length, 
          found: variableCount 
        }));
      } else {
        setError(null);
      }
    } catch (err) {
      setError(t("bulkMessage.fileError"));
      console.error("File parsing error:", err);
    }
  };

  const parseFile = (content: string, fileName: string): { contacts: Contact[]; variableCount: number } => {
    const lines = content.split("\n").filter((line) => line.trim());
    const contacts: Contact[] = [];

    if (lines.length === 0) return { contacts, variableCount: 0 };

    // Parse header to detect variable columns
    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(",").map((h) => h.trim());
    const phoneIndex = headers.findIndex((h) => h === "phone");
    const nameIndex = headers.findIndex((h) => h === "name");
    
    // Find variable columns (degisken_1, degisken_2, etc.)
    const variableIndices: Record<string, number> = {};
    headers.forEach((header, index) => {
      if (header.startsWith("degisken_") || header.startsWith("variable_")) {
        variableIndices[header] = index;
      }
    });

    const variableCount = Object.keys(variableIndices).length;

    const startIndex = phoneIndex >= 0 ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(",").map((p) => p.trim());
      if (parts.length === 0 || !parts[phoneIndex >= 0 ? phoneIndex : 0]) continue;

      const contact: Contact = {
        phone: parts[phoneIndex >= 0 ? phoneIndex : 0],
        name: nameIndex >= 0 ? (parts[nameIndex] || "") : "",
        variables: {},
      };

      // Extract variables
      Object.keys(variableIndices).forEach((varName) => {
        const varIndex = variableIndices[varName];
        if (parts[varIndex]) {
          contact.variables![varName] = parts[varIndex];
        }
      });

      contacts.push(contact);
    }

    return { contacts, variableCount };
  };

  const replaceVariables = (messageText: string, variables: Record<string, string> = {}): string => {
    let result = messageText;
    // Replace {[[degisken_1]]} format
    Object.keys(variables).forEach((varName) => {
      const pattern = new RegExp(`\\{\\[\\[${varName}\\]\\]\\}`, "g");
      result = result.replace(pattern, variables[varName] || "");
    });
    return result;
  };

  const getPreviewMessage = (): string => {
    const previewVariables: Record<string, string> = {};
    variables.forEach((variable) => {
      previewVariables[variable.name] = variable.previewValue || `[${variable.name}]`;
    });
    return replaceVariables(message, previewVariables);
  };

  const handleAddVariable = () => {
    const nextIndex = variables.length + 1;
    const newVariables = [...variables, { name: `degisken_${nextIndex}`, previewValue: "" }];
    setVariables(newVariables);
    
    // Check if file is loaded and variable count matches
    if (file && fileVariableCount > 0 && fileVariableCount !== newVariables.length) {
      setError(t("bulkMessage.variableCountMismatch", { 
        expected: newVariables.length, 
        found: fileVariableCount 
      }));
    } else if (file && fileVariableCount === newVariables.length) {
      setError(null);
    }
  };

  const handleVariableChange = (index: number, field: "name" | "previewValue", value: string) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const handleRemoveVariable = (index: number) => {
    const newVariables = variables.filter((_, i) => i !== index);
    setVariables(newVariables);
    
    // Check if file is loaded and variable count matches
    if (file && fileVariableCount > 0 && fileVariableCount !== newVariables.length) {
      setError(t("bulkMessage.variableCountMismatch", { 
        expected: newVariables.length, 
        found: fileVariableCount 
      }));
    } else if (file && fileVariableCount === newVariables.length) {
      setError(null);
    }
  };

  const handleInsertVariable = (varName: string) => {
    const variableText = `{[[${varName}]]}`;
    const textarea = document.getElementById("message-input") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + variableText + message.substring(end);
      setMessage(newMessage);
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableText.length, start + variableText.length);
      }, 0);
    } else {
      setMessage(message + variableText);
    }
  };

  const handleSend = async () => {
    if (!file || contacts.length === 0) {
      setError(t("bulkMessage.noContacts"));
      return;
    }

    if (!message.trim()) {
      setError(t("bulkMessage.noMessage"));
      return;
    }

    // Check if variable count matches
    if (variables.length > 0 && fileVariableCount !== variables.length) {
      setError(t("bulkMessage.variableCountMismatch", { 
        expected: variables.length, 
        found: fileVariableCount 
      }));
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setProgress({ sent: 0, failed: 0, total: contacts.length });

    try {
      // Prepare contacts with replaced variables
      const contactsWithMessages = contacts.map((contact) => ({
        ...contact,
        finalMessage: replaceVariables(message, contact.variables || {}),
      }));

      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append("file", file);
      // formData.append("message", message);
      // 
      // const response = await fetch("/api/bulk-message/send", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: formData,
      // });
      // 
      // const data = await response.json();
      // if (data.success) {
      //   setSuccess(t("bulkMessage.success", { count: data.sent }));
      //   setProgress({ sent: data.sent, failed: data.failed, total: data.total });
      // }

      // Mock success for now
      setTimeout(() => {
        setSuccess(t("bulkMessage.success", { count: contacts.length }));
        setProgress({ sent: contacts.length, failed: 0, total: contacts.length });
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError(t("bulkMessage.sendError"));
      setIsLoading(false);
      console.error("Send error:", err);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/bulk_message_template.csv");
      const text = await response.text();
      const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "bulk_message_template.csv";
      link.click();
    } catch (error) {
      // Fallback: create template manually with variables (no message column needed)
      const csvContent = "phone,name,degisken_1,degisken_2,degisken_3\n905551234567,John Doe,John,2024-01-15,Ankara\n905559876543,Jane Smith,Jane,2024-01-16,İstanbul\n905551111111,Mike Johnson,Mike,2024-01-17,İzmir";
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "bulk_message_template.csv";
      link.click();
    }
  };

  return (
    <ChatLayout>
      <Container>
        <Title>{t("bulkMessage.title")}</Title>
        <UploadArea>
          <UploadInput
            type="file"
            id="file-upload"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <UploadLabel htmlFor="file-upload">
            <Icon id="attachDocument" className="icon" />
            {file ? file.name : t("bulkMessage.uploadFile")}
          </UploadLabel>
          {file && (
            <FileInfo>
              {contacts.length} {t("bulkMessage.contactsFound")}
            </FileInfo>
          )}
        </UploadArea>

        <MessageInput
          id="message-input"
          placeholder={t("bulkMessage.messagePlaceholder")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
          rows={4}
        />

        <VariablesSection>
          <VariablesHeader>
            <Title style={{ margin: 0, fontSize: "1.2rem" }}>{t("bulkMessage.variables")}</Title>
            <AddVariableButton onClick={handleAddVariable}>
              <Icon id="attach" className="icon" />
              {t("bulkMessage.addVariable")}
            </AddVariableButton>
          </VariablesHeader>
          <VariablesList>
            {variables.map((variable, index) => (
              <VariableItem key={index}>
                <VariableButton onClick={() => handleInsertVariable(variable.name)}>
                  {`{[[${variable.name}]]}`}
                </VariableButton>
                <VariableInput
                  type="text"
                  placeholder={t("bulkMessage.variableName")}
                  value={variable.name}
                  onChange={(e) => handleVariableChange(index, "name", e.target.value)}
                  disabled={isLoading}
                />
                <VariableInput
                  type="text"
                  placeholder={t("bulkMessage.previewValue")}
                  value={variable.previewValue}
                  onChange={(e) => handleVariableChange(index, "previewValue", e.target.value)}
                  disabled={isLoading}
                />
                {variables.length > 1 && (
                  <RemoveVariableButton onClick={() => handleRemoveVariable(index)}>
                    <Icon id="delete" className="icon" />
                  </RemoveVariableButton>
                )}
              </VariableItem>
            ))}
          </VariablesList>
        </VariablesSection>

        {message && (
          <MessagePreviewSection>
            <Title style={{ margin: 0, fontSize: "1.2rem", marginBottom: "15px" }}>
              {t("bulkMessage.messagePreview")}
            </Title>
            <MessagePreviewBox>{getPreviewMessage() || t("bulkMessage.noPreview")}</MessagePreviewBox>
          </MessagePreviewSection>
        )}

        {contacts.length > 0 && (
          <PreviewSection>
            <Title>{t("bulkMessage.contactsPreview")}</Title>
            <PreviewList>
              {contacts.slice(0, 10).map((contact, index) => {
                const previewMessage = replaceVariables(message, contact.variables || {});
                return (
                  <PreviewItem key={index}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                      <span style={{ fontWeight: 500 }}>{contact.name || contact.phone}</span>
                      <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>{contact.phone}</span>
                      {previewMessage && (
                        <span style={{ fontSize: "0.8rem", marginTop: "5px", fontStyle: "italic" }}>
                          {previewMessage.length > 50 ? previewMessage.substring(0, 50) + "..." : previewMessage}
                        </span>
                      )}
                    </div>
                  </PreviewItem>
                );
              })}
              {contacts.length > 10 && (
                <PreviewItem>
                  <span>...</span>
                  <span>{t("bulkMessage.andMore", { count: contacts.length - 10 })}</span>
                </PreviewItem>
              )}
            </PreviewList>
          </PreviewSection>
        )}

        {error && <ErrorText>{error}</ErrorText>}
        {success && <SuccessText>{success}</SuccessText>}

        {progress.total > 0 && (
          <StatsContainer>
            <StatItem>
              <span>{t("bulkMessage.total")}</span>
              <span>{progress.total}</span>
            </StatItem>
            <StatItem success>
              <span>{t("bulkMessage.sent")}</span>
              <span>{progress.sent}</span>
            </StatItem>
            <StatItem error>
              <span>{t("bulkMessage.failed")}</span>
              <span>{progress.failed}</span>
            </StatItem>
          </StatsContainer>
        )}

        <ButtonContainer>
          <Button secondary onClick={handleDownloadTemplate}>
            <Icon id="attachDocument" className="icon" />
            {t("bulkMessage.downloadTemplate")}
          </Button>
          <Button onClick={handleSend} disabled={!file || contacts.length === 0 || !message.trim() || isLoading}>
            {isLoading ? (
              <>
                <Icon id="send" className="icon" />
                {t("bulkMessage.sending")}
              </>
            ) : (
              <>
                <Icon id="send" className="icon" />
                {t("bulkMessage.send")}
              </>
            )}
          </Button>
        </ButtonContainer>

        {isLoading && (
          <LoadingOverlay>
            <div>{t("bulkMessage.sending")}...</div>
          </LoadingOverlay>
        )}
      </Container>
    </ChatLayout>
  );
}

