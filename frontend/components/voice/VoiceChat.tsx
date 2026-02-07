"use client";

import { useState, useEffect, useRef } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Send } from 'lucide-react';
import { useVoiceRecognition } from '@/lib/hooks/useVoiceRecognition';
import { speak } from '@/lib/textToSpeech';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface VoiceChatProps {
  onCommand: (command: string, transcript: string) => void;
  onTranscriptChange?: (transcript: string) => void;
}

export interface VoiceChatHandle {
  speak: (text: string) => void;
}

const VoiceChat = forwardRef<VoiceChatHandle, VoiceChatProps>(({ onCommand, onTranscriptChange }, ref) => {
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error,
  } = useVoiceRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-US',
  });

  const [isOpen, setIsOpen] = useState(false);
  const [lastProcessedLength, setLastProcessedLength] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to add bot messages to the chat
  const addBotMessage = (text: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // Expose the speak function to parent components
  useImperativeHandle(ref, () => ({
    speak: (text: string) => {
      // Add the message to chat
      addBotMessage(text);
      // Then speak it
      speak(text);
    }
  }));

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process commands when transcript changes
  useEffect(() => {
    if (transcript.length > lastProcessedLength) {
      const newTranscript = transcript.slice(lastProcessedLength).trim();

      if (newTranscript) {
        // Add user message to chat
        const userMessage: Message = {
          id: Date.now().toString(),
          text: newTranscript,
          sender: 'user',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        processVoiceCommand(newTranscript, transcript);
        setLastProcessedLength(transcript.length);
      }
    }
  }, [transcript, lastProcessedLength]);

  // Notify parent of transcript changes
  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript + interimTranscript);
    }
  }, [transcript, interimTranscript, onTranscriptChange]);

  const processVoiceCommand = async (command: string, fullTranscript: string) => {
    const lowerCommand = command.toLowerCase();

    setIsProcessing(true);

    try {
      let botResponse = '';

      // Detect command type
      if (lowerCommand.includes('add task') || lowerCommand.includes('create task') || lowerCommand.includes('new task')) {
        setLastAction('Adding task...');
        botResponse = 'Adding task...';
        await onCommand('add_task', fullTranscript);
      } else if (lowerCommand.includes('incomplete') || lowerCommand.includes('uncomplete') || lowerCommand.includes('uncheck') || lowerCommand.includes('reopen')) {
        setLastAction('Marking as incomplete...');
        botResponse = 'Marking as incomplete...';
        await onCommand('incomplete_task', fullTranscript);
      } else if (lowerCommand.includes('complete') || lowerCommand.includes('mark done') || lowerCommand.includes('finish') || lowerCommand.includes('check off')) {
        setLastAction('Completing task...');
        botResponse = 'Completing task...';
        await onCommand('complete_task', fullTranscript);
      } else if (lowerCommand.includes('clear') && (lowerCommand.includes('completed') || lowerCommand.includes('done'))) {
        setLastAction('Clearing completed tasks...');
        botResponse = 'Clearing completed tasks...';
        await onCommand('clear_completed', fullTranscript);
      } else if (lowerCommand.includes('delete') || lowerCommand.includes('remove')) {
        setLastAction('Deleting task...');
        botResponse = 'Deleting task...';
        await onCommand('delete_task', fullTranscript);
      } else if (lowerCommand.includes('count') || lowerCommand.includes('how many')) {
        setLastAction('Counting tasks...');
        botResponse = 'Counting tasks...';
        await onCommand('count_tasks', fullTranscript);
      } else if (lowerCommand.includes('list') || lowerCommand.includes('show tasks')) {
        setLastAction('Listing tasks...');
        botResponse = 'Listing tasks...';
        await onCommand('list_tasks', fullTranscript);
      } else if (lowerCommand.includes('read tasks')) {
        setLastAction('Reading tasks...');
        botResponse = 'Reading tasks...';
        await onCommand('read_tasks', fullTranscript);
      } else if (lowerCommand.includes('update') || lowerCommand.includes('edit') || lowerCommand.includes('change') || lowerCommand.includes('rename')) {
        setLastAction('Updating task...');
        botResponse = 'Updating task...';
        await onCommand('update_task', fullTranscript);
      } else {
        // Default: treat as task content
        botResponse = 'Processing your request...';
        await onCommand('input', fullTranscript);
      }

      // Add bot response to chat
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);

      setTimeout(() => setLastAction(''), 2000);
    } catch (error) {
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, there was an error processing your command',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setLastProcessedLength(0);
      startListening();
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    stopListening();
    setIsOpen(false);
    resetTranscript();
    setLastProcessedLength(0);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={toggleListening}
        className={`fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl transition-all duration-300 ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 scale-110 animate-pulse'
            : 'bg-gradient-to-r from-accent to-accent-secondary hover:scale-110'
        }`}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      >
        {isListening ? (
          <MicOff className="h-8 w-8 text-white mx-auto" />
        ) : (
          <Mic className="h-8 w-8 text-white mx-auto" />
        )}

        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Voice Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 md:right-6 z-50 w-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-w-md mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-accent-secondary p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <h3 className="text-white font-bold text-sm md:text-base">Voice Assistant</h3>
              {isListening && (
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white animate-pulse" />
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              aria-label="Close voice chat"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 md:p-4 space-y-3 md:space-y-4 max-h-80 md:max-h-96 overflow-y-auto">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 md:h-3 md:w-3 rounded-full ${
                    isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}
                ></div>
                <span className="text-xs md:text-sm text-gray-300">
                  {isListening ? 'Listening...' : 'Not listening'}
                </span>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-3 w-3 md:h-4 md:w-4 border-2 border-accent border-t-transparent rounded-full"></div>
                  <span className="text-xs text-accent">Processing...</span>
                </div>
              )}
            </div>

            {/* Last Action Feedback */}
            {lastAction && (
              <div className="bg-accent-light border border-accent/30 rounded-lg p-2 md:p-3 animate-slide-up">
                <p className="text-xs md:text-sm text-accent flex items-center">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  {lastAction}
                </p>
              </div>
            )}

            {/* Chat Messages */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 max-h-40 overflow-y-auto">
              {messages.length > 0 ? (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          message.sender === 'user'
                            ? 'bg-accent text-white rounded-br-none'
                            : 'bg-slate-700 text-gray-100 rounded-bl-none'
                        }`}
                      >
                        <div className="font-medium text-xs mb-0.5 opacity-70">
                          {message.sender === 'user' ? 'You' : 'Assistant'}
                        </div>
                        <div>{message.text}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No messages yet. Start speaking!</p>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-xs md:text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Voice Commands Help */}
            <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-3 max-h-40 md:max-h-64 overflow-y-auto">
              <p className="text-[0.6rem] md:text-xs text-gray-400 mb-2 md:mb-3 font-semibold">
                📝 Available Commands:
              </p>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <p className="text-[0.6rem] md:text-xs text-accent font-semibold mb-1">Create & Manage:</p>
                  <ul className="text-[0.6rem] md:text-xs text-gray-500 space-y-1 pl-2">
                    <li>• "Add task [description]"</li>
                    <li>• "Update task [name] to [new name]"</li>
                    <li>• "Delete task [name]"</li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.6rem] md:text-xs text-accent font-semibold mb-1">Mark Status:</p>
                  <ul className="text-[0.6rem] md:text-xs text-gray-500 space-y-1 pl-2">
                    <li>• "Complete task [name]"</li>
                    <li>• "Mark incomplete [name]"</li>
                    <li>• "Check off [name]"</li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.6rem] md:text-xs text-accent font-semibold mb-1">View & Stats:</p>
                  <ul className="text-[0.6rem] md:text-xs text-gray-500 space-y-1 pl-2">
                    <li>• "List tasks"</li>
                    <li>• "Read tasks aloud"</li>
                    <li>• "Count tasks"</li>
                  </ul>
                </div>

                <div>
                  <p className="text-[0.6rem] md:text-xs text-accent font-semibold mb-1">Batch Actions:</p>
                  <ul className="text-[0.6rem] md:text-xs text-gray-500 space-y-1 pl-2">
                    <li>• "Clear completed tasks"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-900/50 p-3 md:p-4 border-t border-slate-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <button
                onClick={toggleListening}
                className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-accent hover:bg-accent-hover text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Start</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  resetTranscript();
                  setLastProcessedLength(0);
                }}
                className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default VoiceChat;
