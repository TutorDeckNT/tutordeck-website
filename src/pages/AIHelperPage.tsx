import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

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
interface UploadedFile {
    data: Part | null;
    name: string | null;
    previewUrl: string | null;
}

declare global {
    interface Window {
        katex: any;
    }
}

// --- Main Component ---
const AIHelperPage = () => {
  const [chatHistories, setChatHistories] = useState<ChatHistories>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>({ data: null, name: null, previewUrl: null });
  const [isAnswersOnlyMode, setIsAnswersOnlyMode] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedChats = localStorage.getItem('aiChatHistories');
    const loadedChats = savedChats ? JSON.parse(savedChats) : {};
    if (Object.keys(loadedChats).length === 0) {
      createNewChat(loadedChats);
    } else {
      const lastChatId = Object.keys(loadedChats).sort().pop()!;
      setCurrentChatId(lastChatId);
      setChatHistories(loadedChats);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(chatHistories).length > 0) {
      localStorage.setItem('aiChatHistories', JSON.stringify(chatHistories));
    }
  }, [chatHistories]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistories, currentChatId]);

  const handleSendMessage = async () => {
    const hasText = userInput.trim();
    const hasFile = uploadedFile.data !== null;
    if ((!hasText && !hasFile) || isThinking || !currentChatId) return;

    const userParts: Part[] = [];
    if (hasFile && uploadedFile.data) {
        userParts.push(uploadedFile.data);
    }
    if (hasText) {
        userParts.push({ text: userInput });
    }

    const userMessage: Message = { role: 'user', parts: userParts };
    const updatedMessages = [...chatHistories[currentChatId].messages, userMessage];
    
    let updatedTitle = chatHistories[currentChatId].title;
    if (updatedTitle === "New Chat" && updatedMessages.length === 2) {
        updatedTitle = userInput.substring(0, 25) || (hasFile ? "Image Analysis" : "New Chat");
    }

    const updatedChat: Chat = { ...chatHistories[currentChatId], messages: updatedMessages, title: updatedTitle };
    setChatHistories({ ...chatHistories, [currentChatId]: updatedChat });
    setUserInput('');
    resetFileInput();
    setIsThinking(true);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        const errorMsg: Message = { role: 'model', parts: [{ text: "Error: API Key is not configured. Please contact the site administrator." }], modelName: 'System' };
        setChatHistories(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, errorMsg] } }));
        setIsThinking(false);
        return;
    }

    // --- THIS IS THE FIX ---
    const model = isAnswersOnlyMode ? 'gemini-2.5-flash-lite' : 'gemini-2.5-flash';
    const modelDisplayName = isAnswersOnlyMode ? '2.5 Flash-Lite' : '2.5 Flash';
    // -----------------------

    const systemInstruction = {
        parts: [{ text: isAnswersOnlyMode ? 
            `You are a high-speed, direct-answer engine. Your ONLY function is to provide the final, concise answer to the user's query. You MUST follow these rules without deviation:
            1. DO NOT provide any explanations, introductory text, or concluding remarks.
            2. DO NOT use conversational language.
            3. If the answer is a number, provide only the number.
            4. If the answer is a short phrase, provide only the phrase.
            5. If the user asks for a calculation, provide only the final result.` 
            : 
            `You are a helpful and friendly study assistant integrated into the TutorDeck platform. Your goal is to provide clear, accurate, and in-depth explanations to help students understand complex topics. 
            - When asked to solve problems, show your work step-by-step.
            - ALWAYS format mathematical equations and expressions using inline LaTeX (e.g., \`$ax^2 + bx + c = 0$\`) or block-level LaTeX (e.g., \`$$...$$\`).`
        }]
    };

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: updatedMessages, systemInstruction })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error (${response.status}): ${errorData.error.message}`);
        }
        
        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error(`API returned no candidates. Reason: ${data.promptFeedback?.blockReason || 'Unknown'}`);
        }
        const aiResponse = data.candidates[0].content;
        const aiMessage: Message = { ...aiResponse, modelName: modelDisplayName };

        setChatHistories(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, aiMessage] } }));

    } catch (error) {
        console.error("API Error:", error);
        const errorMsg: Message = { role: 'model', parts: [{ text: `Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` }], modelName: 'System' };
        setChatHistories(prev => ({ ...prev, [currentChatId]: { ...prev[currentChatId], messages: [...updatedMessages, errorMsg] } }));
    } finally {
        setIsThinking(false);
    }
  };

  const createNewChat = (initialChats: ChatHistories = chatHistories) => {
    const newId = `chat-${Date.now()}`;
    const newChat: Chat = { title: "New Chat", messages: [{ role: 'model', parts: [{ text: 'New chat started. Ask me anything!' }], modelName: 'System' }] };
    setChatHistories({ ...initialChats, [newId]: newChat });
    setCurrentChatId(newId);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
        if (file) alert("Only image files are currently supported.");
        resetFileInput();
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedFile({
            data: { inlineData: { mimeType: file.type, data: result.split(',')[1] } },
            name: file.name,
            previewUrl: result
        });
    };
    reader.readAsDataURL(file);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadedFile({ data: null, name: null, previewUrl: null });
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
            <aside className="hidden md:flex w-64 bg-dark-card border border-gray-700 rounded-xl flex-col p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-dark-heading">Saved Chats</h2>
                    <button onClick={() => createNewChat()} title="New Chat" className="bg-primary text-dark-bg w-8 h-8 rounded-full text-2xl font-light flex items-center justify-center hover:bg-primary-dark transition-colors">＋</button>
                </div>
                <ul className="list-none overflow-y-auto flex-grow pr-1">
                    {Object.keys(chatHistories).sort().reverse().map(id => (
                        <li key={id} onClick={() => setCurrentChatId(id)} className={`p-3 mb-2 rounded-lg cursor-pointer truncate ${id === currentChatId ? 'bg-primary text-dark-bg' : 'bg-dark-bg hover:bg-gray-600'}`}>
                            {chatHistories[id].title}
                        </li>
                    ))}
                </ul>
            </aside>

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
                
                {uploadedFile.previewUrl && (
                    <div className="px-6 pb-2">
                        <div className="relative inline-block bg-dark-bg p-1 rounded-lg">
                            <img src={uploadedFile.previewUrl} alt="Image preview" className="max-w-[100px] max-h-[100px] rounded-md" />
                            <button onClick={resetFileInput} title="Remove file" className="absolute -top-2 -right-2 bg-gray-500 text-white border-2 border-dark-card rounded-full w-6 h-6 cursor-pointer font-bold text-sm flex items-center justify-center">&times;</button>
                        </div>
                    </div>
                )}

                <div className="p-4 md:p-6 flex-shrink-0 border-t border-gray-700">
                    {isAnswersOnlyMode && (
                        <div className="flex items-center gap-2 bg-dark-bg text-dark-heading px-3 py-1 rounded-full mb-3 text-sm self-start w-fit">
                            <span className="font-semibold text-secondary">Flash-Lite Mode:</span>
                            <span>Answers Only</span>
                            <button onClick={() => setIsAnswersOnlyMode(false)} className="bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">&times;</button>
                        </div>
                    )}
                    <div className="relative flex items-center gap-2 bg-dark-bg border border-gray-600 rounded-full p-2 focus-within:border-primary transition-colors">
                        <input type="file" id="file-input" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                        <label htmlFor="file-input" title="Attach an image" className="p-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer">
                            <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path></svg>
                        </label>
                        
                        <div className="relative">
                            <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} title="More options" className="p-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer">
                                <svg className="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                            </button>
                            {isPopoverOpen && (
                                <div className="absolute bottom-full mb-2 left-0 bg-dark-card border border-gray-600 rounded-lg p-2 shadow-lg z-10 w-48">
                                    <button onClick={() => { setIsAnswersOnlyMode(true); setIsPopoverOpen(false); }} className="w-full text-left px-3 py-1.5 rounded hover:bg-primary hover:text-dark-bg">Flash-Lite (Answers Only)</button>
                                </div>
                            )}
                        </div>

                        <input 
                            type="text" 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder="Ask a question..." 
                            autoComplete="off" 
                            className="w-full bg-transparent border-none text-dark-text placeholder-gray-500 focus:outline-none focus:ring-0 text-base"
                            disabled={isThinking}
                        />
                        <button onClick={handleSendMessage} disabled={isThinking || (!userInput.trim() && !uploadedFile.data)} className="bg-primary text-dark-bg font-semibold px-6 py-2 rounded-full hover:bg-primary-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

// --- ChatBubble Component (Simplified for CDN) ---
const ChatBubble = ({ message }: { message: Message }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const isUser = message.role === 'user';
    const content = message.parts.map(p => p.text || (p.inlineData ? '\n\n*Attached Image*' : '')).join('');

    useEffect(() => {
        if (contentRef.current && content.includes('$') && window.katex) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = marked.parse(content) as string;

            tempDiv.querySelectorAll('p, li, span, div').forEach(el => {
                Array.from(el.childNodes).forEach(child => {
                    if (child.nodeType === 3) { // Text node
                        const text = child.textContent || '';
                        if (text.includes('$')) {
                            const span = document.createElement('span');
                            span.innerHTML = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, p1) => window.katex.renderToString(p1, { displayMode: true, throwOnError: false }))
                                               .replace(/\$([\s\S]*?)\$\$/g, (_, p1) => window.katex.renderToString(p1, { displayMode: false, throwOnError: false }));
                            el.replaceChild(span, child);
                        }
                    }
                });
            });

            if (contentRef.current) {
                contentRef.current.innerHTML = tempDiv.innerHTML;
            }
        }
    }, [content]);

    const initialHtml = marked.parse(content) as string;

    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 px-5 rounded-2xl text-base leading-relaxed ${isUser ? 'bg-gradient-to-br from-primary to-secondary text-dark-bg rounded-br-lg' : 'bg-dark-bg text-dark-text rounded-bl-lg'}`}>
                    <div ref={contentRef} dangerouslySetInnerHTML={{ __html: initialHtml }} />
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
