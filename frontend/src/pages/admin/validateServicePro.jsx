
import React, { useEffect, useState } from "react";
import {CheckIcon , TrashIcon , Spinner , ImageModal} from '../../components/admin/validateServicePro'
import API from '../../hooks/api'

const ValidateService = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionState, setActionState] = useState({ id: null, loading: false });
    const [selectedImage, setSelectedImage] = useState(null);
    

    
    const getData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('loginToken');
            if (!token) {
                setError("Admin token not found. Please log in again.");
                setIsLoading(false);
                return;
            }
            let data;
                await API.get('/search_service_req')
                .then((res)=>{
                 data = res.data
                })
                .catch((err)=>{
                throw new Error(`Failed to fetch requests. Please check your network or login status : error: ${err.response?.status || err.message || "--"}`);
                })
            setRequests(data);
        } 
        catch (err) {
            console.error('error yaha hai :' , err);
            setError(err.message || "Facing problem in getting the data");
            
        } 
        finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getData();
    }, []); 

    // --- Internal function to delete a request from the server and UI ---
    const deleteRequestFromServer = async (id) => {
        let data ;
            await API.delete(`/deleteservicereq/${id}`)
            .then((res)=>{
            data = res.data
            })
            .catch((err)=>{
            setError(err.message || "Facing Problem in deleting the data");
            console.log(err);
            })
        
        if (!data.acknowledged) throw new Error("Failed to delete request from server.");  
        setRequests(prev => prev.filter(req => req._id !== id));
    };


    // Function to handle the denying the request::>>>>>
    const handleDenyRequest = async (id) => {
        if (window.confirm("Are you sure you want to deny this request? This action cannot be undone.")) {
            setActionState({ id, loading: true });
            try {
                await deleteRequestFromServer(id);
            } 
            catch (err) {
                alert("Something went wrong while denying the request!");
                console.error(err);
            } 
            finally {
                setActionState({ id: null, loading: false });
            }
        }
    };

    // Function to handle approving a request
    const handleApproveRequest = async (item) => {
        if (window.confirm("Are you sure you want to approve and add this service provider?")) {
            setActionState({ id: item._id, loading: true });
            const { _id, ...providerData } = item; // Excluding the temporary request id 

            try {
                // add the service provider to main database
                await API.post(`/validateservicepro`, {providerData})
                .then((res)=>{
                console.log(res.data);
                if (!res.data._id) throw new Error("Failed to add service provider.");
                })
                .catch((err)=>{
                console.log("There is error :" , err);
                setError(err.message || "Something went wrong");
                })
               
               await deleteRequestFromServer(item._id);

                alert('Service provider has been approved and added!');
            } 
            catch (err) {
                alert("Something went wrong while approving the request!");
                console.error(err.message || "Something went wrong while approving the request!");
            } 
            finally {
                setActionState({ id: null, loading: false });
            }
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            {/* **NEW**: Render the image modal */}
            <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
            
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Validation Requests</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Review and approve or deny new service provider requests.</p>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading Requests...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                ) : requests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {requests.map((item) => (
                            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                {/* Card Body */}
                                <div className="p-5 flex-grow flex items-start gap-5">
                                    {/* MODIFIED: Image is now clickable */}
                                    <img 
                                        src={item.imageurl || 'https://placehold.co/128x128/E2E8F0/4A5568?text=Photo'} 
                                        alt={`Photo of ${item.name}`}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md flex-shrink-0 mt-1 cursor-pointer hover:opacity-80 transition-opacity"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/E2E8F0/4A5568?text=Error'; }}
                                        onClick={() => setSelectedImage(item.imageurl)}
                                    />
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h2>
                                        <p className="text-blue-500 font-semibold text-sm mb-3">{item.service}</p>
                                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2">
                                            <p><strong>Experience:</strong> {item.experience}</p>
                                            <p><strong>Contact:</strong> {item.contact}</p>
                                            <p><strong>Address:</strong> {item.address}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Card Footer with Actions */}
                                <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700/50 mt-auto">
                                    <button 
                                        onClick={() => handleDenyRequest(item._id)}
                                        disabled={actionState.loading}
                                        className="flex items-center justify-center p-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 font-semibold transition-colors disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {actionState.loading && actionState.id === item._id ? <Spinner /> : <><TrashIcon /> Deny</>}
                                    </button>
                                    <button 
                                        onClick={() => handleApproveRequest(item)}
                                        disabled={actionState.loading}
                                        className="flex items-center justify-center p-3 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 font-semibold transition-colors border-l border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {actionState.loading && actionState.id === item._id ? <Spinner /> : <><CheckIcon /> Approve</>}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">All Clear!</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">There are no pending service requests to validate.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValidateService;


