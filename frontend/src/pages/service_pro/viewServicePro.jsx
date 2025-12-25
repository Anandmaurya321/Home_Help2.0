
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarRating } from '../../components/service_pro/viewServicePro';
import API from '../../hooks/api'

const ViewServicePro = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    
    const [selectedService, setSelectedService] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMapReady, setIsMapReady] = useState(false);

    const mapRef = useRef(null);
    const markersLayerRef = useRef(null);

    // Data fetching logic remains the same...
    const fetchServices = async () => {
        setIsLoading(true);
        setError('');
        try {  
            let data=[];
            // wait untill you get your response:::>>>> otherwise it pass [] to next cause unexpected behaviour
            await API.get('/allservice')
            .then((res)=>{
             data = res.data
            })
            .catch((err)=>{
            throw new Error(`Network response was not ok: ${err.response.status}`);
            })
            const uniqueServices = [...new Set(data.map(item => item.service).filter(Boolean))];
            setServices(uniqueServices);
        } 
        catch (err) {
            setError("Failed to fetch services. Please ensure the backend is running.");
            console.log("Failed to fetch services", err);
        } 
        finally {
            setIsLoading(false);
        }
    };

    const fetchProviders = async () => {
        if (!selectedService) {
            setProviders([]);
            return;
        };
        setIsLoading(true);
        setError('');
        try {
            let data 
            // wait untill you get your response
            await API.get(`/viewservicepro/${selectedService}`)
            .then((res)=>{
             data = res.data
            }) 
            .catch((err)=>{
             throw new Error(`Network response was not ok: ${err.response.status}`);
            })

            setProviders(data);

            if (data.length === 0) {
                 setError(`No providers found for ${selectedService}.`);
            }

        } 
        catch (err) {
            setError(`Failed to fetch providers for ${selectedService}.`);
            console.error("Failed to fetch providers", err);
        } 
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
    fetchServices();
    }, []);

    
    useEffect(() => {
        const LEAFLET_CSS_ID = 'leaflet-css';
        const LEAFLET_SCRIPT_ID = 'leaflet-script';
        const initMap = () => {
            const mapContainer = document.getElementById('map');
            if (!mapContainer || mapContainer._leaflet_id) return;
            delete window.L.Icon.Default.prototype._getIconUrl;
            window.L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            mapRef.current = window.L.map('map').setView([20.5937, 78.9629], 5);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
            markersLayerRef.current = window.L.layerGroup().addTo(mapRef.current);
            setIsMapReady(true);
        };
        if (window.L) {
            initMap();
        } else if (!document.getElementById(LEAFLET_SCRIPT_ID)) {
            if (!document.getElementById(LEAFLET_CSS_ID)) {
                const cssLink = document.createElement('link');
                cssLink.id = LEAFLET_CSS_ID;
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(cssLink);
            }
            const script = document.createElement('script');
            script.id = LEAFLET_SCRIPT_ID;
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = initMap;
            document.body.appendChild(script);
        }
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // --- UPDATED: Marker creation with image in tooltip ---
    useEffect(() => {
        if (!isMapReady || !markersLayerRef.current) return;
        markersLayerRef.current.clearLayers();
        if (providers.length === 0) return;

        const bounds = [];
        providers.forEach((item) => {
            const { _id, name, location, experience, contact, address, review, imageurl } = item;
            
            if (location?.latitude && location?.longitude && _id) {
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    const marker = window.L.marker([lat, lng]);

                    // **MODIFIED**: Added image to the tooltip content
                    const tooltipContent = `
                        <div class="font-sans p-2 flex items-start gap-3" style="min-width: 280px;">
                            <img 
                                src="${imageurl || 'https://placehold.co/80x80/E2E8F0/4A5568?text=No+Image'}" 
                                alt="${name}" 
                                class="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                onerror="this.onerror=null;this.src='https://placehold.co/80x80/E2E8F0/4A5568?text=Error';"
                            />
                            <div class="flex-1">
                                <h3 class="font-bold text-base mb-1 truncate">${name}</h3>
                                ${StarRating({ rating: review?.ratting, count: review?.count })}
                                <p class="text-sm text-gray-700 mt-1"><strong>Experience:</strong> ${experience || 'N/A'}</p>
                                <p class="text-sm text-gray-700"><strong>Contact:</strong> ${contact || 'N/A'}</p>
                                <p class="text-xs text-gray-500 truncate"><strong>Address:</strong> ${address || 'N/A'}</p>
                            </div>
                        </div>
                    `;
                    marker.bindTooltip(tooltipContent, { sticky: true });
                    
                    marker.on('click', () => {
                        navigate(`/review/${_id}`);
                    });
                    
                    markersLayerRef.current.addLayer(marker);
                    bounds.push([lat, lng]);
                }
            }
        });

        if (bounds.length > 0) {
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [providers, isMapReady, navigate]);

    return (
        <div className="relative h-screen w-full font-sans">
            <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-xl font-bold text-gray-800 mb-3">Find a Service Provider</h1>
                <div className="space-y-3">
                    <select
                        onChange={(e) => setSelectedService(e.target.value)}
                        value={selectedService}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select a Service --</option>
                        {services.map((val, idx) => (
                            <option key={idx} value={val}>{val}</option>
                        ))}
                    </select>
                    <button 
                        onClick={fetchProviders} 
                        disabled={isLoading || !selectedService}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                 {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>
            <div id="map" className="h-full w-full bg-gray-200">
                {!isMapReady && <div className="flex items-center justify-center h-full"><p className="text-gray-500">Loading Map...</p></div>}
            </div>
        </div>
    );
};

export default ViewServicePro;




