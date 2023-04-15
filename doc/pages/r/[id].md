### `Home()`
The main component of the application that renders the chat interface and handles user input.

#### Returns
This function returns the JSX elements that make up the chat interface.

#### Usage
```js
import Home from "@/pages/index";

function App() {
  return (
    <div>
      <Home />
    </div>
  );
}
```

#### Example
```jsx
<Layout>
  <Box
    sx={{
      display: "flex",
      flex: 1,
      alignItems: "flex-start",
      height: "100%",
      overflow: "auto",
      paddingBottom: 100,
    }}
  >
    <Chat />
  </Box>
  <Paper
    pos="absolute"
    sx={{ display: "flex", justifyContent: "center" }}
    bottom={0}
    left={0}
    right={0}
    p={20}
  >
    <Group align={"center"} w="100%">
      <LoadingOverlay
        visible={isThinking.value || isChatroomLoading}
        zIndex={5}
      />
      <Textarea
        ref={(inputRef) => (ref.current = inputRef!)}
        placeholder="If you have any input that you have copied from somewhere, paste it here then follow up with the recording button to talk about it."
        mah={75}
        rows={1}
        miw="55%"
        sx={{ display: "flex", flex: 1 }}
        wrapperProps={{ sx: { flex: 1 } }}
        disabled={!isApplicationAvailable}
        rightSection={<IconSend onClick={onSend} />}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <RecordButton
        disabled={!isApplicationAvailable}
        onClick={async (state) =>
          state ? startRecording(onVoiceSend) : stopRecording()
        }
      />
    </Group>
  </Paper>
</Layout>
```


### `onSend()`
A function that sends the user's input to the chatroom.

#### Usage
```js
onSend();
```

#### Example
```jsx
<Textarea
  ref={(inputRef) => (ref.current = inputRef!)}
  placeholder="If you have any input that you have copied from somewhere, paste it here then follow up with the recording button to talk about it."
  mah={75}
  rows={1}
  miw="55%"
  sx={{ display: "flex", flex: 1 }}
  wrapperProps={{ sx: { flex: 1 } }}
  disabled={!isApplicationAvailable}
  rightSection={<IconSend onClick={onSend} />}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }}
/>
```


### `onVoiceSend(input: string)`
A function that sends the user's voice input to the chatroom.

#### Parameters
1. `input` (string): The user's voice input.

#### Usage
```js
onVoiceSend("Hello, how are you?");
```

#### Example
```jsx
<RecordButton
  disabled={!isApplicationAvailable}
  onClick={async (state) =>
    state ? startRecording(onVoiceSend) : stopRecording()
  }
/>
```