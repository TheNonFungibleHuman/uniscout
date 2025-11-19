import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex flex-col max-w-[85%] md:max-w-[75%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Avatar / Name */}
        <span className="text-xs font-medium text-slate-400 mb-1 px-1">
          {isUser ? 'You' : 'UniScout'}
        </span>

        {/* Bubble */}
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm md:text-base shadow-sm leading-relaxed overflow-hidden transition-all
            ${
              isUser
                ? 'bg-brand-600 text-white rounded-tr-none'
                : message.isThinking
                  ? 'bg-brand-50 text-brand-700 border border-brand-100 rounded-tl-none italic'
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
            }`}
        >
          {message.isThinking ? (
            <div className="flex items-center gap-3">
               <div className="w-4 h-4 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin"></div>
               <span className="animate-pulse font-medium">{message.text || "Thinking..."}</span>
            </div>
          ) : (
            <div className="markdown-content space-y-2">
                <ReactMarkdown 
                    components={{
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-inherit" {...props} />,
                        a: ({node, ...props}) => <a className="underline font-medium text-brand-600 hover:text-brand-800" {...props} target="_blank" rel="noopener noreferrer" />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                    }}
                >
                    {message.text}
                </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Grounding Sources */}
        {!isUser && message.sources && message.sources.length > 0 && !message.isThinking && (
          <div className="mt-3 w-full animate-fade-in">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
              Researched Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center max-w-full truncate text-xs bg-slate-100 hover:bg-slate-200 text-brand-700 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors"
                  title={source.title}
                >
                   <span className="truncate max-w-[150px] md:max-w-[200px]">{source.title}</span>
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1 flex-shrink-0 text-slate-400">
                      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                   </svg>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Timestamp */}
        <span className="text-[10px] text-slate-300 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;