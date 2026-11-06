import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ConversationItem } from '@/components/messaging/ConversationItem';
import { ChatWindow } from '@/components/messaging/ChatWindow';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare, Search, Sparkles } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { conversations } = useStore();

  const [searchTerm, setSearchTerm] = useState('');

  // User's conversations
  const userConversations = conversations.filter((c) =>
    c.participantIds.includes(currentUser.id)
  );

  const [activeConversationId, setActiveConversationId] = useState<string>(
    userConversations[0]?.id || ''
  );

  const filteredConversations = userConversations.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchListing = c.listing?.title.toLowerCase().includes(q);
    const matchLast = c.lastMessage.toLowerCase().includes(q);
    return matchListing || matchLast;
  });

  const activeConversation = userConversations.find(
    (c) => c.id === activeConversationId
  ) || userConversations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-lime-text bg-lime/30 px-3 py-1 rounded-full uppercase tracking-wider">
            Campus Peer Chat
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-forest-dark mt-1">
            Buyer-Seller Messages
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Coordinate pickup timing, agree on campus locations, and inspect item details.
          </p>
        </div>

        <div className="text-xs text-charcoal-muted bg-white px-3.5 py-1.5 rounded-xl border border-ivory-border flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-forest" />
          <span>Demo persistence enabled: Chats saved in local reactive storage</span>
        </div>
      </div>

      {userConversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="When you make an offer, request a donation, or a peer inquires about your items, your active chats will show up here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px] items-stretch">
          {/* Left Column: Conversation List */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-ivory-border shadow-card p-4 flex flex-col h-full overflow-hidden">
            {/* Search conversations */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-ivory-soft rounded-xl text-xs text-charcoal border border-ivory-border focus:border-forest outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === (activeConversation?.id || '')}
                  onClick={() => setActiveConversationId(conv.id)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Chat Window */}
          <div className="lg:col-span-8 h-full">
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} />
            ) : (
              <div className="h-full flex items-center justify-center p-8 bg-white rounded-3xl border border-ivory-border text-center text-xs text-charcoal-muted">
                Select a conversation from the left to view messages
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

