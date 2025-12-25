
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReviewForm ,  ProviderDetails , useServiceProvider , ErrorDisplay , ImageModal , LoadingSpinner} from '../../components/service_pro/reviewSection'

// --- MAIN PAGE COMPONENT (Unchanged logic, passed new props) ---
const GiveReview = () => {
    const { id } = useParams();
    const { provider, isLoading, error, refetch } = useServiceProvider(id);
    const [modalImageUrl, setModalImageUrl] = useState(null);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error || !provider) {
        return <ErrorDisplay message={error || "We couldn't find the provider you're looking for. Please check the URL or try again later."} />;
    }

    return (
        <main className="bg-slate-50 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />
            
            <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-12">
                <ProviderDetails 
                    provider={provider} 
                    onImageClick={(url) => setModalImageUrl(url)} 
                    providerId={id}
                />
                <ReviewForm 
                    providerId={id} 
                    onReviewSubmit={refetch}
                />
            </div> 
        </main>
    );
};

export default GiveReview;

