
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/authRedux';
import { BrandIcon, ChevronDownIcon, AdminIcon , linkClasses , mobileLinkClasses} from '../../components/general/nav';


const checkIsAdmin = () => localStorage.getItem('isAdmin') === 'true';
const checkIsLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';


const Nav = () => {
    // --- State Management ---
    const dispatch = useDispatch();
    const [isAdmin, setIsAdmin] = useState(checkIsAdmin());
    const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn());
    const [name, setName] = useState('');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

    const navigate = useNavigate();
    const profileMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const adminMenuRef = useRef(null);

    // --- Effect to update state when localStorage changes ---

    const handleStorageChange = () => {
        const loggedInStatus = checkIsLoggedIn();
        setIsLoggedIn(loggedInStatus);
        setIsAdmin(checkIsAdmin()); // This will re-evaluate admin status
        if (loggedInStatus) {
            setName(localStorage.getItem('name') || 'User');
        } else {
            setName('');
        }
    };

    const handleClickOutside = (event) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
            setIsProfileMenuOpen(false);
        }
        if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
            setIsAdminMenuOpen(false);
        }
        // Check if the click is outside the mobile menu button and the menu itself
        const mobileMenuButton = document.querySelector('button[aria-controls="mobile-menu"]');
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            setIsMobileMenuOpen(false);
        }
    };

   
    useEffect(() => {
        handleStorageChange();
        window.addEventListener('storageChange', handleStorageChange);
        return () => window.removeEventListener('storageChange', handleStorageChange);
    }, []);


    // --- Effect to handle clicks outside of menus to close them ---
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // handling full logout::
    const handleLogout = () => {
        localStorage.clear();  // clear everything for full logout::>>
        window.dispatchEvent(new Event('storageChange')); 
        dispatch(logoutUser());
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        window.location.reload();
    };

    // --- Admin Logout Handler (Leaves Admin Mode, stays logged in) ---
    const handleAdminLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event('storageChange'));
        setIsAdminMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/allservice'); 
    };

   
    // --- Render Functions for Links ---
    const renderAdminLinks = (isMobile = false) => (
        <>
            <NavLink to="/validateservice" className={isMobile ? mobileLinkClasses : linkClasses}>Validate Service</NavLink>
            <NavLink to="/manageservice" className={isMobile ? mobileLinkClasses : linkClasses}>Manage Service</NavLink>
        </>
    );

    const renderUserLinks = (isMobile = false) => (
        <>
            <NavLink to="/allservice" className={isMobile ? mobileLinkClasses : linkClasses} end>All Services</NavLink>
            <NavLink to="/viewservicepro" className={isMobile ? mobileLinkClasses : linkClasses}>View Providers</NavLink>
            {isLoggedIn && (
                <>
                    {/* <NavLink to="/chat" className={isMobile ? mobileLinkClasses : linkClasses}>Chat Service</NavLink> */}
                    <NavLink to="/chat" className={isMobile ? mobileLinkClasses : linkClasses}>Messages</NavLink>
                    <NavLink to="/addservicepro" className={isMobile ? mobileLinkClasses : linkClasses}>Add Provider</NavLink>
                </>
            )}
            <NavLink to="/adminpanel" className={isMobile ? mobileLinkClasses : linkClasses}>Admin Panel</NavLink>
        </>
    );

    return (
        <nav className={`shadow-lg sticky top-0 z-50 ${isAdmin ? 'bg-red-900' : 'bg-gray-800'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* --- Brand/Logo --- */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to={isAdmin ? "#" : "/"} className={`flex items-center ${isAdmin ? 'cursor-default' : ''}`}>
                            <BrandIcon />
                            <span className="text-white font-bold ml-2 text-xl">ServiceApp {isAdmin && <span className="text-amber-400 font-black">[ADMIN]</span>}</span>
                        </Link>
                    </div>

                    {/* --- Desktop Navigation Links --- */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {isAdmin ? renderAdminLinks() : renderUserLinks()}
                        </div>
                    </div>

                    {/* --- Right side: Profile/Login --- */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {isAdmin ? (
                                <div className="relative" ref={adminMenuRef}>
                                    <button onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)} className="flex items-center text-sm font-medium text-amber-400 p-2 border border-amber-500 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-900 focus:ring-white">
                                        <AdminIcon />
                                        <span className="ml-2 font-bold">Admin Controls</span>
                                        <ChevronDownIcon />
                                    </button>
                                    {isAdminMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                            <button onClick={handleAdminLogout} className="w-full text-left block px-4 py-2 text-sm text-red-700 font-semibold hover:bg-red-50">
                                                Leave Admin Mode
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : isLoggedIn ? (
                                <div className="ml-3 relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{name.charAt(0).toUpperCase()}</div>
                                        <span className="text-white ml-2 text-sm font-medium hidden lg:block">Welcome, {name}</span>
                                        <ChevronDownIcon />
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // --- MODIFICATION: Added Provider Login and updated labels ---
                                <div className="flex items-center space-x-2">
                                    <Link to="/servicepro_login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Provider Login</Link>
                                    <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">User Sign In</Link>
                                    <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Mobile Menu Button --- */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen} className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu" ref={mobileMenuRef}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAdmin ? renderAdminLinks(true) : renderUserLinks(true)}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        {isAdmin ? (
                            <div className="px-5">
                                <div className="flex items-center">
                                    <AdminIcon />
                                    <span className="ml-3 text-base font-bold text-amber-400">Admin Controls</span>
                                </div>
                                <button onClick={handleAdminLogout} className="mt-3 w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-200 bg-red-800 hover:bg-red-700">
                                    Leave Admin Mode
                                </button>
                            </div>
                        ) : isLoggedIn ? (
                            <>
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0"><div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{name.charAt(0).toUpperCase()}</div></div>
                                    <div className="ml-3"><div className="text-base font-medium leading-none text-white">{name}</div></div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Logout</button>
                                </div>
                            </>
                        ) : (
                            // --- MODIFICATION: Updated labels for mobile view ---
                            <div className="px-2 space-y-1">
                                <Link to="/servicepro_login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Provider Login</Link>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">User Sign In</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Nav;





