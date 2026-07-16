# Link Grouping Feature - Backend API Specification

## Overview
This document describes the API endpoints and payloads required to implement the link grouping feature in CardConnect.

---

## New Endpoints

### 1. Create Group
**Endpoint:** `POST /groups`

**Description:** Create a new link group

**Request Body:**
```json
{
  "name": "Social Media"
}
```

**Response (201 Created):**
```json
{
  "status": true,
  "data": {
    "id": "uuid-here",
    "name": "Social Media",
    "userId": "user-id",
    "index": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Validation:**
- `name` is required (non-empty string, max 100 chars)
- Each group must be associated with the authenticated user
- Groups should be ordered by `index`

---

### 2. List Groups
**Endpoint:** `GET /groups`

**Description:** Get all groups for the authenticated user

**Response (200 OK):**
```json
{
  "status": true,
  "data": [
    {
      "id": "group-id-1",
      "name": "Social Media",
      "userId": "user-id",
      "index": 0,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "group-id-2",
      "name": "Work",
      "userId": "user-id",
      "index": 1,
      "createdAt": "2024-01-15T11:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### 3. Rename Group
**Endpoint:** `PATCH /groups/{id}`

**Description:** Update a group's name

**Request Body:**
```json
{
  "name": "Social Networks"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "id": "group-id-1",
    "name": "Social Networks",
    "userId": "user-id",
    "index": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:15:00Z"
  }
}
```

**Validation:**
- `name` is required (non-empty string, max 100 chars)
- Group must belong to the authenticated user

---

### 4. Delete Group
**Endpoint:** `DELETE /groups/{id}`

**Description:** Delete a group and ungroup all its links

**Response (200 OK):**
```json
{
  "status": true,
  "message": "Group deleted successfully"
}
```

**Behavior:**
- When a group is deleted, all links in that group should have their `groupId` set to `null`
- Links themselves are NOT deleted
- Group must belong to the authenticated user

**Response (404 Not Found):**
```json
{
  "status": false,
  "message": "Group not found"
}
```

---

## Updated Endpoints

### 5. Create Link (Enhanced)
**Endpoint:** `POST /links`

**Description:** Create a new link with optional group assignment

**Request Body:**
```json
{
  "title": "My LinkedIn",
  "url": "https://linkedin.com/in/username",
  "icon": "https://cdn.example.com/icon.png",
  "index": 0,
  "groupId": "group-id-1"
}
```

**Response (201 Created):**
```json
{
  "status": true,
  "data": {
    "id": "link-id",
    "title": "My LinkedIn",
    "url": "https://linkedin.com/in/username",
    "icon": "https://cdn.example.com/icon.png",
    "index": 0,
    "groupId": "group-id-1",
    "groupName": "Social Media"
  }
}
```

**Validation:**
- `title` is required
- `url` is required and must be a valid URL
- `icon` is optional
- `groupId` is optional - if provided, must be a valid group belonging to the user
- `index` is optional

---

### 6. Update Link (Enhanced)
**Endpoint:** `PATCH /links/{id}`

**Description:** Update link details including group assignment

**Request Body:**
```json
{
  "title": "LinkedIn Profile",
  "url": "https://linkedin.com/in/newusername",
  "icon": "https://cdn.example.com/new-icon.png",
  "index": 2,
  "groupId": "group-id-2"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "id": "link-id",
    "title": "LinkedIn Profile",
    "url": "https://linkedin.com/in/newusername",
    "icon": "https://cdn.example.com/new-icon.png",
    "index": 2,
    "groupId": "group-id-2",
    "groupName": "Work"
  }
}
```

**Validation:**
- All fields are optional
- `groupId` can be `null` to ungroup a link
- If `groupId` is provided, it must belong to the authenticated user
- Link must belong to the authenticated user

**Note:** Unlike create, when updating:
- Sending `groupId: null` should ungroup the link
- Omitting `groupId` should keep the existing groupId unchanged

---

### 7. List Links (Enhanced)
**Endpoint:** `GET /links`

**Description:** Get all links for the authenticated user, now includes groups

**Response (200 OK):**
```json
{
  "status": true,
  "data": [
    {
      "id": "link-id-1",
      "title": "LinkedIn",
      "url": "https://linkedin.com/in/user",
      "icon": "https://example.com/linkedin-icon.png",
      "index": 0,
      "groupId": "group-id-1",
      "groupName": "Social Media"
    },
    {
      "id": "link-id-2",
      "title": "Twitter",
      "url": "https://twitter.com/user",
      "icon": "https://example.com/twitter-icon.png",
      "index": 1,
      "groupId": "group-id-1",
      "groupName": "Social Media"
    },
    {
      "id": "link-id-3",
      "title": "My Website",
      "url": "https://mywebsite.com",
      "icon": "https://example.com/website-icon.png",
      "index": 2,
      "groupId": null,
      "groupName": null
    }
  ],
  "groups": [
    {
      "id": "group-id-1",
      "name": "Social Media",
      "userId": "user-id",
      "index": 0,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Notes:**
- Include `groupId` and `groupName` in each link
- Include optional `groups` array with all groups for the user
- Maintain existing sorting/ordering

---

### 8. Reorder Links (Enhanced)
**Endpoint:** `PATCH /links/reorder`

**Description:** Reorder links, can move across groups

**Request Body:**
```json
{
  "order": [
    {
      "id": "link-id-2",
      "index": 0
    },
    {
      "id": "link-id-1",
      "index": 1
    },
    {
      "id": "link-id-3",
      "index": 2
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "message": "Links reordered successfully"
}
```

**Validation:**
- All provided link IDs must belong to the authenticated user
- The `index` should update for each link
- Reordering should work independently of groups (a link can be reordered to any position, regardless of group)

---

## Public Profile Endpoints (No changes needed, but ensure groups are included)

### 9. Get Public Profile
**Endpoint:** `GET /profile/{username}`

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "bio": "Software Developer",
      "profileImage": "https://example.com/profile.jpg",
      "username": "johndoe",
      "design": {
        "theme": "minimal",
        "backgroundColor": "#FFFFFF",
        "textColor": "#111111",
        "buttonColor": "#7269E3",
        "buttonStyle": "filled",
        "font": "manrope",
        "profileShape": "circle",
        "linkStyle": "button",
        "coverImage": null,
        "showSocialIcons": false
      },
      "socialLinks": [
        {
          "platform": "instagram",
          "url": "https://instagram.com/johndoe"
        }
      ]
    },
    "links": [
      {
        "id": "link-id-1",
        "title": "LinkedIn",
        "url": "https://linkedin.com/in/johndoe",
        "icon": "https://example.com/icon.png",
        "index": 0,
        "groupId": "group-id-1",
        "groupName": "Social Media"
      }
    ]
  }
}
```

---

## Design Persistence

The design configuration is sent to the backend via the existing `PATCH /profile` endpoint and should be stored as JSON.

**Design Object Schema:**
```json
{
  "theme": "minimal" | "spotlight",
  "backgroundColor": "#RRGGBB",
  "textColor": "#RRGGBB",
  "buttonColor": "#RRGGBB",
  "buttonStyle": "filled" | "outline" | "soft",
  "font": "manrope" | "poppins" | "inter" | "playfair",
  "profileShape": "circle" | "rounded-square",
  "linkStyle": "button" | "card" | "split-card",
  "coverImage": "url" | null,
  "showSocialIcons": true | false
}
```

**Validation Rules:**

- `theme` must be one of: "minimal", "spotlight"
- `buttonStyle` must be one of: "filled", "outline", "soft"
- `profileShape` must be one of: "circle", "rounded-square"
- `linkStyle` must be one of: "button", "card", "split-card"
- `font` must be one of: "manrope", "poppins", "inter", "playfair"
- All color fields must match regex: `^#[0-9A-Fa-f]{6}$`
- `coverImage` should be null when theme is "minimal"
- All fields are optional in PATCH requests

---

## Database Schema Additions

### Updated Users Table
Add design and socialLinks fields:
```sql
ALTER TABLE users ADD COLUMN design JSONB;
ALTER TABLE users ADD COLUMN social_links JSONB;
```

**Design Default (when null):**
```json
{
  "theme": "minimal",
  "backgroundColor": "#FFFFFF",
  "textColor": "#111111",
  "buttonColor": "#7269E3",
  "buttonStyle": "filled",
  "font": "manrope",
  "profileShape": "circle",
  "linkStyle": "button",
  "coverImage": null,
  "showSocialIcons": false
}
```

### New Table: `link_groups`
```sql
CREATE TABLE link_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

CREATE INDEX idx_link_groups_user_id ON link_groups(user_id);
```

### Updated Table: `links`
Add the following columns if not already present:
```sql
ALTER TABLE links ADD COLUMN group_id UUID REFERENCES link_groups(id) ON DELETE SET NULL;
ALTER TABLE links ADD COLUMN group_name VARCHAR(100);

CREATE INDEX idx_links_group_id ON links(group_id);
```

---

## Error Handling

All endpoints should return appropriate HTTP status codes:

- **200 OK** - Successful GET/PATCH request
- **201 Created** - Successful POST request
- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - User not authenticated
- **403 Forbidden** - User trying to access another user's data
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

**Error Response Format:**
```json
{
  "status": false,
  "message": "Error description"
}
```

---

## Authentication
All endpoints require the user to be authenticated. Include the auth token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Business Logic Notes

1. **Group Ownership:** Users can only manage their own groups and links
2. **Cascading Delete:** When a group is deleted, links in it should be ungrouped (groupId set to null)
3. **Group Indexing:** Maintain an `index` field on groups for ordering
4. **Unique Group Names:** Group names should be unique per user (but different users can have same group name)
5. **Link-Group Association:** When assigning a link to a group, validate that the group exists and belongs to the user
6. **Default Sorting:** Links should be sorted by `index` within and across groups

---

## Frontend Integration Notes

The frontend will:
1. Call `POST /groups` to create groups
2. Call `PATCH /groups/{id}` to rename groups
3. Call `DELETE /groups/{id}` to delete groups
4. Call `POST /links` with optional `groupId` when creating links
5. Call `PATCH /links/{id}` with optional `groupId` to move links between groups
6. Call `GET /links` to fetch both links and groups
7. Use `groupId` and `groupName` to render links in grouped sections

---

## Testing Checklist

- [ ] Create multiple groups for a user
- [ ] List groups and verify they include all groups
- [ ] Rename a group and verify the change
- [ ] Delete a group and verify all its links are ungrouped
- [ ] Create a link with a group ID
- [ ] Update a link to move it to a different group
- [ ] Update a link to ungroup it (set groupId to null)
- [ ] List links and verify groupId and groupName are included
- [ ] Verify users can only see their own groups and links
- [ ] Verify reordering works across groups
- [ ] Verify public profile displays grouped links correctly
