


// Reusable Input Field Component
const InputField = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700">{label}</label>
        <input 
            id={id}
            name={id}
            required
            className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
            {...props}
        />
    </div>
);



// This component fetches the user's real-time location.
const LocationPicker = ({ onLocationChange }) => {
    const pickLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLocation = { latitude, longitude };
                    onLocationChange(newLocation);
                    // Using a more modern notification approach could be better, but alert is simple.
                    // Consider replacing alert with a small, non-blocking notification component.
                    alert(`Location Updated!\nLat: ${latitude}, Lon: ${longitude}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location. Please ensure you have granted location permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <button
            type="button"
            onClick={pickLocation}
            className="w-full px-4 py-2 mt-2 font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
        >
            Get Current Location
        </button>
    );
};



export {InputField , LocationPicker}



