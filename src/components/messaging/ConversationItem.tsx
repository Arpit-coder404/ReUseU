import React from 'react';
import { Conversation } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRelativeTime } from '@/utils/formatters';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const { users, currentUser } = useAuthStore();
  const otherUserId = conversation.participantIds.find((id) => id !== currentUser.id) || conversation.sellerId;
  const otherUser = users[otherUserId] || {
    name: 'Campus Student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    major: 'Student',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-start gap-3 border ${
        isActive
          ? 'bg-forest text-ivory border-forest shadow-md'
          : 'bg-white hover:bg-ivory-soft text-charcoal border-ivory-border'
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={otherUser.avatarUrl}
          alt={otherUser.name}
          className="w-11 h-11 rounded-full object-cover border border-ivory-border"
        />
        {conversation.unreadCount > 0 && !isActive && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-lime text-forest-dark font-bold text-[10px] rounded-full flex items-center justify-center">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-forest-dark'}`}>
            {otherUser.name}
          </h4>
          <span
            className={`text-[10px] shrink-0 ${
              isActive ? 'text-lime' : 'text-charcoal-muted'
            }`}
          >
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        {conversation.listing && (
          <p
            className={`text-[11px] font-semibold truncate ${
              isActive ? 'text-lime' : 'text-forest'
            }`}
          >
            Re: {conversation.listing.title}
          </p>
        )}

        <p
          className={`text-[11px] truncate mt-0.5 ${
            isActive ? 'text-ivory-soft' : 'text-charcoal-muted'
          }`}
        >
          {conversation.lastMessage}
        </p>
      </div>
    </button>
  );
};

