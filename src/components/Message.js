import React from 'react';

function Message({ message }) {
  const { role, text } = message;

  return (
    <div className={`flex items-start space-x-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">🤖</span>
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
        role === 'user'
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700'
      }`}>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>

      {role === 'user' && (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">👤</span>
        </div>
      )}
    </div>
  );
}

export default Message;
