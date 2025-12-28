# Backend API Documentation

## Message Types API

### 1. Get Available Message Types

**Endpoint:** `GET /api/chats/:chatId/message-types`

**Description:** Returns all available message types for filtering and the currently selected types for the chat.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "types": [
    {
      "id": "text",
      "label": "Text",
      "labelKey": "messageTypes.text"
    },
    {
      "id": "image",
      "label": "Image",
      "labelKey": "messageTypes.image"
    },
    {
      "id": "video",
      "label": "Video",
      "labelKey": "messageTypes.video"
    },
    {
      "id": "audio",
      "label": "Audio",
      "labelKey": "messageTypes.audio"
    },
    {
      "id": "document",
      "label": "Document",
      "labelKey": "messageTypes.document"
    },
    {
      "id": "location",
      "label": "Location",
      "labelKey": "messageTypes.location"
    },
    {
      "id": "contact",
      "label": "Contact",
      "labelKey": "messageTypes.contact"
    },
    {
      "id": "sticker",
      "label": "Sticker",
      "labelKey": "messageTypes.sticker"
    }
  ],
  "defaultSelected": ["text"]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Chat not found"
}
```

---

### 2. Update Selected Message Types

**Endpoint:** `PUT /api/chats/:chatId/message-types`

**Description:** Updates the selected message types for filtering. When types are updated, the frontend will automatically fetch new messages based on the selected types.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "types": ["text", "image", "video"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message types updated successfully",
  "selectedTypes": ["text", "image", "video"]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid message types"
}
```

---

### 3. Get Filtered Messages

**Endpoint:** `GET /api/chats/:chatId/messages`

**Description:** Returns messages filtered by the selected message types. This endpoint is called automatically when message types are updated.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `types` (required): Comma-separated list of message type IDs
  - Example: `?types=text,image,video`

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "1",
      "body": "Can you send me that file?",
      "date": "19/02/2023",
      "timestamp": "08:58",
      "messageStatus": "READ",
      "isOpponent": true,
      "type": "text",
      "isStarred": false
    },
    {
      "id": "2",
      "body": "https://example.com/image.jpg",
      "date": "20/02/2023",
      "timestamp": "09:01",
      "messageStatus": "READ",
      "isOpponent": false,
      "type": "image",
      "mediaUrl": "https://example.com/image.jpg",
      "thumbnailUrl": "https://example.com/thumb.jpg",
      "isStarred": true
    }
  ],
  "total": 2,
  "hasMore": false
}
```

**Note:** The `isStarred` field indicates whether the current authenticated user has starred this message. This is user-specific and will be different for each user viewing the same message.

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid chat ID or types"
}
```

---

## Implementation Notes

### Frontend Behavior

1. **Initial Load:**
   - On chat page load, frontend calls `GET /api/chats/:chatId/message-types`
   - Sets default selected types (usually `["text"]`)
   - Calls `GET /api/chats/:chatId/messages?types=text` to load initial messages

2. **Type Selection:**
   - User selects/deselects message types in the multi-select dropdown
   - Frontend immediately calls `PUT /api/chats/:chatId/message-types` with new selection
   - After successful update, frontend calls `GET /api/chats/:chatId/messages?types=text,image` with new types
   - Messages list is updated with filtered results

3. **Multi-Select:**
   - Multiple types can be selected simultaneously
   - Empty selection is not allowed (at least one type must be selected)
   - Selection state is persisted per chat

### Backend Requirements

1. **Message Types:**
   - Store available message types in database
   - Support i18n labels via `labelKey`
   - Return types in consistent order

2. **Selected Types:**
   - Store selected types per chat per user
   - Default to `["text"]` if no selection exists
   - Validate types against available types list

3. **Message Filtering:**
   - Filter messages by `type` field
   - Support multiple types (OR logic)
   - Return messages in chronological order
   - Support pagination if needed

### Example Implementation (Node.js/Express)

```javascript
// GET /api/chats/:chatId/message-types
router.get('/chats/:chatId/message-types', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    
    // Get available types
    const availableTypes = await MessageType.findAll();
    
    // Get user's selected types for this chat
    const userSettings = await ChatUserSettings.findOne({
      where: { chatId, userId }
    });
    
    const defaultSelected = userSettings?.selectedMessageTypes || ['text'];
    
    res.json({
      success: true,
      types: availableTypes,
      defaultSelected
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/chats/:chatId/message-types
router.put('/chats/:chatId/message-types', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { types } = req.body;
    const userId = req.user.id;
    
    // Validate types
    const availableTypes = await MessageType.findAll();
    const validTypes = availableTypes.map(t => t.id);
    const isValid = types.every(t => validTypes.includes(t));
    
    if (!isValid || types.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message types'
      });
    }
    
    // Update user settings
    await ChatUserSettings.upsert({
      chatId,
      userId,
      selectedMessageTypes: types
    });
    
    res.json({
      success: true,
      message: 'Message types updated successfully',
      selectedTypes: types
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/chats/:chatId/messages
router.get('/chats/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { types } = req.query;
    const userId = req.user.id;
    
    // Validate user has access to chat
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: ChatMember, where: { userId } }]
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found'
      });
    }
    
    // Parse types
    const typeArray = types ? types.split(',') : ['text'];
    
    // Fetch messages
    const messages = await Message.findAll({
      where: {
        chatId,
        type: { [Op.in]: typeArray }
      },
      order: [['createdAt', 'ASC']]
    });
    
    // Get user's starred messages for this chat
    const starredMessageIds = await UserStarredMessage.findAll({
      where: {
        userId: userId,
        chatId: chatId
      },
      attributes: ['messageId']
    }).then(records => records.map(r => r.messageId));
    
    // Add isStarred property to each message based on user's starred messages
    const messagesWithStarred = messages.map(msg => ({
      ...msg.toJSON(),
      isStarred: starredMessageIds.includes(msg.id)
    }));
    
    res.json({
      success: true,
      messages: messagesWithStarred,
      total: messagesWithStarred.length,
      hasMore: false
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Database Schema Suggestions

```sql
-- Message Types Table
CREATE TABLE message_types (
  id VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  label_key VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat User Settings Table
CREATE TABLE chat_user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  user_id UUID NOT NULL,
  selected_message_types JSONB DEFAULT '["text"]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chat_id, user_id),
  FOREIGN KEY (chat_id) REFERENCES chats(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Messages Table (add type field if not exists)
ALTER TABLE messages ADD COLUMN type VARCHAR(50) DEFAULT 'text';
```

---

## Testing

### Test Cases

1. **Get Message Types:**
   - Should return all available types
   - Should return default selected types for chat

2. **Update Message Types:**
   - Should accept valid type array
   - Should reject empty array
   - Should reject invalid types
   - Should persist selection per chat

3. **Get Filtered Messages:**
   - Should return messages matching selected types
   - Should return empty array if no matches
   - Should handle multiple types correctly

### Example cURL Commands

```bash
# Get message types
curl -X GET "http://localhost:3000/api/chats/123/message-types" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update selected types
curl -X PUT "http://localhost:3000/api/chats/123/message-types" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"types": ["text", "image", "video"]}'

# Get filtered messages
curl -X GET "http://localhost:3000/api/chats/123/messages?types=text,image" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notifications API

### 1. Get Notifications

**Endpoint:** `GET /api/notifications`

**Description:** Returns all unread and recent notifications for the authenticated user. Notifications are sorted by creation date (newest first).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `limit` (optional): Maximum number of notifications to return (default: 50)
- `unreadOnly` (optional): If `true`, returns only unread notifications (default: `false`)

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif1",
      "type": "info",
      "title": "Bilgi",
      "message": "Yeni özellikler eklendi. Daha fazla bilgi için tıklayın.",
      "createdAt": "2024-01-15T10:30:00Z",
      "isRead": false
    },
    {
      "id": "notif2",
      "type": "success",
      "title": "Başarılı",
      "message": "Mesajlarınız başarıyla gönderildi.",
      "createdAt": "2024-01-15T09:25:00Z",
      "isRead": false
    },
    {
      "id": "notif3",
      "type": "error",
      "title": "Hata",
      "message": "Bağlantı hatası oluştu. Lütfen tekrar deneyin.",
      "createdAt": "2024-01-15T08:15:00Z",
      "isRead": true
    }
  ],
  "unreadCount": 2,
  "total": 3
}
```

**Notification Types:**
- `info`: Information notification (yellow/blue background)
- `success`: Success notification (green background)
- `error`: Error notification (red background)

**Error Response:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### 2. Mark Notification as Read

**Endpoint:** `PUT /api/notifications/:notificationId/read`

**Description:** Marks a specific notification as read.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": {
    "id": "notif1",
    "type": "info",
    "title": "Bilgi",
    "message": "Yeni özellikler eklendi. Daha fazla bilgi için tıklayın.",
    "createdAt": "2024-01-15T10:30:00Z",
    "isRead": true
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

### 3. Mark All Notifications as Read

**Endpoint:** `PUT /api/notifications/read-all`

**Description:** Marks all unread notifications as read for the authenticated user.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 5
}
```

---

### 4. Delete Notification

**Endpoint:** `DELETE /api/notifications/:notificationId`

**Description:** Deletes a specific notification.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

## Notifications Implementation Notes

### Frontend Behavior

1. **Initial Load:**
   - On sidebar load, frontend calls `GET /api/notifications`
   - Displays the latest (newest) notification by default
   - Shows unread count badge if there are multiple unread notifications

2. **Display Logic:**
   - Only the latest notification is shown initially
   - Badge shows total unread count (if > 1)
   - User can expand to see all notifications
   - Notifications are sorted by `createdAt` (newest first)

3. **Mark as Read:**
   - When user closes a notification, frontend calls `PUT /api/notifications/:id/read`
   - Notification is removed from unread count
   - If it was the latest, the next notification is shown

4. **Color Coding:**
   - `info`: Yellow/blue background (information)
   - `success`: Green background (successful operations)
   - `error`: Red background (errors/warnings)

### Backend Requirements

1. **Notification Storage:**
   - Store notifications per user
   - Track read/unread status
   - Support multiple notification types
   - Sort by creation date (newest first)

2. **Notification Types:**
   - Validate notification type (`info`, `success`, `error`)
   - Support i18n for title and message
   - Store creation timestamp

3. **User Association:**
   - Each notification must be associated with a user
   - Filter notifications by authenticated user
   - Support pagination if needed

### Example Implementation (Node.js/Express)

```javascript
// GET /api/notifications
router.get('/notifications', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, unreadOnly = false } = req.query;
    
    const where = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }
    
    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    
    const unreadCount = await Notification.count({
      where: { userId, isRead: false }
    });
    
    res.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/notifications/:notificationId/read
router.put('/notifications/:notificationId/read', authenticate, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/notifications/read-all
router.put('/notifications/read-all', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [count] = await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read',
      count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/notifications/:notificationId
router.delete('/notifications/:notificationId', authenticate, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    await notification.destroy();
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Database Schema for Notifications

```sql
-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'success', 'error')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_is_read (is_read)
);
```

---

## Testing Notifications

### Test Cases

1. **Get Notifications:**
   - Should return all notifications for authenticated user
   - Should respect `unreadOnly` parameter
   - Should respect `limit` parameter
   - Should sort by creation date (newest first)

2. **Mark as Read:**
   - Should mark specific notification as read
   - Should only allow user to mark their own notifications
   - Should return 404 for non-existent notifications

3. **Mark All as Read:**
   - Should mark all unread notifications as read
   - Should return count of updated notifications

4. **Delete Notification:**
   - Should delete specific notification
   - Should only allow user to delete their own notifications
   - Should return 404 for non-existent notifications

### Example cURL Commands

```bash
# Get all notifications
curl -X GET "http://localhost:3000/api/notifications" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get only unread notifications
curl -X GET "http://localhost:3000/api/notifications?unreadOnly=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark notification as read
curl -X PUT "http://localhost:3000/api/notifications/notif1/read" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark all as read
curl -X PUT "http://localhost:3000/api/notifications/read-all" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Delete notification
curl -X DELETE "http://localhost:3000/api/notifications/notif1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Bulk Message API

### 1. Send Bulk Messages

**Endpoint:** `POST /api/bulk-message/send`

**Description:** Sends messages to multiple contacts from an uploaded Excel/CSV file. The file should contain phone numbers and optionally names and custom messages.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file` (required): Excel (.xlsx, .xls) or CSV file containing contacts
- `message` (required): Default message text to send to all contacts
- `lineId` (optional): Line ID to use for sending (if multiple lines available)

**File Format:**
The Excel/CSV file should have the following columns:
- `phone` (required): Phone number in international format (e.g., 905551234567)
- `name` (optional): Contact name
- `degisken_1`, `degisken_2`, `degisken_3`, etc. (optional): Variable columns for dynamic content

**Note:** The `message` column is no longer required. The message is entered in the frontend, and variables from CSV columns are automatically replaced.

**Variable Format:**
Variables in messages use the format: `{[[degisken_1]]}`, `{[[degisken_2]]}`, etc.
- Variables are replaced with values from corresponding CSV columns
- If a variable is not found in CSV, it will be replaced with empty string
- Variable names must start with `degisken_` or `variable_` in CSV headers

**Example CSV:**
```csv
phone,name,degisken_1,degisken_2,degisken_3
905551234567,John Doe,John,2024-01-15,Ankara
905559876543,Jane Smith,Jane,2024-01-16,İstanbul
905551111111,Mike Johnson,Mike,2024-01-17,İzmir
```

**Message Example:**
```
Default message (entered in frontend): "Merhaba {[[degisken_1]]} bugün {[[degisken_2]]} de {[[degisken_3]]}"
```

**Result for first contact (John Doe):**
```
"Merhaba John bugün 2024-01-15 de Ankara"
```

**Frontend Variable Management:**
- Users can add/remove variables dynamically
- Each variable has a name (e.g., `degisken_1`) and a preview value
- Clicking a variable button inserts `{[[degisken_1]]}` into the message
- Message preview shows the message with preview values replaced
- CSV columns must match variable names (degisken_1, degisken_2, etc.)

**Response:**
```json
{
  "success": true,
  "message": "Bulk messages sent successfully",
  "total": 100,
  "sent": 95,
  "failed": 5,
  "failedContacts": [
    {
      "phone": "905551111111",
      "name": "Mike Johnson",
      "error": "Invalid phone number"
    }
  ],
  "jobId": "bulk-msg-12345"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid file format",
  "details": "File must be CSV or Excel format"
}
```

---

### 2. Get Bulk Message Status

**Endpoint:** `GET /api/bulk-message/:jobId/status`

**Description:** Returns the current status of a bulk message job.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "jobId": "bulk-msg-12345",
  "status": "completed",
  "total": 100,
  "sent": 95,
  "failed": 5,
  "progress": 100,
  "startedAt": "2024-01-15T10:30:00Z",
  "completedAt": "2024-01-15T10:35:00Z"
}
```

**Status Values:**
- `pending`: Job is queued
- `processing`: Messages are being sent
- `completed`: All messages processed
- `failed`: Job failed

---

### 3. Cancel Bulk Message Job

**Endpoint:** `DELETE /api/bulk-message/:jobId`

**Description:** Cancels a pending or processing bulk message job.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk message job cancelled",
  "cancelledAt": "2024-01-15T10:32:00Z"
}
```

---

## Bulk Message Implementation Notes

### Frontend Behavior

1. **File Upload:**
   - User uploads Excel/CSV file
   - Frontend parses file and shows preview
   - Validates phone numbers format
   - Shows contact count

2. **Message Input:**
   - User enters default message
   - Message can be customized per contact in Excel file
   - Character limit validation (if applicable)

3. **Sending:**
   - Frontend sends file and message to API
   - Shows progress indicator
   - Displays real-time statistics (sent/failed)
   - Handles errors gracefully

4. **File Format:**
   - Supports CSV and Excel (.xlsx, .xls)
   - First row can be headers (phone, name, message, degisken_1, degisken_2, etc.)
   - Phone numbers must be in international format
   - Empty rows are skipped
   - Variable columns: `degisken_1`, `degisken_2`, `degisken_3`, etc. (or `variable_1`, `variable_2`, etc.)
   - Variables in messages: `{[[degisken_1]]}`, `{[[degisken_2]]}`, etc.

### Backend Requirements

1. **File Processing:**
   - Parse Excel/CSV files
   - Validate phone number format
   - Extract contacts with phone numbers
   - Support custom messages per contact
   - Detect variable columns (degisken_1, degisken_2, etc.)
   - Replace variables in messages: `{[[degisken_1]]}` → value from CSV column

2. **Message Sending:**
   - Queue messages for sending
   - Handle rate limiting (WhatsApp API limits)
   - Retry failed messages
   - Track sending status

3. **Job Management:**
   - Create job for bulk message operation
   - Track progress (sent/failed/total)
   - Store job status in database
   - Support job cancellation

4. **Error Handling:**
   - Validate file format
   - Validate phone numbers
   - Handle API rate limits
   - Log errors for debugging

### Example Implementation (Node.js/Express)

```javascript
const multer = require('multer');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

// POST /api/bulk-message/send
router.post('/bulk-message/send', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { message, lineId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'File is required'
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Parse file
    const contacts = await parseContactsFile(file.path, file.mimetype);
    
    if (contacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid contacts found in file'
      });
    }

    // Validate phone numbers
    const validContacts = contacts.filter(contact => isValidPhoneNumber(contact.phone));
    const invalidContacts = contacts.filter(contact => !isValidPhoneNumber(contact.phone));

    // Create job
    const jobId = `bulk-msg-${Date.now()}`;
    await BulkMessageJob.create({
      id: jobId,
      userId: req.user.id,
      lineId: lineId || null,
      total: validContacts.length,
      status: 'processing',
      message: message
    });

    // Process messages asynchronously
    processBulkMessages(jobId, validContacts, message, lineId);

    res.json({
      success: true,
      message: 'Bulk messages queued',
      total: validContacts.length,
      invalid: invalidContacts.length,
      jobId: jobId
    });

    // Clean up uploaded file
    fs.unlinkSync(file.path);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function replaceVariables(message, variables) {
  let result = message;
  // Replace {[[degisken_1]]} format
  Object.keys(variables).forEach(varName => {
    const pattern = new RegExp(`\\{\\[\\[${varName}\\]\\]\\}`, 'g');
    result = result.replace(pattern, variables[varName] || '');
  });
  return result;
}

async function parseContactsFile(filePath, mimeType) {
  const contacts = [];

  if (mimeType === 'text/csv' || filePath.endsWith('.csv')) {
    // Parse CSV
    return new Promise((resolve, reject) => {
      const results = [];
      let headers = [];
      let isFirstRow = true;
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          if (isFirstRow) {
            headers = Object.keys(data);
            isFirstRow = false;
          }
          
          if (data.phone) {
            // Extract variables (degisken_1, degisken_2, etc.)
            const variables = {};
            headers.forEach(header => {
              if (header.startsWith('degisken_') || header.startsWith('variable_')) {
                variables[header] = data[header]?.trim() || '';
              }
            });
            
            const contact = {
              phone: data.phone.trim(),
              name: data.name?.trim() || '',
              message: data.message?.trim() || '',
              variables: variables
            };
            
            // Replace variables in message if present
            if (contact.message) {
              contact.message = replaceVariables(contact.message, variables);
            }
            
            results.push(contact);
          }
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  } else {
    // Parse Excel
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    const headers = Object.keys(data[0] || {});

    return data.map(row => {
      const variables = {};
      headers.forEach(header => {
        if (header.toLowerCase().startsWith('degisken_') || header.toLowerCase().startsWith('variable_')) {
          variables[header] = String(row[header] || '').trim();
        }
      });
      
      const message = String(row.message || row.Message || '').trim();
      const finalMessage = message ? replaceVariables(message, variables) : '';
      
      return {
        phone: String(row.phone || row.Phone || '').trim(),
        name: String(row.name || row.Name || '').trim(),
        message: finalMessage,
        variables: variables
      };
    }).filter(contact => contact.phone);
  }
}

function isValidPhoneNumber(phone) {
  // International format: starts with country code, 10-15 digits
  const phoneRegex = /^[1-9]\d{9,14}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

async function processBulkMessages(jobId, contacts, defaultMessage, lineId) {
  let sent = 0;
  let failed = 0;
  const failedContacts = [];

  for (const contact of contacts) {
    try {
      // Use custom message if available, otherwise use default message
      let messageText = contact.message || defaultMessage;
      
      // Replace variables in default message if contact has variables
      if (!contact.message && contact.variables && Object.keys(contact.variables).length > 0) {
        messageText = replaceVariables(defaultMessage, contact.variables);
      }
      
      // Send message via WhatsApp API
      await sendWhatsAppMessage(contact.phone, messageText, lineId);
      
      sent++;
      
      // Update job progress
      await BulkMessageJob.update(
        { sent, failed, progress: Math.round((sent + failed) / contacts.length * 100) },
        { where: { id: jobId } }
      );

      // Rate limiting: wait between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      failed++;
      failedContacts.push({
        phone: contact.phone,
        name: contact.name,
        error: error.message
      });

      await BulkMessageJob.update(
        { sent, failed, progress: Math.round((sent + failed) / contacts.length * 100) },
        { where: { id: jobId } }
      );
    }
  }

  // Mark job as completed
  await BulkMessageJob.update(
    {
      status: 'completed',
      sent,
      failed,
      progress: 100,
      completedAt: new Date(),
      failedContacts: JSON.stringify(failedContacts)
    },
    { where: { id: jobId } }
  );
}

// GET /api/bulk-message/:jobId/status
router.get('/bulk-message/:jobId/status', authenticate, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await BulkMessageJob.findOne({
      where: { id: jobId, userId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      jobId: job.id,
      status: job.status,
      total: job.total,
      sent: job.sent,
      failed: job.failed,
      progress: job.progress,
      startedAt: job.createdAt,
      completedAt: job.completedAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

## Database Schema for Bulk Messages

```sql
-- Bulk Message Jobs Table
CREATE TABLE bulk_message_jobs (
  id VARCHAR(100) PRIMARY KEY,
  user_id UUID NOT NULL,
  line_id UUID,
  message TEXT NOT NULL,
  total INTEGER NOT NULL,
  sent INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  failed_contacts JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Bulk Message Logs Table (optional, for detailed tracking)
CREATE TABLE bulk_message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES bulk_message_jobs(id) ON DELETE CASCADE,
  INDEX idx_job_id (job_id),
  INDEX idx_phone (phone)
);
```

---

## Testing Bulk Messages

### Test Cases

1. **File Upload:**
   - Should accept CSV files
   - Should accept Excel files (.xlsx, .xls)
   - Should reject invalid file formats
   - Should validate phone numbers

2. **Message Sending:**
   - Should send messages to all valid contacts
   - Should handle invalid phone numbers
   - Should support custom messages per contact
   - Should track sending progress

3. **Job Management:**
   - Should create job for bulk operation
   - Should track job status
   - Should allow job cancellation
   - Should return job statistics

### Example cURL Commands

```bash
# Send bulk messages
curl -X POST "http://localhost:3000/api/bulk-message/send" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@contacts.csv" \
  -F "message=Hello, this is a bulk message" \
  -F "lineId=line-123"

# Get job status
curl -X GET "http://localhost:3000/api/bulk-message/bulk-msg-12345/status" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Cancel job
curl -X DELETE "http://localhost:3000/api/bulk-message/bulk-msg-12345" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Example Excel/CSV Template

**CSV Format (bulk_message_template.csv):**
```csv
phone,name,degisken_1,degisken_2,degisken_3
905551234567,John Doe,John,2024-01-15,Ankara
905559876543,Jane Smith,Jane,2024-01-16,İstanbul
905551111111,Mike Johnson,Mike,2024-01-17,İzmir
```

**Notes:**
- Message column is not needed in CSV
- Message is entered in the frontend interface
- Variables are replaced from CSV columns automatically
- Variable names in CSV must match variable names used in message (degisken_1, degisken_2, etc.)

---

## New Message API

### 1. Create New Chat

**Endpoint:** `POST /api/chats/create`

**Description:** Creates a new chat/conversation with a phone number. If a chat already exists with this phone number, returns the existing chat.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "905551234567",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat created successfully",
  "chat": {
    "id": "chat-12345",
    "name": "John Doe",
    "phone": "905551234567",
    "image": "/assets/images/placeholder.jpeg",
    "lastMessage": "",
    "timestamp": "14:30",
    "messageStatus": "SENT",
    "isOnline": false,
    "lineId": "line1",
    "createdAt": "2024-01-15T14:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid phone number format"
}
```

---

## New Message Implementation Notes

### Frontend Behavior

1. **New Message Button:**
   - Located at the bottom of the sidebar contact list
   - Opens a modal dialog when clicked
   - Modal contains phone number and optional name inputs

2. **Phone Validation:**
   - Validates international phone format (10-15 digits)
   - Removes non-digit characters before validation
   - Shows error message if invalid

3. **Chat Creation:**
   - Sends phone and name to API
   - If chat exists, navigates to existing chat
   - If new chat, creates and navigates to new chat
   - Uses selected line for new chat

### Backend Requirements

1. **Phone Validation:**
   - Validate phone number format
   - Check if chat already exists for this phone number
   - Return existing chat if found

2. **Chat Creation:**
   - Create new chat record in database
   - Associate with authenticated user
   - Use selected line ID (from user's selected lines)
   - Set default values (image, status, etc.)

3. **Response:**
   - Return chat object with all required fields
   - Include chat ID for navigation
   - Set appropriate timestamps

### Example Implementation (Node.js/Express)

```javascript
// POST /api/chats/create
router.post('/chats/create', authenticate, async (req, res) => {
  try {
    const { phone, name } = req.body;
    const userId = req.user.id;

    // Validate phone number
    const phoneRegex = /^[1-9]\d{9,14}$/;
    const cleanedPhone = phone.replace(/\D/g, '');
    
    if (!phoneRegex.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      where: {
        userId,
        phone: cleanedPhone
      }
    });

    if (chat) {
      return res.json({
        success: true,
        message: 'Chat already exists',
        chat: formatChatResponse(chat)
      });
    }

    // Get user's selected line (default to first selected line)
    const userSettings = await UserSettings.findOne({
      where: { userId }
    });
    const lineId = userSettings?.selectedLines?.[0] || 'line1';

    // Create new chat
    chat = await Chat.create({
      userId,
      phone: cleanedPhone,
      name: name || cleanedPhone,
      image: '/assets/images/placeholder.jpeg',
      lastMessage: '',
      messageStatus: 'SENT',
      isOnline: false,
      lineId: lineId
    });

    res.json({
      success: true,
      message: 'Chat created successfully',
      chat: formatChatResponse(chat)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function formatChatResponse(chat) {
  return {
    id: chat.id,
    name: chat.name,
    phone: chat.phone,
    image: chat.image,
    lastMessage: chat.lastMessage || '',
    timestamp: new Date(chat.updatedAt).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    messageStatus: chat.messageStatus,
    isOnline: chat.isOnline,
    lineId: chat.lineId,
    createdAt: chat.createdAt
  };
}
```

---

## Database Schema for New Chat

```sql
-- Chats Table (if not exists)
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  last_message TEXT,
  message_status VARCHAR(20) DEFAULT 'SENT',
  is_online BOOLEAN DEFAULT FALSE,
  line_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, phone),
  INDEX idx_user_id (user_id),
  INDEX idx_phone (phone),
  INDEX idx_line_id (line_id)
);
```

---

## Testing New Message

### Test Cases

1. **Create New Chat:**
   - Should create chat with valid phone number
   - Should return existing chat if phone already exists
   - Should validate phone number format
   - Should use selected line ID

2. **Phone Validation:**
   - Should accept valid international phone numbers
   - Should reject invalid formats
   - Should clean phone number (remove non-digits)

### Example cURL Commands

```bash
# Create new chat
curl -X POST "http://localhost:3000/api/chats/create" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "905551234567",
    "name": "John Doe"
  }'
```

**Excel Format:**
- Column A: phone (required)
- Column B: name (optional)
- Column C: message (optional, overrides default message)

**Notes:**
- Phone numbers must be in international format (without + sign)
- First row can be headers (phone, name, message)
- Empty rows are automatically skipped
- Custom messages in Excel override the default message
- If custom message is empty, default message is used

---

## Star Message API

### 1. Star/Unstar Message

**Endpoint:** `POST /api/chats/:chatId/messages/:messageId/star`  
**Unstar Endpoint:** `DELETE /api/chats/:chatId/messages/:messageId/star`

**Description:** Stars or unstars a message in a chat. Starred messages can be filtered and viewed separately.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (POST):**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "Message starred successfully",
  "isStarred": true
}
```

**Response (DELETE):**
```json
{
  "success": true,
  "message": "Message unstarred successfully",
  "isStarred": false
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Message not found"
}
```

---

### 2. Get Starred Messages

**Endpoint:** `GET /api/chats/:chatId/messages/starred`

**Description:** Retrieves all starred messages for a specific chat.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-123",
      "body": "What time should we meet?",
      "date": "20/02/2023",
      "timestamp": "12:30",
      "messageStatus": "READ",
      "isOpponent": false,
      "type": "text",
      "isStarred": true,
      "starredAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

---

### 3. Get All Starred Messages (All Chats)

**Endpoint:** `GET /api/messages/starred`

**Description:** Retrieves all starred messages across all chats for the authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `chatId` (optional): Filter by specific chat ID

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-123",
      "chatId": "chat-456",
      "chatName": "John Doe",
      "body": "What time should we meet?",
      "date": "20/02/2023",
      "timestamp": "12:30",
      "messageStatus": "READ",
      "isOpponent": false,
      "type": "text",
      "isStarred": true,
      "starredAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

---

## Star Message Implementation Notes

### Frontend Behavior

1. **Star Button:**
   - Appears in message footer (next to timestamp and status icons)
   - Shows filled star icon when starred, outline when not starred
   - Clicking toggles star status
   - Visual feedback on hover

2. **Message State:**
   - Each message has `isStarred` property (boolean) - **user-specific**
   - `isStarred` is determined by the authenticated user's starred messages
   - When fetching messages via `GET /api/chats/:chatId/messages`, API includes `isStarred` based on current user
   - State updates immediately on click (optimistic update)
   - API call happens in background
   - If API fails, state reverts
   - After starring/unstarring, messages are refreshed to get updated status from API

3. **Starred Messages View:**
   - Can be accessed from sidebar menu ("Yıldızlı" / "Starred")
   - Shows all starred messages across all chats
   - Can filter by chat if needed

### Backend Requirements

1. **Database Schema:**
   - Create `user_starred_messages` table (many-to-many relationship)
   - Fields: `id`, `user_id`, `message_id`, `chat_id`, `starred_at`
   - Foreign keys to `users` and `messages` tables
   - Index on `user_id` and `message_id` for faster queries
   - Index on `user_id` and `chat_id` for chat-specific queries
   - **Note:** Messages table should NOT have `is_starred` field - it's user-specific

2. **Star/Unstar Logic:**
   - Check if message exists and user has access to chat
   - Create/delete record in `user_starred_messages` table
   - Set `starred_at` timestamp on star, delete record on unstar
   - Return updated message state with `isStarred` property

3. **Get Starred Messages:**
   - Filter messages where `is_starred = true`
   - Filter by `user_id` for security
   - Support pagination
   - Optionally filter by `chat_id`
   - Sort by `starred_at` DESC (most recently starred first)

### Example Implementation (Node.js/Express)

```javascript
// POST /api/chats/:chatId/messages/:messageId/star
router.post('/chats/:chatId/messages/:messageId/star', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user.id;

    // Verify message exists and user has access to chat
    const message = await Message.findOne({
      where: {
        id: messageId,
        chatId: chatId
      },
      include: [{
        model: Chat,
        include: [{ model: ChatMember, where: { userId } }]
      }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if already starred
    const existingStar = await UserStarredMessage.findOne({
      where: {
        userId: userId,
        messageId: messageId
      }
    });

    if (existingStar) {
      return res.json({
        success: true,
        message: 'Message already starred',
        isStarred: true
      });
    }

    // Star the message (create user-starred-message record)
    await UserStarredMessage.create({
      userId: userId,
      messageId: messageId,
      chatId: chatId,
      starredAt: new Date()
    });

    res.json({
      success: true,
      message: 'Message starred successfully',
      isStarred: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/chats/:chatId/messages/:messageId/star
router.delete('/chats/:chatId/messages/:messageId/star', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user.id;

    // Verify message exists
    const message = await Message.findOne({
      where: {
        id: messageId,
        chatId: chatId
      }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Unstar the message (delete user-starred-message record)
    const deleted = await UserStarredMessage.destroy({
      where: {
        userId: userId,
        messageId: messageId
      }
    });

    if (deleted === 0) {
      return res.json({
        success: true,
        message: 'Message was not starred',
        isStarred: false
      });
    }

    res.json({
      success: true,
      message: 'Message unstarred successfully',
      isStarred: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/chats/:chatId/messages/starred
router.get('/chats/:chatId/messages/starred', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Get user's starred messages for this chat
    const { count, rows: starredRecords } = await UserStarredMessage.findAndCountAll({
      where: {
        userId: userId,
        chatId: chatId
      },
      order: [['starredAt', 'DESC']],
      limit: limit,
      offset: offset,
      include: [{
        model: Message,
        as: 'message'
      }]
    });

    // Format messages with isStarred: true
    const messages = starredRecords.map(record => ({
      ...formatMessage(record.message),
      isStarred: true,
      starredAt: record.starredAt
    }));

    res.json({
      success: true,
      messages: messages,
      total: count,
      page: page,
      limit: limit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/messages/starred
router.get('/messages/starred', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const chatId = req.query.chatId;

    const whereClause = {
      userId: userId
    };

    if (chatId) {
      whereClause.chatId = chatId;
    }

    // Get user's starred messages
    const { count, rows: starredRecords } = await UserStarredMessage.findAndCountAll({
      where: whereClause,
      include: [{
        model: Message,
        as: 'message',
        include: [{
          model: Chat,
          as: 'chat',
          attributes: ['id', 'name', 'image']
        }]
      }],
      order: [['starredAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    // Format messages
    const messages = starredRecords.map(record => ({
      ...formatMessage(record.message),
      isStarred: true,
      starredAt: record.starredAt,
      chatId: record.chatId,
      chatName: record.message?.chat?.name,
      chatImage: record.message?.chat?.image
    }));

    res.json({
      success: true,
      messages: messages,
      total: count,
      page: page,
      limit: limit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

## Database Schema for Starred Messages (User-Specific)

```sql
-- User Starred Messages Table (Many-to-Many relationship)
CREATE TABLE user_starred_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message_id UUID NOT NULL,
  chat_id UUID NOT NULL,
  starred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  UNIQUE(user_id, message_id), -- Prevent duplicate stars
  INDEX idx_user_id (user_id),
  INDEX idx_message_id (message_id),
  INDEX idx_chat_id (chat_id),
  INDEX idx_user_chat (user_id, chat_id),
  INDEX idx_starred_at (starred_at DESC)
);

-- Note: Messages table should NOT have is_starred field
-- Starred status is user-specific and stored in user_starred_messages table
```

---

## Testing Star Message

### Test Cases

1. **Star Message:**
   - Should star a message successfully
   - Should return `isStarred: true`
   - Should set `starredAt` timestamp

2. **Unstar Message:**
   - Should unstar a message successfully
   - Should return `isStarred: false`
   - Should set `starredAt` to null

3. **Get Starred Messages:**
   - Should return only starred messages
   - Should support pagination
   - Should filter by chat if provided
   - Should sort by `starredAt` DESC

### Example cURL Commands

```bash
# Star a message
curl -X POST "http://localhost:3000/api/chats/chat-123/messages/msg-456/star" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Unstar a message
curl -X DELETE "http://localhost:3000/api/chats/chat-123/messages/msg-456/star" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get starred messages for a chat
curl -X GET "http://localhost:3000/api/chats/chat-123/messages/starred?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all starred messages
curl -X GET "http://localhost:3000/api/messages/starred?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Chat Notes API

### 1. Get Chat Notes

**Endpoint:** `GET /api/chats/:chatId/notes`

**Description:** Retrieves all notes for a specific chat.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": "note-123",
      "chatId": "chat-456",
      "content": "Important meeting tomorrow at 2pm",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

---

### 2. Add Chat Note

**Endpoint:** `POST /api/chats/:chatId/notes`

**Description:** Creates a new note for a chat.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Important meeting tomorrow at 2pm"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "id": "note-123",
    "chatId": "chat-456",
    "content": "Important meeting tomorrow at 2pm",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Content is required"
}
```

---

### 3. Update Chat Note

**Endpoint:** `PUT /api/chats/:chatId/notes/:noteId`

**Description:** Updates an existing note.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Updated note content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "note": {
    "id": "note-123",
    "chatId": "chat-456",
    "content": "Updated note content",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-16T14:20:00Z"
  }
}
```

---

### 4. Delete Chat Note

**Endpoint:** `DELETE /api/chats/:chatId/notes/:noteId`

**Description:** Deletes a note from a chat.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Note not found"
}
```

---

## Chat Notes Implementation Notes

### Frontend Behavior

1. **Notes Sidebar:**
   - Accessible from chat header (notes icon)
   - Shows all notes for the current chat
   - Add, edit, and delete functionality
   - Real-time updates

2. **Note Management:**
   - Add new notes with textarea
   - Edit existing notes inline
   - Delete notes with confirmation
   - Notes sorted by creation date (newest first)

3. **Chat List Integration:**
   - Chat list API response includes `notes` (summary) and `notesCount`
   - Can display note indicator in chat list if needed

### Backend Requirements

1. **Database Schema:**
   - Create `chat_notes` table
   - Fields: id, chat_id, user_id, content, created_at, updated_at
   - Foreign key to chats table
   - Index on chat_id and user_id

2. **Note CRUD Operations:**
   - Create: Validate content, associate with chat and user
   - Read: Filter by chat_id and user_id for security
   - Update: Only allow user who created the note
   - Delete: Soft delete or hard delete based on requirements

3. **Chat List API Update:**
   - Include `notes` field (latest note summary or first 50 chars)
   - Include `notesCount` field (total number of notes)
   - Optional: Only include if notes exist

### Example Implementation (Node.js/Express)

```javascript
// GET /api/chats/:chatId/notes
router.get('/chats/:chatId/notes', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Verify chat belongs to user
    const chat = await Chat.findOne({
      where: {
        id: chatId,
        userId: userId
      }
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found'
      });
    }

    const { count, rows: notes } = await ChatNote.findAndCountAll({
      where: {
        chatId: chatId,
        userId: userId
      },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    res.json({
      success: true,
      notes: notes.map(formatNote),
      total: count,
      page: page,
      limit: limit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/chats/:chatId/notes
router.post('/chats/:chatId/notes', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    // Verify chat belongs to user
    const chat = await Chat.findOne({
      where: {
        id: chatId,
        userId: userId
      }
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found'
      });
    }

    const note = await ChatNote.create({
      chatId: chatId,
      userId: userId,
      content: content.trim()
    });

    res.json({
      success: true,
      message: 'Note created successfully',
      note: formatNote(note)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/chats/:chatId/notes/:noteId
router.put('/chats/:chatId/notes/:noteId', authenticate, async (req, res) => {
  try {
    const { chatId, noteId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const note = await ChatNote.findOne({
      where: {
        id: noteId,
        chatId: chatId,
        userId: userId
      }
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    await note.update({
      content: content.trim(),
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Note updated successfully',
      note: formatNote(note)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/chats/:chatId/notes/:noteId
router.delete('/chats/:chatId/notes/:noteId', authenticate, async (req, res) => {
  try {
    const { chatId, noteId } = req.params;
    const userId = req.user.id;

    const note = await ChatNote.findOne({
      where: {
        id: noteId,
        chatId: chatId,
        userId: userId
      }
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    await note.destroy();

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function formatNote(note) {
  return {
    id: note.id,
    chatId: note.chatId,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
}
```

---

## Database Schema for Chat Notes

```sql
-- Chat Notes Table
CREATE TABLE chat_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_chat_id (chat_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at DESC)
);

-- Update chats table to include notes summary (optional)
ALTER TABLE chats 
ADD COLUMN IF NOT EXISTS notes TEXT NULL,
ADD COLUMN IF NOT EXISTS notes_count INTEGER DEFAULT 0;
```

---

## Update Chat List API

The chat list API should include note information:

**Endpoint:** `GET /api/chats`

**Response:**
```json
{
  "success": true,
  "chats": [
    {
      "id": "chat-123",
      "name": "John Doe",
      "image": "/assets/images/placeholder.jpeg",
      "lastMessage": "Hello",
      "timestamp": "14:30",
      "messageStatus": "READ",
      "isOnline": false,
      "lineId": "line1",
      "notes": "Important meeting tomorrow",  // Latest note summary (first 50 chars)
      "notesCount": 3  // Total number of notes
    }
  ]
}
```

---

## Testing Chat Notes

### Test Cases

1. **Add Note:**
   - Should create note successfully
   - Should validate content (not empty)
   - Should associate with correct chat and user

2. **Get Notes:**
   - Should return only notes for the specified chat
   - Should filter by user for security
   - Should support pagination
   - Should sort by creation date DESC

3. **Update Note:**
   - Should update note content
   - Should update `updatedAt` timestamp
   - Should only allow owner to update

4. **Delete Note:**
   - Should delete note successfully
   - Should only allow owner to delete

### Example cURL Commands

```bash
# Get chat notes
curl -X GET "http://localhost:3000/api/chats/chat-123/notes?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add note
curl -X POST "http://localhost:3000/api/chats/chat-123/notes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Important meeting tomorrow at 2pm"
  }'

# Update note
curl -X PUT "http://localhost:3000/api/chats/chat-123/notes/note-456" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated note content"
  }'

# Delete note
curl -X DELETE "http://localhost:3000/api/chats/chat-123/notes/note-456" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Authentication API

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates user with password and returns a JWT token for subsequent API calls.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "user_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid password"
}
```

**Status Codes:**
- `200 OK`: Login successful
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

## Authentication Implementation Notes

### Frontend Behavior

1. **Login Page:**
   - User enters password
   - On submit, calls login API
   - Stores token in `localStorage` with key `whatsapp_web_token`
   - Redirects to home page on success
   - Shows error message on failure

2. **Token Management:**
   - Token stored in `localStorage`
   - Token included in all API requests as `Authorization: Bearer {token}`
   - Token checked on app load
   - If token exists and valid, user stays authenticated
   - If token invalid/expired, redirect to login

3. **Protected Routes:**
   - All routes except `/login` require authentication
   - `ProtectedRoute` component checks authentication
   - Redirects to `/login` if not authenticated

### Backend Requirements

1. **Password Validation:**
   - Validate password against database
   - Use secure password hashing (bcrypt, argon2, etc.)
   - Implement rate limiting to prevent brute force attacks

2. **JWT Token:**
   - Generate JWT token with user ID and expiration
   - Token expiration: 24 hours (or configurable)
   - Include user information in token payload

3. **Security:**
   - Use HTTPS in production
   - Implement rate limiting (e.g., 5 attempts per 15 minutes)
   - Log failed login attempts
   - Consider implementing 2FA for additional security

### Example Implementation (Node.js/Express)

```javascript
// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    // Validate password (example: check against database)
    const user = await User.findOne({ /* find user */ });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      // Log failed attempt
      await logFailedLoginAttempt(req.ip, user.id);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login'
    });
  }
});
```

### Example cURL Commands

```bash
# Login
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "user_password"
  }'
```

---

## Chat List (Inbox) API

### 1. Get Chat List

**Endpoint:** `GET /api/chats`

**Description:** Returns list of all chats (inbox) for the authenticated user. Can be filtered by lines and search query.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `lines` (optional): Comma-separated list of line IDs to filter by (e.g., `line1,line2`)
- `search` (optional): Search query to filter chats by name or last message
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of chats per page (default: 50)

**Response:**
```json
{
  "success": true,
  "chats": [
    {
      "id": "chat-123",
      "name": "John Doe",
      "image": "/assets/images/placeholder.jpeg",
      "lastMessage": "Hello, how are you?",
      "timestamp": "14:30",
      "date": "20/02/2023",
      "messageStatus": "READ",
      "isOnline": false,
      "isPinned": true,
      "notificationsCount": 5,
      "lineId": "line1",
      "notes": "Important meeting tomorrow",
      "notesCount": 3
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 50,
  "hasMore": false
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### 2. Update Selected Lines

**Endpoint:** `PUT /api/lines/selected`

**Description:** Updates the selected lines filter for the authenticated user. This affects which chats are shown in the inbox.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "lines": ["line1", "line2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Selected lines updated successfully"
}
```

---

## Chat List Implementation Notes

### Frontend Behavior

1. **Initial Load:**
   - Fetch chat list on app load
   - Apply default line filter (first line selected)
   - Display chats sorted by last message timestamp (newest first)

2. **Line Filtering:**
   - User can select multiple lines
   - When lines change, fetch filtered chat list
   - Update selected lines via API

3. **Search:**
   - Search by chat name or last message content
   - Real-time filtering (client-side or server-side)
   - Clear search to show all chats

4. **Real-time Updates:**
   - Poll for new messages/chats (optional)
   - WebSocket connection for real-time updates (optional)
   - Update chat list when new message arrives

### Backend Requirements

1. **Database Query:**
   - Join `chats` with `messages` to get last message
   - Filter by `lineId` if lines parameter provided
   - Filter by search query if provided
   - Sort by last message timestamp DESC
   - Support pagination

2. **Performance:**
   - Index on `lineId`, `lastMessageAt`, `userId`
   - Cache frequently accessed chat lists
   - Limit number of chats per page

### Example Implementation (Node.js/Express)

```javascript
// GET /api/chats
router.get('/chats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { lines, search, page = 1, limit = 50 } = req.query;

    // Build query
    const where = { userId };
    
    if (lines) {
      const lineArray = lines.split(',');
      where.lineId = { [Op.in]: lineArray };
    }

    // Get chats with last message
    const chats = await Chat.findAll({
      where,
      include: [
        {
          model: Message,
          as: 'lastMessage',
          required: false,
          order: [['createdAt', 'DESC']],
          limit: 1
        },
        {
          model: ChatNote,
          as: 'notes',
          required: false,
          order: [['createdAt', 'DESC']],
          limit: 1,
          attributes: ['content', 'createdAt']
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Apply search filter if provided
    let filteredChats = chats;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchLower) ||
        chat.lastMessage?.body?.toLowerCase().includes(searchLower)
      );
    }

    // Format response
    const formattedChats = filteredChats.map(chat => ({
      id: chat.id,
      name: chat.name,
      image: chat.image || "/assets/images/placeholder.jpeg",
      lastMessage: chat.lastMessage?.body || "",
      timestamp: formatTime(chat.lastMessage?.createdAt || chat.updatedAt),
      date: formatDate(chat.lastMessage?.createdAt || chat.updatedAt),
      messageStatus: chat.lastMessage?.messageStatus || "SENT",
      isOnline: chat.isOnline || false,
      isPinned: chat.isPinned || false,
      notificationsCount: chat.notificationsCount || 0,
      lineId: chat.lineId,
      notes: chat.notes?.[0]?.content?.substring(0, 50) || null,
      notesCount: await ChatNote.count({ where: { chatId: chat.id } })
    }));

    res.json({
      success: true,
      chats: formattedChats,
      total: filteredChats.length,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: filteredChats.length === parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Example cURL Commands

```bash
# Get chat list
curl -X GET "http://localhost:3000/api/chats?lines=line1,line2&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get chat list with search
curl -X GET "http://localhost:3000/api/chats?search=john&lines=line1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Lines API

### 1. Get Available Lines

**Endpoint:** `GET /api/lines`

**Description:** Returns all available lines (phone numbers) that the authenticated user has access to.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "lines": [
    {
      "id": "line1",
      "phoneNumber": "+90 555 111 2233",
      "label": "Hat 1",
      "labelKey": "lines.line1"
    },
    {
      "id": "line2",
      "phoneNumber": "+90 555 222 3344",
      "label": "Hat 2",
      "labelKey": "lines.line2"
    },
    {
      "id": "line3",
      "phoneNumber": "+90 555 333 4455",
      "label": "Hat 3",
      "labelKey": "lines.line3"
    }
  ],
  "defaultSelected": ["line1"]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### 2. Update Selected Lines

**Endpoint:** `PUT /api/lines/selected`

**Description:** Updates the selected lines for the authenticated user. This affects which chats are shown in the inbox.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "lines": ["line1", "line2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Selected lines updated successfully",
  "selectedLines": ["line1", "line2"]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid line IDs"
}
```

---

## Lines Implementation Notes

### Frontend Behavior

1. **Line Selection:**
   - Multi-select component for lines
   - First line selected by default
   - When lines change, chat list is filtered

2. **Default Selection:**
   - API returns `defaultSelected` array
   - Frontend uses this to set initial selection
   - User can change selection anytime

### Backend Requirements

1. **Database Schema:**
   ```sql
   CREATE TABLE lines (
     id VARCHAR(255) PRIMARY KEY,
     phone_number VARCHAR(20) NOT NULL,
     label VARCHAR(100) NOT NULL,
     label_key VARCHAR(100),
     user_id VARCHAR(255),
     is_active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE user_selected_lines (
     id VARCHAR(255) PRIMARY KEY,
     user_id VARCHAR(255) NOT NULL,
     line_id VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (line_id) REFERENCES lines(id),
     UNIQUE(user_id, line_id)
   );
   ```

2. **Authorization:**
   - Only return lines user has access to
   - Check user permissions for each line

### Example Implementation (Node.js/Express)

```javascript
// GET /api/lines
router.get('/lines', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all lines user has access to
    const lines = await Line.findAll({
      where: {
        isActive: true,
        userId: userId // Or check user permissions
      },
      order: [['label', 'ASC']]
    });

    // Get user's default selected lines
    const userSelectedLines = await UserSelectedLine.findAll({
      where: { userId },
      include: [{ model: Line }]
    });

    const defaultSelected = userSelectedLines.map(usl => usl.lineId);

    res.json({
      success: true,
      lines: lines.map(line => ({
        id: line.id,
        phoneNumber: line.phoneNumber,
        label: line.label,
        labelKey: line.labelKey
      })),
      defaultSelected: defaultSelected.length > 0 ? defaultSelected : [lines[0]?.id]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/lines/selected
router.put('/lines/selected', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { lines } = req.body;

    if (!Array.isArray(lines)) {
      return res.status(400).json({
        success: false,
        error: 'Lines must be an array'
      });
    }

    // Validate line IDs
    const validLines = await Line.findAll({
      where: {
        id: { [Op.in]: lines },
        isActive: true
      }
    });

    if (validLines.length !== lines.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid line IDs'
      });
    }

    // Update user's selected lines
    await UserSelectedLine.destroy({ where: { userId } });
    
    await UserSelectedLine.bulkCreate(
      lines.map(lineId => ({
        id: `usl-${Date.now()}-${Math.random()}`,
        userId,
        lineId
      }))
    );

    res.json({
      success: true,
      message: 'Selected lines updated successfully',
      selectedLines: lines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Example cURL Commands

```bash
# Get lines
curl -X GET "http://localhost:3000/api/lines" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update selected lines
curl -X PUT "http://localhost:3000/api/lines/selected" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lines": ["line1", "line2"]
  }'
```

---

## Search Messages API

### 1. Search Messages in Chat

**Endpoint:** `GET /api/chats/:chatId/messages/search`

**Description:** Searches for messages within a specific chat based on search query.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `q` (required): Search query string
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-123",
      "body": "Hello, how are you?",
      "date": "20/02/2023",
      "timestamp": "12:30",
      "messageStatus": "READ",
      "isOpponent": false,
      "type": "text",
      "highlight": "Hello, <mark>how</mark> are you?"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "query": "how"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Chat not found or unauthorized"
}
```

---

### 2. Search Messages Across All Chats

**Endpoint:** `GET /api/messages/search`

**Description:** Searches for messages across all chats the user has access to.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `q` (required): Search query string
- `chatId` (optional): Filter by specific chat ID
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-123",
      "chatId": "chat-456",
      "chatName": "John Doe",
      "body": "Hello, how are you?",
      "date": "20/02/2023",
      "timestamp": "12:30",
      "messageStatus": "READ",
      "isOpponent": false,
      "type": "text",
      "highlight": "Hello, <mark>how</mark> are you?"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "query": "how"
}
```

---

## Search Messages Implementation Notes

### Frontend Behavior

1. **Search Section:**
   - Search input in chat room header
   - Real-time search as user types (debounced)
   - Display search results below input
   - Highlight matching text in results

2. **Search Results:**
   - Show message preview with context
   - Click result to navigate to message in chat
   - Highlight search term in results

### Backend Requirements

1. **Full-Text Search:**
   - Use database full-text search (PostgreSQL, MySQL, etc.)
   - Or use Elasticsearch for advanced search
   - Index message body content

2. **Performance:**
   - Limit search results per page
   - Cache frequent searches
   - Use database indexes

### Example Implementation (Node.js/Express)

```javascript
// GET /api/chats/:chatId/messages/search
router.get('/chats/:chatId/messages/search', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { q, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Validate user has access to chat
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: ChatMember, where: { userId } }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found or unauthorized'
      });
    }

    // Search messages (using PostgreSQL full-text search example)
    const messages = await Message.findAll({
      where: {
        chatId,
        body: { [Op.like]: `%${q}%` }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Highlight search term in results
    const highlightedMessages = messages.map(msg => ({
      ...msg.toJSON(),
      highlight: msg.body.replace(
        new RegExp(q, 'gi'),
        (match) => `<mark>${match}</mark>`
      )
    }));

    res.json({
      success: true,
      messages: highlightedMessages,
      total: messages.length,
      page: parseInt(page),
      limit: parseInt(limit),
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Example cURL Commands

```bash
# Search messages in chat
curl -X GET "http://localhost:3000/api/chats/chat-123/messages/search?q=hello&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search messages across all chats
curl -X GET "http://localhost:3000/api/messages/search?q=meeting&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Send Message API

### 1. Send Message

**Endpoint:** `POST /api/chats/:chatId/messages`

**Description:** Sends a new message to a specific chat.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "body": "Hello, how are you?",
  "type": "text"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg-789",
    "chatId": "chat-123",
    "body": "Hello, how are you?",
    "date": "20/02/2023",
    "timestamp": "14:35",
    "messageStatus": "SENT",
    "isOpponent": false,
    "type": "text",
    "createdAt": "2024-01-15T14:35:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Chat not found or unauthorized"
}
```

---

## Send Message Implementation Notes

### Frontend Behavior

1. **Message Input:**
   - User types message in footer input
   - Press Enter or click send button
   - Message sent immediately
   - Optimistic update: message appears in chat immediately
   - Update message status when delivery confirmed

2. **Message Types:**
   - Text messages: plain text
   - Media messages: file upload required
   - Location messages: coordinates required
   - Contact messages: contact data required

### Backend Requirements

1. **Message Creation:**
   - Create message record in database
   - Set `messageStatus` to "SENT"
   - Associate with chat and sender
   - Return created message

2. **Message Delivery:**
   - Integrate with messaging service (WhatsApp Business API, etc.)
   - Update message status when delivered/read
   - Webhook for delivery status updates

### Example Implementation (Node.js/Express)

```javascript
// POST /api/chats/:chatId/messages
router.post('/chats/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { body, type = 'text' } = req.body;
    const userId = req.user.id;

    if (!body || body.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message body is required'
      });
    }

    // Validate user has access to chat
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: ChatMember, where: { userId } }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found or unauthorized'
      });
    }

    // Create message
    const message = await Message.create({
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId: userId,
      body: body.trim(),
      type,
      messageStatus: 'SENT',
      isOpponent: false,
      createdAt: new Date()
    });

    // Update chat's last message timestamp
    await Chat.update(
      { updatedAt: new Date() },
      { where: { id: chatId } }
    );

    // Send message via messaging service (WhatsApp Business API, etc.)
    // await sendMessageViaService(chat.phoneNumber, body);

    res.json({
      success: true,
      message: {
        id: message.id,
        chatId: message.chatId,
        body: message.body,
        date: formatDate(message.createdAt),
        timestamp: formatTime(message.createdAt),
        messageStatus: message.messageStatus,
        isOpponent: false,
        type: message.type,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Example cURL Commands

```bash
# Send message
curl -X POST "http://localhost:3000/api/chats/chat-123/messages" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Hello, how are you?",
    "type": "text"
  }'
```

---

## Message Deletion API

### 1. Delete Message

**Endpoint:** `DELETE /api/chats/:chatId/messages/:messageId`

**Description:** Deletes a specific message from a chat. Only the sender of the message or users with appropriate permissions can delete messages.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Message not found or unauthorized"
}
```

**Status Codes:**
- `200 OK`: Message deleted successfully
- `404 Not Found`: Message not found
- `403 Forbidden`: User does not have permission to delete this message
- `500 Internal Server Error`: Server error

---

## Message Deletion Implementation Notes

### Frontend Behavior

1. **Delete Button:**
   - Appears on hover over messages (top-right corner)
   - Shows delete icon (trash can)
   - Clicking triggers confirmation dialog
   - Only visible for messages user can delete

2. **Confirmation Dialog:**
   - Shows confirmation message before deletion
   - User must confirm to proceed
   - Canceling aborts the deletion

3. **Optimistic Update:**
   - Message is removed from UI immediately
   - If API call fails, message is restored
   - Provides instant feedback to user

4. **Error Handling:**
   - Shows error message if deletion fails
   - Restores message in UI on error
   - Logs error for debugging

### Backend Requirements

1. **Authorization:**
   - Verify user has access to the chat
   - Check if user is the sender of the message
   - Optionally: Check if user has admin/moderation permissions

2. **Database:**
   - Soft delete: Mark message as deleted (recommended)
     - Add `deleted_at` timestamp column
     - Add `deleted_by` user ID column
   - Hard delete: Permanently remove from database (not recommended)
     - May break referential integrity
     - Loses audit trail

3. **Soft Delete Implementation (Recommended):**
   ```sql
   ALTER TABLE messages ADD COLUMN deleted_at TIMESTAMP NULL;
   ALTER TABLE messages ADD COLUMN deleted_by VARCHAR(255) NULL;
   ```

4. **Get Messages Query:**
   - Filter out deleted messages: `WHERE deleted_at IS NULL`
   - Or include deleted messages with indicator for admins

5. **Cascade Effects:**
   - Consider impact on starred messages
   - Consider impact on message threads/replies
   - Consider impact on media files (if stored separately)

### Example Implementation (Node.js/Express)

```javascript
// DELETE /api/chats/:chatId/messages/:messageId
router.delete('/chats/:chatId/messages/:messageId', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and user has access to chat
    const message = await Message.findOne({
      where: { id: messageId, chatId: chatId },
      include: [
        {
          model: Chat,
          include: [
            {
              model: ChatMember,
              where: { userId }
            }
          ]
        }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or unauthorized'
      });
    }

    // Check if user is the sender or has admin permissions
    const isSender = message.senderId === userId;
    const isAdmin = await checkAdminPermissions(userId, chatId);

    if (!isSender && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this message'
      });
    }

    // Soft delete (recommended)
    await Message.update(
      {
        deletedAt: new Date(),
        deletedBy: userId
      },
      {
        where: { id: messageId }
      }
    );

    // Or hard delete (not recommended)
    // await Message.destroy({ where: { id: messageId } });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

// Updated GET messages query to exclude deleted messages
router.get('/chats/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Validate user has access to chat
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: ChatMember, where: { userId } }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found'
      });
    }

    // Fetch messages excluding deleted ones
    const messages = await Message.findAll({
      where: {
        chatId,
        deletedAt: null  // Exclude deleted messages
      },
      include: [{
        model: UserStarredMessage,
        as: 'starredByUsers',
        where: { userId },
        required: false
      }],
      order: [['createdAt', 'ASC']]
    });

    const messagesWithStarredStatus = messages.map(msg => ({
      ...msg.toJSON(),
      isStarred: msg.starredByUsers && msg.starredByUsers.length > 0
    }));

    res.json({
      success: true,
      messages: messagesWithStarredStatus,
      total: messagesWithStarredStatus.length,
      hasMore: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Database Schema (Soft Delete)

```sql
-- Add columns for soft delete
ALTER TABLE messages 
ADD COLUMN deleted_at TIMESTAMP NULL,
ADD COLUMN deleted_by VARCHAR(255) NULL;

-- Add index for faster queries
CREATE INDEX idx_messages_deleted_at ON messages(deleted_at);

-- Example: Restore deleted message (if needed)
UPDATE messages 
SET deleted_at = NULL, deleted_by = NULL 
WHERE id = 'message-id';
```

### Security Considerations

1. **Authorization:**
   - Only message sender can delete their own messages
   - Admins/moderators may delete any message
   - Verify chat membership before allowing deletion

2. **Audit Trail:**
   - Log who deleted the message
   - Log when it was deleted
   - Keep deleted messages for a retention period (e.g., 30 days)

3. **Rate Limiting:**
   - Limit number of deletions per user per time period
   - Prevent abuse/spam

4. **Notification:**
   - Optionally notify other chat members of deletion
   - Show "This message was deleted" placeholder

### Testing Message Deletion

### Test Cases

1. **Delete Own Message:**
   - Should delete successfully
   - Should remove from message list
   - Should update UI immediately

2. **Delete Other User's Message:**
   - Should fail with 403 Forbidden
   - Should show error message
   - Should not remove from UI

3. **Delete Non-Existent Message:**
   - Should return 404 Not Found
   - Should show error message

4. **Delete with Invalid Chat:**
   - Should return 404 Not Found
   - Should show error message

5. **Network Error:**
   - Should restore message in UI
   - Should show error notification

### Example cURL Commands

```bash
# Delete message
curl -X DELETE "http://localhost:3000/api/chats/chat-123/messages/msg-456" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get messages (should exclude deleted ones)
curl -X GET "http://localhost:3000/api/chats/chat-123/messages" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Mark Message as Unread API

### 1. Mark Message as Unread

**Endpoint:** `POST /api/chats/:chatId/messages/:messageId/mark-unread`

**Description:** Marks a sent message as unread. This changes the message status from "READ" to "SENT", effectively resetting the read status. Only the sender of the message can mark it as unread.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Message marked as unread successfully",
  "messageStatus": "SENT"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Message not found or unauthorized"
}
```

**Status Codes:**
- `200 OK`: Message marked as unread successfully
- `404 Not Found`: Message not found
- `403 Forbidden`: User is not the sender of the message
- `400 Bad Request`: Message is already unread or cannot be marked as unread
- `500 Internal Server Error`: Server error

---

## Mark as Unread Implementation Notes

### Frontend Behavior

1. **Mark as Unread Button:**
   - Appears in message actions menu (hover over message)
   - Only visible for messages sent by the current user
   - Only visible when message status is "READ"
   - Clicking marks the message as unread (status changes to "SENT")

2. **Message Status Update:**
   - Message status changes from "READ" to "SENT" immediately (optimistic update)
   - Status icon updates to show single tick instead of double tick
   - If API call fails, status reverts to previous state

3. **Use Cases:**
   - User wants to remind themselves to follow up on a message
   - User wants to mark important messages as unread for later review
   - User accidentally marked a message as read and wants to undo

### Backend Requirements

1. **Authorization:**
   - Verify user has access to the chat
   - Check if user is the sender of the message
   - Only allow marking own messages as unread

2. **Message Status:**
   - Update `messageStatus` from "READ" to "SENT"
   - Optionally update `readAt` timestamp to NULL
   - Log the action for audit purposes

3. **Database:**
   ```sql
   UPDATE messages 
   SET message_status = 'SENT', 
       read_at = NULL 
   WHERE id = :messageId 
     AND sender_id = :userId 
     AND chat_id = :chatId
     AND message_status = 'READ';
   ```

### Example Implementation (Node.js/Express)

```javascript
// POST /api/chats/:chatId/messages/:messageId/mark-unread
router.post('/chats/:chatId/messages/:messageId/mark-unread', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and user has access to chat
    const message = await Message.findOne({
      where: { id: messageId, chatId: chatId },
      include: [
        {
          model: Chat,
          include: [
            {
              model: ChatMember,
              where: { userId }
            }
          ]
        }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or unauthorized'
      });
    }

    // Check if user is the sender
    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the sender can mark a message as unread'
      });
    }

    // Check if message is already unread
    if (message.messageStatus !== 'READ') {
      return res.status(400).json({
        success: false,
        error: 'Message is already unread or cannot be marked as unread'
      });
    }

    // Mark as unread
    await Message.update(
      {
        messageStatus: 'SENT',
        readAt: null
      },
      {
        where: { id: messageId }
      }
    );

    res.json({
      success: true,
      message: 'Message marked as unread successfully',
      messageStatus: 'SENT'
    });
  } catch (error) {
    console.error('Mark as unread error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark message as unread'
    });
  }
});
```

### Example cURL Commands

```bash
# Mark message as unread
curl -X POST "http://localhost:3000/api/chats/chat-123/messages/msg-456/mark-unread" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Message Pinning API

### 1. Pin/Unpin Message

**Endpoint:** `POST /api/chats/:chatId/messages/:messageId/pin` (to pin)
**Endpoint:** `DELETE /api/chats/:chatId/messages/:messageId/pin` (to unpin)

**Description:** Pins or unpins a message in a chat. Pinned messages are displayed at the top of the chat and can be used to highlight important messages. Only one message can be pinned per chat at a time (optional: can allow multiple).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (POST):**
```json
{}
```

**Response (POST):**
```json
{
  "success": true,
  "message": "Message pinned successfully",
  "isPinned": true,
  "pinnedAt": "2024-01-15T10:30:00Z"
}
```

**Response (DELETE):**
```json
{
  "success": true,
  "message": "Message unpinned successfully",
  "isPinned": false
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Message not found or unauthorized"
}
```

**Status Codes:**
- `200 OK`: Message pinned/unpinned successfully
- `404 Not Found`: Message not found
- `403 Forbidden`: User does not have permission to pin messages
- `400 Bad Request`: Another message is already pinned (if only one pin allowed)
- `500 Internal Server Error`: Server error

---

### 2. Get Pinned Messages

**Endpoint:** `GET /api/chats/:chatId/messages/pinned`

**Description:** Returns all pinned messages in a specific chat.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-123",
      "chatId": "chat-456",
      "body": "Important meeting tomorrow at 2pm",
      "date": "20/02/2023",
      "timestamp": "12:30",
      "messageStatus": "READ",
      "isOpponent": false,
      "type": "text",
      "isPinned": true,
      "pinnedAt": "2024-01-15T10:30:00Z",
      "pinnedBy": "user-789"
    }
  ],
  "total": 1
}
```

---

## Message Pinning Implementation Notes

### Frontend Behavior

1. **Pin Button:**
   - Appears in message actions menu (hover over message)
   - Shows filled pin icon when pinned, outline when not pinned
   - Clicking toggles pin status
   - Visual feedback on hover

2. **Pinned Messages Display:**
   - Pinned messages appear at the top of the chat (before regular messages)
   - Show pin icon indicator
   - Can be collapsed/expanded
   - Clicking pinned message scrolls to original position

3. **Message State:**
   - Each message has `isPinned` property (boolean)
   - State updates immediately on click (optimistic update)
   - API call happens in background
   - If API fails, state reverts

4. **Pin Limit:**
   - Optionally limit to one pinned message per chat
   - If limit is 1, unpinning previous message when pinning new one
   - Or allow multiple pinned messages

### Backend Requirements

1. **Database Schema:**
   ```sql
   ALTER TABLE messages ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;
   ALTER TABLE messages ADD COLUMN pinned_at TIMESTAMP NULL;
   ALTER TABLE messages ADD COLUMN pinned_by VARCHAR(255) NULL;
   
   -- Index for faster queries
   CREATE INDEX idx_messages_pinned ON messages(chat_id, is_pinned) WHERE is_pinned = TRUE;
   ```

2. **Pin/Unpin Logic:**
   - Check if message exists and user has access to chat
   - If only one pin allowed: Unpin previous pinned message
   - Update `is_pinned`, `pinned_at`, `pinned_by` fields
   - Return updated message state

3. **Get Messages Query:**
   - Include `isPinned` property in message response
   - Optionally sort pinned messages first
   - Or fetch pinned messages separately

4. **Pin Limit (Optional):**
   ```javascript
   // If only one pin allowed per chat
   if (isPinning) {
     // Unpin previous pinned message
     await Message.update(
       { isPinned: false, pinnedAt: null, pinnedBy: null },
       { where: { chatId, isPinned: true } }
     );
   }
   ```

### Example Implementation (Node.js/Express)

```javascript
// POST /api/chats/:chatId/messages/:messageId/pin
router.post('/chats/:chatId/messages/:messageId/pin', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and user has access to chat
    const message = await Message.findOne({
      where: { id: messageId, chatId: chatId },
      include: [
        {
          model: Chat,
          include: [
            {
              model: ChatMember,
              where: { userId }
            }
          ]
        }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or unauthorized'
      });
    }

    // Optional: Check if another message is already pinned (if only one pin allowed)
    const existingPinned = await Message.findOne({
      where: { chatId, isPinned: true, id: { [Op.ne]: messageId } }
    });

    if (existingPinned) {
      // Option 1: Unpin previous message
      await Message.update(
        { isPinned: false, pinnedAt: null, pinnedBy: null },
        { where: { id: existingPinned.id } }
      );
      
      // Option 2: Or return error
      // return res.status(400).json({
      //   success: false,
      //   error: 'Another message is already pinned'
      // });
    }

    // Pin the message
    await Message.update(
      {
        isPinned: true,
        pinnedAt: new Date(),
        pinnedBy: userId
      },
      {
        where: { id: messageId }
      }
    );

    res.json({
      success: true,
      message: 'Message pinned successfully',
      isPinned: true,
      pinnedAt: new Date()
    });
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to pin message'
    });
  }
});

// DELETE /api/chats/:chatId/messages/:messageId/pin
router.delete('/chats/:chatId/messages/:messageId/pin', authenticate, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and user has access to chat
    const message = await Message.findOne({
      where: { id: messageId, chatId: chatId },
      include: [
        {
          model: Chat,
          include: [
            {
              model: ChatMember,
              where: { userId }
            }
          ]
        }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or unauthorized'
      });
    }

    // Unpin the message
    await Message.update(
      {
        isPinned: false,
        pinnedAt: null,
        pinnedBy: null
      },
      {
        where: { id: messageId }
      }
    );

    res.json({
      success: true,
      message: 'Message unpinned successfully',
      isPinned: false
    });
  } catch (error) {
    console.error('Unpin message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unpin message'
    });
  }
});

// GET /api/chats/:chatId/messages/pinned
router.get('/chats/:chatId/messages/pinned', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Validate user has access to chat
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: ChatMember, where: { userId } }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found'
      });
    }

    // Fetch pinned messages
    const pinnedMessages = await Message.findAll({
      where: {
        chatId,
        isPinned: true
      },
      order: [['pinnedAt', 'DESC']] // Most recently pinned first
    });

    res.json({
      success: true,
      messages: pinnedMessages,
      total: pinnedMessages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Updated GET messages query to include isPinned
router.get('/chats/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Validate user has access to chat
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: ChatMember, where: { userId } }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat not found'
      });
    }

    // Fetch messages with pinned status
    const messages = await Message.findAll({
      where: {
        chatId,
        deletedAt: null
      },
      order: [
        ['isPinned', 'DESC'], // Pinned messages first
        ['createdAt', 'ASC']
      ]
    });

    res.json({
      success: true,
      messages: messages,
      total: messages.length,
      hasMore: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Testing Message Pinning

### Test Cases

1. **Pin Message:**
   - Should pin successfully
   - Should update `isPinned` to true
   - Should set `pinnedAt` timestamp
   - Should set `pinnedBy` to current user

2. **Unpin Message:**
   - Should unpin successfully
   - Should update `isPinned` to false
   - Should clear `pinnedAt` and `pinnedBy`

3. **Pin Limit (if enabled):**
   - Should unpin previous message when pinning new one
   - Or should return error if limit reached

4. **Get Pinned Messages:**
   - Should return only pinned messages
   - Should sort by `pinnedAt` DESC

5. **Authorization:**
   - Should only allow chat members to pin messages
   - Should return 403 for unauthorized users

### Example cURL Commands

```bash
# Pin message
curl -X POST "http://localhost:3000/api/chats/chat-123/messages/msg-456/pin" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Unpin message
curl -X DELETE "http://localhost:3000/api/chats/chat-123/messages/msg-456/pin" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get pinned messages
curl -X GET "http://localhost:3000/api/chats/chat-123/messages/pinned" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

