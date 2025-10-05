
import React, { useEffect, useState, useCallback } from "react";
import {TrashIcon , Spinner , AlertTriangleIcon} from '../../components/admin/manageService'
import { useDebounce } from "../../hooks/useDebounce";
import API from '../../hooks/api'


const ManageService = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track auth status

    const debouncedSearchTerm = useDebounce(search, 500);


    // if admin has token or not:::>>
    useEffect(() => {
        const token = localStorage.getItem('loginToken');
        if (token) {
            setIsAuthenticated(true);
        } 
        else {
            setError("Admin token not found. Please log in to manage service providers.");
            setIsLoading(false); // Stop loading as we won't fetch data 
        }
    }, []);



    // Memoizing the function :: Prevent from recreation of function with every Rendering ::
    const fetchData = useCallback(async () => {
        if (!isAuthenticated) return; // Don't fetch if not authenticated

        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('loginToken');
            if (!token) throw new Error("Authentication error.");

            const url = debouncedSearchTerm.trim()
                ? `/allservice/${debouncedSearchTerm.trim()}`
                : `/allservice`;

            let values;
            await API.get(url)
            .then((res)=>{
               values = res.data;
            })
            .catch((err)=>{
               throw new Error(`Failed to fetch service providers ${err.message || err}`);
            })
            setData(values);
        } 
        catch (err) {
            setError(err.message || err);
            console.error(err);
        } 
        finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, isAuthenticated]); // Memoizing the function :::>>>>



    // This effect triggers the data fetch when the component knows the user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchData(); 
        }
    }, [fetchData, isAuthenticated]); // if it get authenticated or there is recreation of function :::>>>


    // Handle the deletion of a service provider
    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to remove this service provider?')) {
            setDeletingId(id);
            try {
                const token = localStorage.getItem('loginToken');
                if (!token) throw new Error("Authentication token not found. Please log in again.");
                let result;
                await API.delete(`/deleteservice/${id}`)
                .then((res)=>{
                 result = res.data;
                })
                .catch((err)=>{
                    const errorMessage = err.message || `Server error with ${err}`;
                    throw new Error(errorMessage);
                })

                
                if (result.acknowledged===true) {
                    setData(prevData => prevData.filter(item => item._id !== id));
                } 
                else {
                    throw new Error(result.error || 'Failed to delete the provider from the server.');
                }
            }
            catch (err) {
                alert(`Error: ${err.message}`);
                console.error(err);
            } 
            finally {
                setDeletingId(null); // Hide spinner
            }
        }
    };


    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Service Providers</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Search, view, and remove existing service providers.</p>
                </div>

                {!isAuthenticated ? (
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-md flex items-center" role="alert">
                        <AlertTriangleIcon />
                        <div>
                            <p className="font-bold">Access Denied</p>
                            <p>{error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Search Input */}
                        <div className="mb-6">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by Name, Service, or Address..."
                                className="w-full max-w-lg px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                        </div>

                        {/* Table Container */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 w-16 text-center">No.</th>
                                            <th scope="col" className="px-6 py-3">Name</th>
                                            <th scope="col" className="px-6 py-3">Service</th>
                                            <th scope="col" className="px-6 py-3">Experience</th>
                                            <th scope="col" className="px-6 py-3">Contact</th>
                                            <th scope="col" className="px-6 py-3">Address</th>
                                            <th scope="col" className="px-6 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center p-8 text-gray-500 dark:text-gray-400">
                                                    <div className="animate-pulse">Loading providers...</div>
                                                </td>
                                            </tr>
                                        ) : error && isAuthenticated ? ( // Only show fetch error if authenticated
                                            <tr>
                                                <td colSpan="7" className="text-center p-8 text-red-500 font-semibold">{error}</td>
                                            </tr>
                                        ) : data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={item._id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                                                    <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">{index + 1}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.name}</td>
                                                    <td className="px-6 py-4">{item.service}</td>
                                                    <td className="px-6 py-4">{item.experience}</td>
                                                    <td className="px-6 py-4">{item.contact}</td>
                                                    <td className="px-6 py-4">{item.address}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteUser(item._id)}
                                                            disabled={deletingId === item._id}
                                                            className="flex items-center justify-center w-24 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-wait"
                                                        >
                                                            {deletingId === item._id ? <Spinner /> : <><TrashIcon /> <span className="ml-1.5">Remove</span></>}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center p-8 text-gray-500 dark:text-gray-400 font-semibold">
                                                    No Service Providers Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageService;






