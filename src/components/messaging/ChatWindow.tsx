import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Conversation, Message, Listing } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import {
  Send,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Bot,
  Info,
} from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const { currentUser, users } = useAuthStore();
  const { messages, sendMessage, listings } = useStore();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUserId =
    conversation.participantIds.find((id) => id !== currentUser.id) || conversation.sellerId;
  const otherUser = users[otherUserId] || {
    id: otherUserId,
    name: 'Campus Peer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    major: 'Student',
    verifiedLabel: 'Verified Student ID',
  };

  const conversationMessages = messages.filter((m) => m.conversationId === conversation.id);
  const listing = conversation.listing || listings.find((l) => l.id === conversation.listingId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(conversation.id, currentUser.id, inputMessage.trim());
    setInputMessage('');
  };

  // Demo simulator for testing interactive replies in demo mode
  const handleSimulateReply = () => {
    const replies = [
      'Hey! Sounds great. I can meet you by the Main Library entrance around 4 PM.',
      'Yes, the item is still available and in great condition!',
      'Awesome! Bring exact cash or we can do campus card transfer on the spot.',
      'Sure, let’s meet at the Student Activity Centre atrium after my 3 PM lecture.',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    sendMessage(conversation.id, otherUserId, reply);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-ivory-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-ivory-border bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${otherUser.id}`}>
            <img
              src={otherUser.avatarUrl}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover border border-ivory-border"
            />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                to={`/profile/${otherUser.id}`}
                className="font-editorial text-base font-bold text-forest-dark hover:underline"
              >
                {otherUser.name}
              </Link>
              <span title="Campus Verified Student">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted truncate">{otherUser.major}</p>
          </div>
        </div>

        {/* Simulate Reply Demo Button */}
        <button
          type="button"
          onClick={handleSimulateReply}
          className="text-xs bg-ivory-soft hover:bg-lime/30 text-forest px-3 py-1.5 rounded-xl border border-ivory-border flex items-center gap-1.5 font-semibold transition-colors"
          title="Simulate peer reply in demo mode"
        >
          <Bot className="w-3.5 h-3.5 text-forest" />
          <span className="hidden sm:inline">Simulate Peer Reply</span>
          <span className="sm:hidden">Reply</span>
        </button>
      </div>

      {/* Listing Preview Bar */}
      {listing && (
        <div className="p-3 bg-ivory-soft border-b border-ivory-border flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={listing.images[0]}
              alt=""
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h5 className="font-bold text-forest-dark truncate">{listing.title}</h5>
              <div className="flex items-center gap-2 text-[11px] text-charcoal-muted">
                <span className="font-bold text-forest">{formatCurrency(listing.price)}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin className="w-3 h-3 text-forest" />
                  {listing.pickupLocation}
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/listing/${listing.id}`}
            className="px-2.5 py-1 rounded-lg bg-white border border-ivory-border hover:border-forest text-forest font-semibold text-xs shrink-0 flex items-center gap-1"
          >
            <span>View</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-ivory/40">
        {conversationMessages.length === 0 ? (
          <div className="text-center py-12 text-xs text-charcoal-muted">
            <p>No messages yet. Say hello and coordinate campus pickup!</p>
          </div>
        ) : (
          conversationMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const isOffer = msg.content.startsWith('[OFFER SUBMITTED]');

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isOffer
                      ? 'bg-lime text-forest-dark font-medium border border-lime-hover shadow-xs'
                      : isMe
                      ? 'bg-forest text-ivory rounded-br-xs shadow-xs'
                      : 'bg-white text-charcoal border border-ivory-border rounded-bl-xs shadow-xs'
                  }`}
                >
                  {isOffer ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 font-bold text-forest uppercase tracking-wider text-[11px]">
                        <Sparkles className="w-3 h-3" />
                        <span>Campus Exchange Proposal</span>
                      </div>
                      <p>{msg.content.replace('[OFFER SUBMITTED]', '').trim()}</p>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                <span className="text-[10px] text-charcoal-muted mt-1 px-1">
                  {formatRelativeTime(msg.createdAt)}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Row */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-ivory-border flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Message ${otherUser.name}...`}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-ivory-border bg-ivory-soft text-xs sm:text-sm text-charcoal focus:border-forest outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="rounded-2xl px-4"
          disabled={!inputMessage.trim()}
          rightIcon={<Send className="w-4 h-4 text-lime" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
