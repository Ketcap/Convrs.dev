### `createChatroomInput`

This is a Zod schema that defines the shape of the input object for creating a chatroom. It has the following properties:

- `name`: a required string representing the name of the chatroom.
- `features`: an optional array of `RoomFeature` enums representing the features of the chatroom. Defaults to an empty array.
- `openAIModel`: an optional string representing the name of the OpenAI model to use for the chatroom. Defaults to `'gpt-3.5-turbo'`.
- `maxToken`: an optional number representing the maximum number of tokens to generate for each message. Must be at least 1.
- `directive`: an optional string representing the directive to use for the chatroom.
- `voice`: an optional string representing the voice to use for the chatroom.
- `voiceStability`: an optional number between 0 and 1 representing the stability of the voice. Defaults to 0.60.
- `voiceClarity`: an optional number between 0 and 1 representing the clarity of the voice. Defaults to 0.65.
- `image`: an optional string representing the image to use for the chatroom. Defaults to `'ai-1.png'`.

### `chatroomRouter`

This is a TRPC router that defines the following procedures:

- `create`: a private mutation that creates a new chatroom with the given input object and returns the created chatroom.
- `getChatroom`: a private query that returns the chatroom with the given ID if it exists and belongs to the current user.
- `getChatrooms`: a private query that returns all chatrooms belonging to the current user.
- `deleteChatroom`: a private mutation that deletes the chatroom with the given ID if it exists and belongs to the current user.

### `getChatroomMessagesInput`

This is a Zod schema that defines the shape of the input object for getting messages for a chatroom. It has the following properties:

- `chatroomId`: a required string representing the ID of the chatroom to get messages for.
- `page`: an optional number representing the page number of messages to get. Defaults to 1.

### `sendMessageToChatroomInput`

This is a Zod schema that defines the shape of the input object for sending a message to a chatroom. It has the following properties:

- `chatroomId`: a required string representing the ID of the chatroom to send the message to.
- `content`: a required string representing the content of the message.
- `role`: an optional `SenderType` enum representing the role of the sender. Defaults to `SenderType.User`.

### `starMessageInput`

This is a Zod schema that defines the shape of the input object for starring a message. It has the following properties:

- `messageId`: a required string representing the ID of the message to star.
- `isFavorite`: a required boolean representing whether to star or unstar the message.

### `messageRouter`

This is a TRPC router that defines the following procedures:

- `getChatroomMessages`: a private query that returns the messages for the chatroom with the given ID if it exists and belongs to the current user.
- `sendMessageToChatroom`: a private mutation that sends a message to the chatroom with the given ID and returns the created message.
- `addVoiceToMessage`: a private mutation that adds a voice message to the message with the given ID and returns the updated message.
- `starMessage`: a private mutation that stars or unstars the message with the given ID and returns the updated message.