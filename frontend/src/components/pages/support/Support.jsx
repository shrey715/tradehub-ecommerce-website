import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown';
import { useEffect, useState, useRef } from 'react';
import { CiPaperplane } from "react-icons/ci";
import Loading from '../common/Loading';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const apiKey = null;
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
  <div className="flex justify-start items-end gap-2">
    <img 
      src="/images/frog.png" 
      alt="Nagu" 
      className="w-6 h-6 rounded-full flex-shrink-0"
    />
    <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
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
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full relative inset-0 flex justify-end items-center bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>Chat with Nagu | TradeHub</title>
      </Helmet>
  
      <div className="h-[85vh] w-full max-w-4xl m-auto px-4 flex flex-col">
        <div className="bg-zinc-200 p-4 rounded-t-lg border-2 border-b-0 border-zinc-100">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Chat Support
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Get help from Nagu, your friendly TradeHub assistant 🐸
          </p>
        </div>
  
        <div className="flex-1 bg-white dark:bg-zinc-800 border-2 border-t-0 border-b-0 border-zinc-100 relative">
          <div 
            ref={chatRef} 
            className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 p-4 space-y-4"
          >            
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'} items-end gap-2`}
              >
                {msg.role === 'bot' && (
                  <img 
                    src="/images/frog.png" 
                    alt="Nagu" 
                    className="w-8 h-8 rounded-full flex-shrink-0 border border-zinc-800 p-0.5"
                  />
                )}
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'bot' 
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50' 
                      : 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 ml-auto'
                  }`}
                >
                  <Markdown className="prose dark:prose-invert max-w-none">
                    {msg.content}
                  </Markdown>
                </div>
              </div>
            ))}
            {loading && <TypingIndicator />}
            {!apiKey && (
              <div className="text-xs text-zinc-500 dark:text-zinc-400 p-4 text-center">
                <p>
                  To enable chat support, you need to provide a valid API key for the Google Generative AI model.
                </p>
                <p>
                  Get your API key from the <a href="https://console.cloud.google.com/apis/library/generativeai.googleapis.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400">Google Cloud Console</a>.
                </p>
                <p>
                  Add the API key to your environment variables as <code>VITE_GEMINI_API_KEY</code>.
                </p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex items-center space-x-2 rounded-b-lg border-2 border-t-0 border-zinc-100 bg-zinc-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <button type="submit" className="p-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500">
            <CiPaperplane className="w-6 h-6" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Support;