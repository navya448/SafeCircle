
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { getSafetyChatResponse } from '@/ai/flows/safety-chat';
import { cn } from '@/lib/utils';
import type { SafetyChatInput } from '@/ai/schemas/safety-chat-schema';


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function SafetyChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
   useEffect(() => {
    // Initial bot message
    setMessages([
      { sender: 'bot', text: "Hello! I'm your personal safety assistant. Ask me anything about staying safe on campus, or describe a situation for advice. How can I help you today?" }
    ]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyForAI: SafetyChatInput['history'] = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: [{ text: m.text }]
      }));
      
      const response = await getSafetyChatResponse({
        question: input,
        history: historyForAI,
      });

      const botMessage: Message = { sender: 'bot', text: response };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to get chat response:", error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Safety Chat</h1>
        <p className="text-muted-foreground mt-2">Your AI-powered personal safety assistant.</p>
      </div>
      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>Ask for safety tips or describe a situation.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-4", { "justify-end": message.sender === 'user' })}>
                {message.sender === 'bot' && (
                  <Avatar className="w-10 h-10 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary/20">
                      <Bot className="text-primary"/>
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("max-w-md p-3 rounded-xl shadow", {
                  "bg-primary/10 text-primary-foreground-dark": message.sender === 'bot',
                  "bg-primary text-primary-foreground": message.sender === 'user'
                })}>
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="w-10 h-10 border">
                     <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                 <Avatar className="w-10 h-10 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary/20">
                      <Bot className="text-primary"/>
                    </AvatarFallback>
                  </Avatar>
                <div className="max-w-md p-3 rounded-xl shadow bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for safety tips..."
              autoComplete="off"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
