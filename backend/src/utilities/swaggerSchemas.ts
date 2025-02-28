export const collaboratorSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "integer", "example": 1 },
        "user_id": { "type": "integer", "example": 2 },
        "document_id": { "type": "integer", "example": 1 },
        "role": { "type": "string", "example": "Editor" }
    },
    "required": ["id", "user_id", "document_id", "role"]

}
export const documentSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "integer", "example": 1 },
        "title": { "type": "string", "example": "My Document" },
        "owner_id": { "type": "integer", "example": 1 },
        "content": { "type": "object", "example": { "ops": [{ "insert": "Hello, world!\n" }] } },
        "cursor_positions": { "type": "object", "example": { "user1": { "position": 5 } } },
        "history": { "type": "object", "example": { "changes": [{ "time": "2025-02-27T21:28:17.732Z" }] } },
        "last_edited": { "type": "string", "format": "date-time", "example": "2025-02-27T21:28:17.732Z" }
    },
    "required": ["id", "title", "owner_id", "content", "cursor_positions", "history", "last_edited"]
}


export const userSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "integer", "example": 1 },
        "email": { "type": "string", "example": "user@example.com" },
        "first_name": { "type": "string", "example": "John" },
        "last_name": { "type": "string", "example": "Doe" },
        "created_at": { "type": "string", "format": "date-time", "example": "2025-02-27T21:28:17.732Z" },
        "updated_at": { "type": "string", "format": "date-time", "example": "2025-02-27T21:28:17.732Z" }
    },
    "required": ["id", "email", "first_name", "last_name", "created_at", "updated_at"]
}