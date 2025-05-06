
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/button';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CommentProps {
  screenshotId: string;
  comments: any[];
  onCommentAdded: () => void;
}

export const Comments = ({ screenshotId, comments, onCommentAdded }: CommentProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !content.trim()) {
      toast.error('Please log in and write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          screenshotId,
          parentComment: replyTo,
        }),
      });
      
      if (res.ok) {
        setContent('');
        setReplyTo(null);
        onCommentAdded();
        toast.success('Comment posted successfully!');
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      toast.error('Error posting comment');
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!session) {
      toast.error('Please log in to like comments');
      return;
    }

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });
      
      if (res.ok) {
        onCommentAdded();
        toast.success('Like updated!');
      } else {
        throw new Error('Failed to update like');
      }
    } catch (error) {
      toast.error('Error updating like');
      console.error('Error liking comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
          className="w-full p-4 rounded bg-zinc-800/50 border border-zinc-700 min-h-[100px]"
          required
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700"
          >
            {submitting ? 'Posting...' : (replyTo ? 'Reply' : 'Comment')}
          </Button>
          {replyTo && (
            <Button
              type="button"
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600"
            >
              Cancel Reply
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {comment.author.image && (
                  <Image
                    src={comment.author.image}
                    alt={comment.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">{comment.author.name}</span>
              </div>
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded ${
                  comment.likes?.some((like: any) => like.userId === session?.user?.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
              >
                ❤️ {comment.likes?.length || 0}
              </button>
            </div>
            <p className="mb-2">{comment.content}</p>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Reply
            </button>
            
            {comment.replies?.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="p-4 rounded bg-zinc-900/50 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {reply.author.image && (
                          <Image
                            src={reply.author.image}
                            alt={reply.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="font-medium">{reply.author.name}</span>
                      </div>
                      <button
                        onClick={() => handleLike(reply.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                          reply.likes?.some((like: any) => like.userId === session?.user?.id)
                            ? 'bg-purple-600 text-white'
                            : 'bg-zinc-700 hover:bg-zinc-600'
                        }`}
                      >
                        ❤️ {reply.likes?.length || 0}
                      </button>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
