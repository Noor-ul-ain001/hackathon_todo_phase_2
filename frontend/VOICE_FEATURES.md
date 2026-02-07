# Voice Chat Features Documentation

## Overview
The Agentic Todo app now includes comprehensive voice chat functionality powered by the Web Speech API. Users can manage their tasks entirely hands-free using natural voice commands.

## Features

### 1. Voice Recognition
- **Real-time transcription** of spoken words
- **Continuous listening** mode
- **Interim results** for immediate feedback
- **Multi-language support** (default: en-US)

### 2. Voice Commands

#### Add Tasks
- "Add task buy groceries"
- "Create task call mom"
- "New task finish homework"

#### Update/Edit Tasks
- "Update task buy groceries to buy milk"
- "Rename task old name to new name"
- "Edit task homework to study for exam"
- "Change task meeting to conference call"

#### Complete Tasks
- "Complete task buy groceries"
- "Mark done buy groceries"
- "Finish task buy groceries"
- "Check off buy groceries"

#### Mark Incomplete
- "Mark incomplete buy groceries"
- "Uncomplete task buy groceries"
- "Uncheck buy groceries"
- "Reopen task buy groceries"

#### Delete Tasks
- "Delete task buy groceries"
- "Remove task buy groceries"

#### List Tasks
- "List tasks"
- "Show my tasks"
- "Display all tasks"

#### Read Tasks Aloud
- "Read tasks"
- "Read my tasks aloud"

#### Count Tasks
- "Count tasks"
- "How many tasks"
- "Number of tasks"

#### Clear Completed Tasks
- "Clear completed tasks"
- "Delete all completed tasks"
- "Remove all done tasks"

### 3. Text-to-Speech Feedback
- Confirms when tasks are added
- Announces task completion
- Provides status updates
- Reads task lists aloud

## User Interface

### Floating Voice Button
- **Location**: Bottom-right corner of the screen
- **Colors**:
  - Inactive: Teal/Emerald gradient
  - Active: Red/Pink gradient with pulse animation
- **Icon**: Microphone (Mic when inactive, MicOff when active)

### Voice Chat Modal
- **Transcript Display**: Shows what you're saying in real-time
- **Status Indicator**: Green dot when listening
- **Command Help**: Quick reference for available commands
- **Control Buttons**: Start/Stop listening, Clear transcript

## Technical Implementation

### Files Created

1. **`lib/hooks/useVoiceRecognition.ts`**
   - Custom React hook for speech recognition
   - Handles browser API integration
   - Manages listening state

2. **`lib/textToSpeech.ts`**
   - Text-to-speech utility class
   - Voice synthesis wrapper
   - Speech control methods

3. **`lib/voiceCommands.ts`**
   - Command parsing logic
   - Task matching algorithms
   - Feedback generation

4. **`components/voice/VoiceChat.tsx`**
   - Main voice chat UI component
   - Command processing
   - Visual feedback

### Browser Support

The voice features work in browsers that support:
- **Web Speech API** (Chrome, Edge, Safari)
- **SpeechRecognition** interface
- **SpeechSynthesis** interface

**Not supported**: Firefox (limited support), IE11

### Accessibility

- **Keyboard accessible**: Can be triggered via keyboard
- **Screen reader friendly**: Proper ARIA labels
- **Visual feedback**: Clear status indicators
- **Error handling**: Graceful fallbacks for unsupported browsers

## Usage Guide

### For End Users

1. **Click the microphone button** in the bottom-right corner
2. **Allow microphone access** when prompted (first time only)
3. **Speak your command** clearly
4. **Wait for confirmation** (voice feedback)
5. **View results** in your task list

### Tips for Best Results

- **Speak clearly** and at a normal pace
- **Use specific task names** when updating/deleting/completing tasks
- **Wait for the green indicator** before speaking your command
- **Use exact task names** for better matching (e.g., if task is "Buy groceries", say "Complete task buy groceries")
- **For updates**, use the format: "Update task [old name] to [new name]"
- **Keep background noise** to a minimum for better recognition
- **Natural language** works - the system understands variations
- **Watch the action feedback** in the modal to confirm your command is being processed
- **One command at a time** - wait for completion before issuing the next command

## Privacy & Security

- **No data storage**: Voice data is processed locally in your browser
- **No external services**: Uses built-in browser APIs only
- **Temporary processing**: Transcripts are cleared when you close the modal
- **User control**: You can stop listening at any time

## Troubleshooting

### Voice not recognized?
- Check microphone permissions in browser settings
- Ensure microphone is working (test in other apps)
- Try speaking more clearly or slower
- Reduce background noise

### Commands not working?
- Check the command format in the help panel
- Use exact task names for completion/deletion
- Try rephrasing your command
- Verify the task exists in your list

### No voice feedback?
- Check system volume settings
- Ensure browser has permission to play audio
- Try refreshing the page
- Check if another tab is using audio

## Future Enhancements

Potential improvements for future versions:
- Custom wake words ("Hey Todo...")
- Multi-language support
- Voice authentication
- Conversation mode
- Task categorization via voice
- Smart task scheduling
- Voice shortcuts/macros

## API Reference

### useVoiceRecognition Hook

```typescript
const {
  isListening,        // boolean
  transcript,         // string (final)
  interimTranscript,  // string (in-progress)
  startListening,     // () => void
  stopListening,      // () => void
  resetTranscript,    // () => void
  isSupported,        // boolean
  error,              // string | null
} = useVoiceRecognition(options);
```

### Text-to-Speech Functions

```typescript
speak(text: string, options?: SpeakOptions): void
stopSpeaking(): void
getTextToSpeech(): TextToSpeech
```

### Voice Command Parser

```typescript
parseVoiceCommand(transcript: string): VoiceCommand
extractTaskTitle(transcript: string): string
findTaskByVoice(voiceInput: string, tasks: Task[]): Task | null
generateVoiceFeedback(action: string, success: boolean, details?: string): string
```

---

**Version**: 1.0.0
**Last Updated**: 2024-12-26
**Compatibility**: Chrome 25+, Edge 79+, Safari 14.1+
