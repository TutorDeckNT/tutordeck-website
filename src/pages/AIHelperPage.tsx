import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// --- TypeScript Interfaces ---
interface Part {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface Message {
  role: 'user' | 'model';
  parts: Part[];
  modelName?: string;
}

interface Chat {
  title: string;
  messages: Message[];
}

interface ChatHistories {
  [key: string]: Chat;
}

// --- Main Component ---
const AIHelperPage = () => {
  const [chatHistories, setChatHistories] = useState<ChatHistories>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Load chats from local storage on initial render
  useEffect(() => {
    const savedChats = localStorage.getItem('aiChatHistories');
    const loadedChats = savedChats ? JSON.parse(savedChats) : {};
    
    if (Object.keys(loadedChats).length === 0) {
      const newId = `chat-${Date.now()}`;
      const newChat: Chat = { title: "New Chat", messages: [{ role: 'model', parts: [{ text: 'New chat started. Ask me anything!' }], modelName: 'System' }] };
      loadedChats[newId] = newChat;
      setCurrentChatId(newId);
    } else {
      const lastChatId = Object.keys(loadedChats).sort().pop()!;
      setCurrentChatId(lastChatId);
    }
    setChatHistories(loadedChats);
  }, []);

  // Save chats whenever they change
  useEffect(() => {
    if (Object.keys(chatHistories).length > 0) {
      localStorage.setItem('aiChatHistories', JSON.stringify(chatHistories));
    }
  }, [chatHistories]);

  // Auto-scroll chat box
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistories, currentChatId]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isThinking || !currentChatId) return;

    const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
    const updatedMessages = [...chatHistories[currentChatId].messages, userMessage];
    
    let updatedTitle = chatHistories[currentChatId].title;
    if (updatedTitle === "New Chat" && updatedMessages.length === 2) {
        updatedTitle = userInput.substring(0, 25) || "New Chat";
    }

    const updatedChat: Chat = { ...chatHistories[currentChatId], messages: updatedMessages, title: updatedTitle };
    setChatHistories({ ...chatHistories, [currentChatId]: updatedChat });
    setUserInput('');
    setIsThinking(true);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        const errorMsg: Message = { role: 'model', parts: [{ text: "Error: API Key is not configured. Please contact the site administrator." }], modelName: 'System' };
        setChatHistories(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, errorMsg] } }));
        setIsThinking(false);
        return;
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: updatedMessages })
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        
        const data = await response.json();
        const aiResponse = data.candidates[0].content;
        const aiMessage: Message = { ...aiResponse, modelName: '1.5 Flash' };

        setChatHistories(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, aiMessage] } }));

    } catch (error) {
        console.error("API Error:", error);
        const errorMsg: Message = { role: 'model', parts: [{ text: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` }], modelName: 'System' };
        setChatHistories(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, errorMsg] } }));
    } finally {
        setIsThinking(false);
    }
  };

  const createNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat: Chat = { title: "New Chat", messages: [{ role: 'model', parts: [{ text: 'New chat started. Ask me anything!' }], modelName: 'System' }] };
    setChatHistories({ ...chatHistories, [newId]: newChat });
    setCurrentChatId(newId);
  };

  const currentChat = currentChatId ? chatHistories[currentChatId] : null;

  return (
    <main className="bg-dark-bg text-dark-text font-sans p-4 md:p-6 flex flex-col h-screen gap-4 mt-16">
        <header className="flex justify-between items-center w-full flex-shrink-0">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-dark-heading">Study Helper</h1>
                <small className="text-sm text-primary font-semibold">(powered by TutorDeck Connect)</small>
            </div>
        </header>

        <div className="flex w-full flex-grow min-h-0 gap-6">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 bg-dark-card border border-gray-700 rounded-xl flex-col p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-dark-heading">Saved Chats</h2>
                    <button onClick={createNewChat} title="New Chat" className="bg-primary text-dark-bg w-8 h-8 rounded-full text-2xl font-light flex items-center justify-center hover:bg-primary-dark transition-colors">＋</button>
                </div>
                <ul className="list-none overflow-y-auto flex-grow pr-1">
                    {Object.keys(chatHistories).sort().reverse().map(id => (
                        <li key={id} onClick={() => setCurrentChatId(id)} className={`p-3 mb-2 rounded-lg cursor-pointer truncate ${id === currentChatId ? 'bg-primary text-dark-bg' : 'bg-dark-bg hover:bg-gray-600'}`}>
                            {chatHistories[id].title}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Chat Container */}
            <div className="flex-grow flex flex-col bg-dark-card border border-gray-700 rounded-xl overflow-hidden">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-bold text-dark-heading truncate">{currentChat?.title || 'Loading...'}</h3>
                    {isThinking && <span className="font-bold text-secondary animate-pulse">Thinking...</span>}
                </header>
                
                <div ref={chatBoxRef} className="flex-grow p-6 overflow-y-auto flex flex-col gap-8">
                    {currentChat?.messages.map((msg, index) => (
                        <ChatBubble key={index} message={msg} />
                    ))}
                </div>
                
                <div className="p-4 md:p-6 flex-shrink-0 border-t border-gray-700">
                    <div className="relative flex items-center gap-2 bg-dark-bg border border-gray-600 rounded-full p-2 focus-within:border-primary transition-colors">
                        <input 
                            type="text" 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                            placeholder="Ask a question..." 
                            autoComplete="off" 
                            className="w-full bg-transparent border-none text-dark-text placeholder-gray-500 focus:outline-none focus:ring-0 text-base"
                            disabled={isThinking}
                        />
                        <button onClick={handleSendMessage} disabled={isThinking || !userInput.trim()} className="bg-primary text-dark-bg font-semibold px-6 py-2 rounded-full hover:bg-primary-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

// --- ChatBubble Component ---
const ChatBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === 'user';
    const content = message.parts.map(p => p.text || '').join('');

    const renderContent = (htmlContent: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Render LaTeX
        tempDiv.querySelectorAll('p, li, span, div').forEach(el => {
            Array.from(el.childNodes).forEach(child => {
                if (child.nodeType === 3) { // Text node
                    const text = child.textContent || '';
                    if (text.includes('$')) {
                        const span = document.createElement('span');
                        span.innerHTML = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, p1) => {
                            return katex.renderToString(p1, { displayMode: true, throwOnError: false });
                        }).replace(/\$([\s\S]*?)\$/g, (match, p1) => {
                            return katex.renderToString(p1, { displayMode: false, throwOnError: false });
                        });
                        el.replaceChild(span, child);
                    }
                }
            });
        });

        // Style code blocks
        tempDiv.querySelectorAll('pre').forEach(pre => {
            pre.className = 'bg-dark-bg p-4 rounded-lg overflow-x-auto my-2 border border-gray-700';
        });
        tempDiv.querySelectorAll('code:not(pre code)').forEach(code => {
            code.className = 'font-mono text-sm bg-dark-bg px-1 py-0.5 rounded';
        });

        return { __html: tempDiv.innerHTML };
    };

    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 px-5 rounded-2xl text-base leading-relaxed ${isUser ? 'bg-gradient-to-br from-primary to-secondary text-dark-bg rounded-br-lg' : 'bg-dark-bg text-dark-text rounded-bl-lg'}`}>
                    <div dangerouslySetInnerHTML={renderContent(marked.parse(content) as string)} />
                </div>
                {!isUser && message.modelName && (
                    <div className="text-xs text-gray-500 italic px-2">
                        Generated by Gemini {message.modelName}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIHelperPage;
