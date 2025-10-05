
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../hooks/api'

const AllService = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); //  for navigation::>>>>

    const fetchData = async () => {
        console.log('function is calling')
        setLoading(true);
        try {
            const url = !search || search.trim() === ''
                ? `/allservice`
                : `/allservice/${search}`;

            let values;

            API.get(url)
                .then((res) => {
                    values = res.data;
                    setData(values)
                })
                .catch((err) => {
                    console.log("facing Error in searching for allservices", err);
                    throw new Error(`HTTP error! status: ${err}`);
                })
        }
        catch (error) {
            console.error("Failed to fetch data:", error);
            setData([]);
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => { // fetching data when the search bar changess::>>>

        fetchData();
    }, [search]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Service Providers</h1>

                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Name, Service, or Address..."
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3 w-16 text-center">No.</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Experience</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3">Address</th>
                                    <th className="px-6 py-3 text-center">Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center p-8 text-gray-500 dark:text-gray-400"
                                        >
                                            <div className="animate-pulse">Loading data...</div>
                                        </td>
                                    </tr>
                                ) : data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4">{item.service}</td>
                                            <td className="px-6 py-4">{item.experience}</td>
                                            <td className="px-6 py-4">{item.contact}</td>
                                            <td className="px-6 py-4">{item.address}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => navigate(`/review/${item._id}`)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                                                >
                                                    Add Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center p-8 text-gray-500 dark:text-gray-400 font-semibold"
                                        >
                                            No Services Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AllService;   //:::>>>



