import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

import { Helmet } from 'react-helmet';
import { AiOutlineSend as Send } from "react-icons/ai";

import axios from 'axios';
import { backendUrl } from '../../../main';

const Message = ({ message, isBot }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
  >
    <div className={`max-w-[80%] p-3 rounded-lg ${
      isBot 
        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-tl-none' 
        : 'bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-tr-none'
    }`}>
      <p className="text-sm">{message}</p>
    </div>
  </motion.div>
);

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isBot: PropTypes.bool.isRequired
};

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    // Load chat history from session storage
    const sessionMessages = sessionStorage.getItem('chatHistory');
    if (sessionMessages) {
      setMessages(JSON.parse(sessionMessages));
    } else {
      // Initial bot message
      const initialMessage = {
        text: "Hello! I'm your TradeHub assistant. How can I help you today?",
        isBot: true
      };
      setMessages([initialMessage]);
      sessionStorage.setItem('chatHistory', JSON.stringify([initialMessage]));
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    sessionStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        `${backendUrl}/api/support/chat`,
        { 
          message: input,
          history: messages.map(m => ({
            role: m.isBot ? 'assistant' : 'user',
            content: m.text
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { text: response.data.reply, isBot: true };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      sessionStorage.setItem('chatHistory', JSON.stringify(finalMessages));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble connecting. Please try again.",
        isBot: true 
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="min-h-screen bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>Support | TradeHub</title>
      </Helmet>

      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Support Chat
        </h1>

        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            {messages.map((message, index) => (
              <Message key={index} message={message.text} isBot={message.isBot} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Support;