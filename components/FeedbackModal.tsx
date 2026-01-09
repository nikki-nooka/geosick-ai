import React, { useState } from 'react';
import type { User, FeedbackItem } from '../types';
import { CloseIcon, SendIcon } from './icons';

interface FeedbackModalProps {
  user: User;
  onClose: () => void;
}

const FEEDBACK_KEY = 'geosick_feedback';

const Star: React.FC<{ filled: boolean; onHover: () => void; onClick: () => void; }> = ({ filled, onHover, onClick }) => (
    <svg 
        onMouseEnter={onHover} 
        onClick={onClick}
        className={`w-8 h-8 cursor-pointer transition-colors ${filled ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ user, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (comment.trim().length < 10) {
            setError('Please provide at least 10 characters in your comment.');
            return;
        }
        
        setStatus('sending');

        setTimeout(() => {
            try {
                const newFeedback: FeedbackItem = {
                    id: new Date().toISOString(),
                    timestamp: Date.now(),
                    userPhone: user.phone,
                    rating,
                    comment,
                };

                const allFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
                allFeedback.push(newFeedback);
                localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));

                setStatus('sent');
                setTimeout(onClose, 2000); // Close modal after 2 seconds on success

            } catch (err) {
                setError('Failed to save feedback. Please try again.');
                setStatus('idle');
            }
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-slate-200">
                     <h2 className="text-lg font-bold text-slate-800">Share Your Feedback</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 flex-shrink-0" aria-label="Close feedback modal">
                        <CloseIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>

                {status === 'sent' ? (
                    <div className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-green-600">Thank You!</h3>
                        <p className="mt-2 text-slate-600">Your feedback is valuable and helps us improve GeoSick.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">How would you rate your experience?</label>
                            <div className="flex justify-center" onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                        key={star}
                                        filled={(hoverRating || rating) >= star}
                                        onHover={() => setHoverRating(star)}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="feedback-comment" className="block text-sm font-medium text-slate-700 mb-1">Your comments</label>
                            <textarea
                                id="feedback-comment"
                                rows={5}
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Tell us what you liked or what could be improved..."
                            />
                        </div>

                        {error && <p className="text-sm text-center text-red-600">{error}</p>}
                        
                        <button 
                            type="submit" 
                            disabled={status === 'sending'} 
                            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-400"
                        >
                            <SendIcon className="w-5 h-5 mr-2" />
                            {status === 'sending' ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};