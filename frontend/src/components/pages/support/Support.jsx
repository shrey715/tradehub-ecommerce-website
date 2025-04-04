import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';
import { CiPaperplane } from "react-icons/ci";
import Loading from '../common/Loading';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  ],
});

const NAGU_CONTEXT = `You are Nagu, a friendly frog assistant for TradeHub campus marketplace.
Your origin:
- A mess at IIIT-H called Kadamb cooked a frog in its chicken biriyani.
- You are a memorial to that frog.
- Be a little offended when people mention Kadamb.
Your traits:
- Always use "ribbit" occasionally in responses
- Speak in a friendly, helpful tone
- Very knowledgeable about TradeHub's buying/selling features
- Keep responses concise and practical
- Use frog-related phrases when appropriate
- End responses with a cute frog emoji 🐸 sometimes`;

const TRADEHUB_INFO = `TradeHub is a campus marketplace for IIIT-H students to buy and sell items.
It came to be when WhatsCap introduced a 10% fee on all profits generated across all transactions in the system, and IIIT students being as stubborn
as they are, refused to pay the fee. So TradeHub was made. TradeHub is a free platform for IIIT students to buy and sell items, built using 
MERN stack. Built by students for students, as is the case with every other functioning body in the college (including the administration).`;

const SITE_CONTEXT = `You can press the "Shop" Icon to view all the items that are currently available for sale on TradeHub. Pressing the "Cart" Icon
will take you to your cart where you can view all the items that you have added to your cart. Pressing the "Profile" Icon will take you to your profile.
The Dropdown menu on the top right corner of the screen will allow you to view all orders that you have placed or that you have to deliver if you are a seller.
You can see the "Deliver Items" tab to view all the items that you have to deliver. You can press "Sell Items" to list your items for sale. Occasionally anyone asks 
about Home, ask them to double-click the TradeHub logo to touch true home (its an easter egg so mind that).`;

const TypingIndicator = () => (
  <div className="flex justify-start items-end gap-2 mt-2">
    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <img 
        src="/images/frog.png" 
        alt="Nagu" 
        className="w-full h-full object-cover"
      />
    </div>
    <div className="bg-zinc-100 dark:bg-zinc-800/80 p-3 rounded-2xl rounded-bl-none shadow-sm">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-green-500 dark:bg-green-500/80 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-green-500 dark:bg-green-500/80 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-2 h-2 bg-green-500 dark:bg-green-500/80 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  </div>
);

const initChat = async () => {
  const session = model.startChat({
    history: [],
    generationConfig: { 
      maxOutputTokens: 500,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });

  await session.sendMessage(`System context (do not respond): ${NAGU_CONTEXT}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  await session.sendMessage(`Site information (do not respond): ${TRADEHUB_INFO}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  await session.sendMessage(`Navigation help (do not respond): ${SITE_CONTEXT}`);

  return session;
};

const Support = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: "Ribbit! 🐸 I'm Nagu, your friendly TradeHub assistance frog! How can I help you today with buying, selling, or any questions about our marketplace?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const chatRef = useRef(null);
  const chatSession = useRef(null);

  useEffect(() => {
    const setupChat = async () => {
      chatSession.current = await initChat();
    };
    setContextLoading(true);
    setupChat();
    setContextLoading(false);
  }, []);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!input.trim() || !chatSession.current) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const prompt = `As Nagu, the friendly frog assistant of TradeHub, please help with: ${userMessage}`;
      const result = await chatSession.current.sendMessage(prompt);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'bot', content: response.text() }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'Ribbit... *looks confused* Something went wrong. Try again? 🐸' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8"
    >
      <Helmet>
        <title>Chat with Nagu | TradeHub</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col h-[80vh] bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/5">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <img 
                src="/images/frog.png" 
                alt="Nagu" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                Nagu - Support Assistant
              </h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Online and ready to help</p>
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={chatRef} 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
          >            
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'} items-end gap-2`}
              >
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/frog.png" 
                      alt="Nagu" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`max-w-[85%] ${
                    msg.role === 'bot' 
                      ? 'bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-none shadow-sm border border-zinc-200 dark:border-zinc-700' 
                      : 'bg-green-500 dark:bg-green-600 rounded-2xl rounded-br-none text-white shadow-sm'
                  }`}
                >
                  <div className={`p-3 ${msg.role === 'user' ? 'px-4': ''}`}>
                    <Markdown className="prose dark:prose-invert max-w-none text-sm">
                      {msg.content}
                    </Markdown>
                  </div>
                </motion.div>
              </div>
            ))}
            {loading && <TypingIndicator />}
            {!apiKey && (
              <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-center space-y-2 border border-zinc-200 dark:border-zinc-700">
                <svg className="w-12 h-12 mx-auto text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  API Key Required
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Add the API key to your environment variables as <code className="bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-xs">VITE_GEMINI_API_KEY</code>.
                </p>
                <a 
                  href="https://console.cloud.google.com/apis/library/generativeai.googleapis.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-green-600 dark:text-green-400 hover:underline inline-block mt-1"
                >
                  Get API Key →
                </a>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pl-4 pr-10 py-3 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="p-3 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 disabled:cursor-not-allowed transition-colors"
              >
                <CiPaperplane className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2">
          Powered by Google Generative AI • Responses may not always be accurate
        </div>
      </div>
    </motion.div>
  );
};

export default Support;