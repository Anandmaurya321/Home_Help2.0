

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField, LocationPicker } from '../../components/service_pro/addServicePro';
import API from '../../hooks/api';
import backgroundImageUrl from '../../assets/registrationPage.png'



// --- Main Component for the Page ---
const AddServiceProvider = () => {
    const [name, setName] = useState("");
    const [experience, setExperience] = useState("");
    const [contact, setContact] = useState("");
    const [service, setService] = useState("");
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState({ latitude: "", longitude: "" });
    const [image, setImage] = useState(null);
    // **NEW**: State to handle the loading process
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // This useEffect hook runs once when the component mounts to get the real-time location.
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Automatically setting initial location:", { latitude, longitude });
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting initial location:", error);
                    alert("Could not automatically get your location. Please click the button to set it manually.");
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []); // The empty array [] ensures this effect runs only once-->>> during render only::>>>>


    const handleLocationChange = (loc) => {
        setLocation(loc);
    };

    // **MODIFIED**: This function now handles the loading state ::::>>>>>
    const collectData = async (e) => {
        e.preventDefault();

        if (!location.latitude || !location.longitude) {
            alert("Location is required. Please allow location access or click the button to set it.");
            return;
        }

        if (!image) {
            alert("Please select a profile photo for the service provider.");
            return;
        }

        if (!name || !service || !experience || !contact || !address) {
            alert("Fill all the required data !");
        }

        // Everything is available here ::>>>
        // **NEW**: Set loading to true at the start of submission
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name.toUpperCase());
        formData.append('service', service.toUpperCase());
        formData.append('experience', experience.toUpperCase());
        formData.append('contact', contact.toUpperCase());
        formData.append('address', address.toUpperCase());
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
        formData.append('image', image);

        console.log("Submitting form data...");

        try {
            let result;
            await API.post("/addservicepro", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((res) => {
                console.log(res.data);
                result = res.data;
            })
    .catch((err) => {
        console.log("Api post error in addSevicepro", err);
    })
const data = result.data._id;
alert("Service Provider added successfully!");
console.log("_id ", data)
navigate('/additional_data', { state: { data } });
        } 
        catch (error) {
    console.error("Failed to submit form:", error);
    alert("Failed to submit form. Please check the console for details.");
} finally {
    setIsLoading(false);
}
    };


return (
    <div
        className="min-h-screen flex items-center justify-center p-4 bg-gray-200 bg-cover bg-center"
        style={{ backgroundImage: { backgroundImageUrl } }}
    >
        <div className="w-full max-w-lg p-8 space-y-6 bg-white bg-opacity-90 rounded-2xl shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-extrabold text-center text-gray-800">Register a New Provider</h2>
            <p className="text-center text-gray-600">Fill in the details to add a service provider to our network.</p>
            <form onSubmit={collectData} className="space-y-4">
                <InputField label="Full Name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Doe" />
                <InputField label="Service Offered" id="service" value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g., Plumbing, Electrician" />
                <InputField label="Years of Experience" id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 5 Years" />
                <InputField label="Contact Number" id="contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g., (123) 456-7890" />
                <InputField label="Address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 123 Main St, Anytown" />

                <InputField
                    label="Provider Photo"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700">Location Coordinates</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : "Fetching location..."}
                        readOnly
                        className="w-full px-4 py-2 mt-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg"
                    />
                </div>

                <LocationPicker onLocationChange={handleLocationChange} />

                <div>
                    {/* **MODIFIED**: Button is now disabled and shows a loading message during submission */}
                    <button
                        type="submit"
                        className="w-full px-4 py-3 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-transform duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default AddServiceProvider;


