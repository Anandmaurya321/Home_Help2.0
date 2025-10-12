import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../hooks/api'

// --- ICONS (Unchanged) ---
const StarIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-500"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
// NEW: Chat Icon
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const InfoIcon = ({ children }) => <div className="flex items-center space-x-3 text-slate-600">{children}</div>;

// --- DEDICATED UI STATE COMPONENTS (Unchanged) ---
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center space-x-2 text-slate-500">
            <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg">Loading...</span>
        </div>
    </div>
);

const ErrorDisplay = ({ title = "Oops! An Error Occurred", message }) => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-2">{title}</h2>
            <p className="text-slate-600">{message}</p>
        </div>
    </div>
);

const Modal = ({ title, message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 mb-4">{message}</p>
            <button onClick={onClose} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Close
            </button>
        </div>
    </div>
);

const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-4"
            onClick={onClose}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-4xl hover:text-slate-300 transition-colors"
                aria-label="Close image view"
            >
                &times;
            </button>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={imageUrl} 
                    alt="Full size view of service provider" 
                    className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl" 
                />
            </div>
        </div>
    );
};






// --- CUSTOM HOOK to fetch service provider data (Unchanged) ---
const useServiceProvider = (id) => {
    const [provider, setProvider] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => { // useCallback hook :: return function :: prevent from recreation of function :: useCallback()
        if (!id) {
            setIsLoading(false);
            setError("No provider ID specified.");
            return;
        }
        setIsLoading(true);
        setError(null);
       
        try {

            let data
            await API.get(`/servicepro/${id}`)
            .then((res)=>{
              data = res.data;
            })
            .catch((err)=>{
            throw new Error(`Failed to fetch data. Server error: ${err.message || "---"}`);
            })

            const normalizedData = {
                ...data,
                name: data.name || "N/A",
                service: data.service || "N/A",
                experience: data.experience || "N/A",
                contact: data.contact || "N/A",
                address: data.address || "N/A",
                reviews: Array.isArray(data.reviews) ? data.reviews : [],
                imageurl: data.imageurl || "N/A"
            };
            setProvider(normalizedData);
        } 
        catch (err) {
            console.error('Failed to load service provider data:', err);
            setError(err.message || 'An unknown error occurred while fetching data.');
        } 
        finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { provider, isLoading, error, refetch: fetchData };
};







// --- REVIEW COMPONENTS ---

const StarRatingInput = ({ rating, onRatingChange, error }) => {
    const [hover, setHover] = useState(0);
    return (
        <div>
            <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                        <label key={index}>
                            <input type="radio" name="rating" value={ratingValue} onClick={() => onRatingChange(ratingValue)} className="hidden" />
                            <StarIcon
                                className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                            />
                        </label>
                    );
                })}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};






const ReviewCard = ({ review }) => {
    const maskEmail = (email) => {
        if (!email || !email.includes('@')) return 'Anonymous';
        const [name, domain] = email.split('@');
        return `${name.substring(0, 2)}***@${domain}`;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} />
                    ))}
                </div>
                <span className="text-xs font-medium text-slate-500">{maskEmail(review.email)}</span>
            </div>
            <p className="text-sm text-slate-700 italic">"{review.review}"</p>
        </div>
    );
};





// MODIFIED: This component now contains the Chat button
const ProviderDetails = ({ provider, onImageClick  , providerId}) => {
    // MODIFIED: Instantiate the navigate hook
    const navigate = useNavigate();
    const reviews = provider.reviews || [];
    const reviewCount = reviews.length;
    
    const averageRating = reviewCount > 0
        ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviewCount
        : 0;

    return (
        <div className="lg:col-span-5 bg-slate-100/80 p-6 sm:p-8 flex flex-col">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                <img
                    src={provider.imageurl || 'https://placehold.co/128x128/E2E8F0/4A5568?text=Photo'}
                    alt={provider.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/E2E8F0/4A5568?text=Error'; }}
                    onClick={() => onImageClick(provider.imageurl)}
                />
                
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-slate-800">{provider.name}</h1>
                    <p className="text-indigo-600 font-medium mt-1">{provider.service}</p>
                    
                    <div className="flex items-center mt-3 justify-center sm:justify-start">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-300'}`} />
                            ))}
                        </div>
                        {reviewCount > 0 && (
                            <span className="ml-2 text-sm text-slate-600">
                                {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 space-y-4 text-sm">
                <InfoIcon><BriefcaseIcon /><span>{provider.experience || 'Experience not specified'}</span></InfoIcon>
                <InfoIcon><PhoneIcon /><span>{provider.contact}</span></InfoIcon>
                <InfoIcon><MapPinIcon /><span>{provider.address}</span></InfoIcon>
            </div>

            {/* NEW: Chat button added here */}
            <div className="mt-8">
                <button
                    onClick={() => navigate('/firstMessage' , {state : {providerId}})}
                    className="w-full flex items-center justify-center space-x-3 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Chat with provider"
                >
                    <ChatIcon />
                    <span>Start a Chat</span>
                </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 flex-grow flex flex-col">
                <h4 className="text-base font-semibold text-slate-800 mb-4">What others said:</h4>
                <div className="space-y-4 flex-grow overflow-y-auto pr-2 -mr-2">
                    {reviewCount > 0 ? (
                        reviews.map((r) => (
                            <ReviewCard key={r._id?.$oid || Math.random()} review={r} />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                           <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- REVIEW FORM (Unchanged) ---
const FORM_ACTIONS = {
    SET_FIELD: 'SET_FIELD',
    SET_ERRORS: 'SET_ERRORS',
    RESET: 'RESET',
};

const reviewFormReducer = (state, action) => {
    switch (action.type) {
        case FORM_ACTIONS.SET_FIELD:
            return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: null } };
        case FORM_ACTIONS.SET_ERRORS:
            return { ...state, errors: action.errors };
        case FORM_ACTIONS.RESET:
            return { rating: 0, reviewText: '', errors: {} };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const ReviewForm = ({ providerId, onReviewSubmit }) => {
    const [formState, dispatch] = useReducer(reviewFormReducer, { rating: 0, reviewText: '', errors: {} });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalInfo, setModalInfo] = useState(null);

    const validateForm = useCallback(() => {
        const errors = {};
        if (formState.rating === 0) errors.rating = "Please select a star rating.";
        if (formState.reviewText.trim() === '') errors.reviewText = "Please write a few words about your experience.";
        return errors;
    }, [formState.rating, formState.reviewText]);

    const handleSendReview = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            dispatch({ type: FORM_ACTIONS.SET_ERRORS, errors });
            return;
        }

        setIsSubmitting(true);
        const email = localStorage.getItem('email'); 
       
        try {
            
            await API.put(`/review/${providerId}`, {
                    email,
                    ratting: formState.rating,
                    review: formState.reviewText
                }
             )
             .then((res)=>{
               console.log(res.data)
             })
             .catch((err)=>{
              throw new Error(`Submission failed: ${err.response.status}`)
             })
            setModalInfo({ title: "Success!", message: "Your review has been submitted successfully." });
            dispatch({ type: FORM_ACTIONS.RESET });
            onReviewSubmit();
        } 
        catch (error) {
            console.error('Error sending review:', error);
            setModalInfo({ title: "Submission Failed", message: "We couldn't submit your review. Please try again." });
        } 
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {modalInfo && <Modal {...modalInfo} onClose={() => setModalInfo(null)} />}
            <div className="lg:col-span-7 p-8 flex flex-col">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Share Your Experience</h2>
                <p className="text-slate-600 mb-6">Your feedback helps others make better decisions.</p>

                <form onSubmit={handleSendReview} className="flex-grow flex flex-col" noValidate>
                    <div className="space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                            <StarRatingInput
                                rating={formState.rating}
                                onRatingChange={(value) => dispatch({ type: FORM_ACTIONS.SET_FIELD, field: 'rating', value })}
                                error={formState.errors.rating}
                            />
                        </div>
                        <div>
                            <label htmlFor="reviewText" className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                            <textarea
                                id="reviewText"
                                placeholder="Tell us about your experience..."
                                value={formState.reviewText}
                                onChange={(e) => dispatch({ type: FORM_ACTIONS.SET_FIELD, field: 'reviewText', value: e.target.value })}
                                rows="5"
                                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-150 ${formState.errors.reviewText ? 'border-red-500 ring-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                aria-invalid={!!formState.errors.reviewText}
                            />
                            {formState.errors.reviewText && <p className="text-red-500 text-sm mt-1">{formState.errors.reviewText}</p>}
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-6 flex justify-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export {ReviewCard , ReviewForm , reviewFormReducer , PhoneIcon , ProviderDetails , useServiceProvider , ErrorDisplay , ImageModal , InfoIcon , LoadingSpinner}