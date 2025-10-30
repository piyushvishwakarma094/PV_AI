import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Message from './components/Message';
import InputBox from './components/InputBox';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Generate session ID on component mount
  useEffect(() => {
    const generateSessionId = () => {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };
    setSessionId(generateSessionId());
  }, []);

  // Scroll to bottom when new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        messages: [...messages, userMessage],
        sessionId
      });

      const aiMessage = { role: 'assistant', text: response.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">PV_AI</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Google Gemini</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💬</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to PV_AI!</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Start a conversation with our AI assistant. Ask questions, get help, or just chat!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
          <InputBox onSendMessage={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}

export default App;
