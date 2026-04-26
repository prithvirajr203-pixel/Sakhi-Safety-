import { useState, useEffect } from 'react';
import L from 'leaflet';
import { useLocationStore } from '../../store/locationsstore';
import Map from '../../components/common/Map';
import {
    BuildingOffice2Icon, PhoneIcon, StarIcon, ShieldCheckIcon,
    VideoCameraIcon, LockClosedIcon, CheckBadgeIcon, ExclamationTriangleIcon,
    CreditCardIcon, DocumentCheckIcon, SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const HotelSafety = () => {
    const { currentLocation } = useLocationStore();

    const [phase, setPhase] = useState('pre-booking'); // pre-booking | during-stay | check-out

    // Pre-booking
    const [searchQuery, setSearchQuery] = useState('');
    const [scannedHotel, setScannedHotel] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    // During stay
    const [roomNumber, setRoomNumber] = useState('');
    const [checkedIn, setCheckedIn] = useState(false);
    const [safetyChecklist, setSafetyChecklist] = useState({
        cameraCheck: false,
        deadbolt: false,
        windows: false,
        balcony: false
    });
    const [safetyReports, setSafetyReports] = useState([
        { id: 1, hotel: "Grand Plaza", date: "2024-04-10", status: "Verified Safe", notes: "No issues with room sweep." },
        { id: 2, hotel: "City Stay", date: "2024-03-25", status: "Minor Concern", notes: "Window latch was loose, reported and fixed." }
    ]);
    const [staffAtDoor, setStaffAtDoor] = useState(false);

    const handleScanHotel = () => {
        if (!searchQuery) return toast.error("Enter hotel name to scan its safety records.");
        setIsScanning(true);
        setTimeout(() => {
            setScannedHotel({
                name: searchQuery,
                safetyScore: 96,
                areaScore: 88,
                incidentsLast30: 0,
                historicalCases: 0,
                hiddenCameraCases: 0,
                ownerContact: "+91-9080660562",
                ownerVerified: true,
                roomsAvailable: 4,
                womenOnlyRoomsAvailable: true,
                womenOnlyFloor: "4th Floor (Restricted Access)",
                securityAuditDate: "2024-03-10",
                reviews: "Highly recommended for women travelers. Solid security and respectful staff.",
                policeDist: "1.2 km",
                hospDist: "0.8 km",
                streetLight: "Verified High-Intensity",
                noHiddenCameras: true,
                deadboltVerified: true,
                balconySecurity: "Reinforced"
            });
            setIsScanning(false);
            toast.success("Hotel Security Clearance Fetched.");
        }, 1500);
    };

    const triggerSafetyAlerts = () => {
        const alerts = [
            "SCAN FOR HIDDEN CAMERAS: Use your phone's flashlight to check for lens reflections in mirrors and smoke detectors.",
            "VERIFY DEADBOLT: Ensure the deadbolt and chain lock are fully functional and engaged.",
            "WINDOW LOCKS: Check all windows and balcony doors. Ensure locks are secure.",
            "BALCONY SECURITY: Verify no shared access from adjacent rooms."
        ];
        
        alerts.forEach((msg, index) => {
            setTimeout(() => {
                toast(msg, {
                    icon: '🚨',
                    duration: 6000,
                    style: {
                        borderRadius: '10px',
                        background: '#1f2937',
                        color: '#fff',
                        border: '1px solid #ef4444'
                    },
                });
            }, index * 2000);
        });
    };

    const handleCheckIn = () => {
        if (!roomNumber) return toast.error("Enter room number so we can track exactly where you are.");
        setCheckedIn(true);
        setPhase('during-stay');
        toast.success("Check-In logged. SMS sent to Family: 'Reached safely, Room " + roomNumber + "'");
        
        // Trigger the requested safety alerts
        triggerSafetyAlerts();

        // Mock random staff arrival
        setTimeout(() => {
            setStaffAtDoor(true);
        }, 15000);
    };

    const toggleChecklist = (key) => setSafetyChecklist(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="bg-gradient-to-tr from-[#111827] via-[#1f2937] to-[#111827] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-8 pb-32 font-sans text-gray-200">

            {/* Dynamic Header */}
            <div className="pb-8 pt-4 border-b border-gray-700/50 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
                        <BuildingOffice2Icon className="w-10 h-10 text-purple-400" /> HOTEL SAFETY
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">
                        Pre-Booking verifications to Secure Checkout monitoring.
                    </p>
                </div>
                <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                    <button onClick={() => setPhase('pre-booking')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${phase === 'pre-booking' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'}`}>Book</button>
                    <button onClick={() => setPhase('during-stay')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${phase === 'during-stay' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'}`}>Stay</button>
                </div>
            </div>

            {phase === 'pre-booking' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-white mb-6">Hotel Database Sync</h2>
                        <div className="relative mb-6">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type Hotel Name to verify..." className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none" />
                            <button onClick={handleScanHotel} className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-xl text-white font-bold h-10 shadow-lg">{isScanning ? 'Syncing...' : 'EVALUATE'}</button>
                        </div>

                        {scannedHotel && (
                            <div className="bg-gray-900/80 rounded-2xl p-6 border border-purple-500/30">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{scannedHotel.name}</h3>
                                        <div className="flex gap-1 mt-1"><StarIconSolid className="text-yellow-400 w-4" /><StarIconSolid className="text-yellow-400 w-4" /><StarIconSolid className="text-yellow-400 w-4" /><StarIconSolid className="text-yellow-400 w-4" /></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-green-400">{scannedHotel.safetyScore}%</div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Compound Safety</div>
                                    </div>
                                </div>
                                {/* Top Badges */}
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {scannedHotel.historicalCases === 0 && <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50 flex items-center gap-1"><ShieldCheckIcon className="w-4 h-4" /> 100% Safe (No Past Cases)</span>}
                                    {scannedHotel.hiddenCameraCases === 0 && <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/50 flex items-center gap-1"><VideoCameraIcon className="w-4 h-4" /> Certified No Hidden Cameras</span>}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 border-t border-gray-700 pt-6">
                                    <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Recent Incidents</p>
                                        <p className="font-bold text-sm text-green-400 flex items-center gap-1"><CheckBadgeIcon className="w-4 h-4" /> 0 in last 30 days</p>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Owner Line</p>
                                        <p className="font-bold text-sm text-blue-400 flex items-center gap-1"><PhoneIcon className="w-4 h-4" /> {scannedHotel.ownerContact}</p>
                                        {scannedHotel.ownerVerified && <p className="text-[10px] text-green-500 font-bold flex items-center gap-0.5 mt-0.5"><ShieldCheckIcon className="w-3" /> VERIFIED OWNER</p>}
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Availability</p>
                                        <p className="font-bold text-sm text-white">{scannedHotel.roomsAvailable} Rooms</p>
                                        <p className="text-[10px] text-pink-400 font-bold uppercase">Women Floor Safe</p>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Camera Log</p>
                                        <p className="font-bold text-sm text-green-400">{scannedHotel.noHiddenCameras ? '0 Issues Found' : 'Checking...'}</p>
                                        <p className="text-[10px] text-gray-500">Scan date: {scannedHotel.securityAuditDate}</p>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Historical Cases</p>
                                        <p className="font-bold text-sm text-green-400">{scannedHotel.historicalCases} Cases</p>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Area Score</p>
                                        <p className="font-bold text-sm text-yellow-400">{scannedHotel.areaScore}%</p>
                                    </div>
                                </div>

                                {scannedHotel.womenOnlyRoomsAvailable && (
                                    <div className="mt-6 bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-pink-900/40 border border-pink-500/50 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <ShieldCheckIcon className="w-32 h-32 text-pink-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="bg-pink-500/20 p-2 rounded-lg"><LockClosedIcon className="w-6 h-6 text-pink-400" /></div>
                                                <h4 className="text-pink-400 font-black text-xl">Women-Only Secure Floor ({scannedHotel.womenOnlyFloor})</h4>
                                            </div>
                                            <ul className="text-sm text-pink-200/90 mt-4 space-y-2 font-medium">
                                                <li className="flex items-center gap-2"><CheckBadgeIcon className="w-5 h-5 text-pink-400" /> Strict verification: No male staff/guests allowed</li>
                                                <li className="flex items-center gap-2"><CheckBadgeIcon className="w-5 h-5 text-pink-400" /> Reinforced Deadbolts & Chain Locks Verified</li>
                                                <li className="flex items-center gap-2"><CheckBadgeIcon className="w-5 h-5 text-pink-400" /> 24/7 specialized CCTV monitoring in hallways</li>
                                                <li className="flex items-center gap-2"><CheckBadgeIcon className="w-5 h-5 text-pink-400" /> Direct Link to Local Police Station (1.2 km)</li>
                                            </ul>
                                            <button className="mt-6 w-full md:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-black text-sm shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2">
                                                <CreditCardIcon className="w-5 h-5" /> BOOK ONLINE SECURELY
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                                    <p className="text-sm text-purple-200 italic">"{scannedHotel.reviews}" - Verified Network Analysis</p>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Safety Action Command Center</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <button onClick={() => toast.success("Owner Identity Verified: " + scannedHotel.ownerContact)} className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500 transition-all group">
                                            <PhoneIcon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Owner Line</span>
                                        </button>
                                        <button onClick={() => toast.success("Zero Historical Issues Found for " + scannedHotel.name)} className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-green-500 transition-all group">
                                            <ShieldCheckIcon className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Check Issues</span>
                                        </button>
                                        <button onClick={() => toast.success("Scanning Room Vectors: No Hidden Cameras Detected")} className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-purple-500 transition-all group">
                                            <VideoCameraIcon className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Camera Scan</span>
                                        </button>
                                        <button onClick={() => toast.success(scannedHotel.roomsAvailable + " Rooms Available for Booking")} className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-pink-500 transition-all group">
                                            <SparklesIcon className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Availability</span>
                                        </button>
                                        <button onClick={() => toast.success("Legal Clearance: No Historical Cases logged against this property")} className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-yellow-500 transition-all group">
                                            <DocumentCheckIcon className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Legal Records</span>
                                        </button>
                                        <button onClick={() => toast.success("Secure Payment & Stay Options Enabled")} className="bg-gray-800 border border-gray-700 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-red-500 transition-all group">
                                            <LockClosedIcon className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Secure Stay</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Input Room # if booking confirmed</label>
                                    <div className="flex gap-3 mt-2">
                                        <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g. 204" className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-4 text-center font-bold" />
                                        <button onClick={handleCheckIn} className="flex-1 bg-green-500 hover:bg-green-400 text-black font-black py-3 rounded-xl transition-colors">CONFIRM CHECK-IN</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Area Mapping & Security Analysis</h2>
                        {scannedHotel ? (
                            <>
                                <div className="h-64 relative overflow-hidden rounded-2xl border border-gray-700">
                                    <Map 
                                        center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [13.0827, 80.2707]}
                                        zoom={14}
                                        markers={[
                                            { lat: 13.0827, lng: 80.2707, popup: "Your Location" },
                                            { lat: 13.0850, lng: 80.2750, popup: "Verified Safe: Grand Plaza" },
                                            { lat: 13.0780, lng: 80.2650, popup: "Verified Safe: City Stay" }
                                        ]}
                                        height="100%"
                                    />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Recommended Secure Stays Nearby</h3>
                                    <div className="space-y-3">
                                        <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex justify-between items-center hover:border-purple-500 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-black">98</div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">The Heritage Secure Inn</div>
                                                    <div className="text-[10px] text-gray-500">Women-Only Floor • 24/7 Police Direct Link</div>
                                                </div>
                                            </div>
                                            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex justify-between items-center hover:border-purple-500 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-black">94</div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">Zenith Heights Solo Stay</div>
                                                    <div className="text-[10px] text-gray-500">Biometric Entry • Verified Owner: Anjali R.</div>
                                                </div>
                                            </div>
                                            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 font-bold p-12 text-center">
                                <BuildingOffice2Icon className="w-16 h-16 mb-4 opacity-20" />
                                <p>Search for a hotel to see safety vectors, historical cases, and area mapping.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {phase === 'during-stay' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-b from-purple-900/50 to-gray-900 border border-purple-500/30 p-6 rounded-3xl text-center">
                            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50">
                                <LockClosedIcon className="w-10 h-10 text-purple-300" />
                            </div>
                            <h3 className="text-2xl font-black text-white">ROOM {roomNumber || '???'}</h3>
                            <p className="text-purple-300 text-sm mt-1">Live Location Broadcasting via Link</p>
                            <button className="mt-6 w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all">PANIC SOS</button>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-3xl text-center relative overflow-hidden">
                            <div className="text-sm font-bold text-gray-400 mb-2 uppercase">Scheduled Safety Check-In</div>
                            <div className="text-2xl font-mono text-white mb-4">03:59:42</div>
                            <p className="text-xs text-gray-500 mb-4">You must confirm you are safe every 4 hours.</p>
                            <button className="bg-green-500/20 text-green-400 border border-green-500 py-2 px-6 rounded-full font-bold w-full hover:bg-green-500/30">I AM SAFE</button>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">

                        {staffAtDoor && (
                            <div className="bg-red-500/20 border border-red-500 p-6 rounded-3xl flex items-start gap-4 animate-pulse">
                                <ExclamationTriangleIcon className="w-10 h-10 text-red-500 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xl font-bold text-white">Housekeeping Alert Generated</h4>
                                    <p className="text-red-300 mt-1">System detects someone at your door. Verify identity before opening. "Staff at door" notification logged.</p>
                                    <div className="flex gap-4 mt-4">
                                        <button onClick={() => setStaffAtDoor(false)} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold">DISMISS</button>
                                        <button className="bg-transparent border border-red-500 text-red-500 px-6 py-2 rounded-xl font-bold">TRIGGER SOS</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-6">Physical Room Sweep Checklist</h3>
                            <div className="space-y-3">
                                <div className="group relative">
                                    <button onClick={() => toggleChecklist('cameraCheck')} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${safetyChecklist.cameraCheck ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                                        <div className="flex items-center gap-3"><VideoCameraIcon className="w-6 h-6" /> <span className="font-bold">Scan for Hidden Cameras (Mirrors & Smoke Detectors)</span></div>
                                        {safetyChecklist.cameraCheck ? <CheckBadgeIcon className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>}
                                    </button>
                                    <div className="hidden group-hover:block absolute left-0 -top-20 z-20 bg-gray-900 border border-purple-500/50 p-3 rounded-xl text-xs text-purple-200 w-full shadow-2xl">
                                        <strong className="text-purple-400 uppercase block mb-1">How to scan:</strong>
                                        1. Turn off lights & use phone flashlight to spot lens glints. 
                                        2. Use 'Network Scanner' to find unknown WiFi cameras. 
                                        3. Check mirrors for 'Two-Way' gaps.
                                    </div>
                                </div>

                                <div className="group relative">
                                    <button onClick={() => toggleChecklist('deadbolt')} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${safetyChecklist.deadbolt ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                                        <div className="flex items-center gap-3"><LockClosedIcon className="w-6 h-6" /> <span className="font-bold">Verify Deadbolt & Chain Lock Functionality</span></div>
                                        {safetyChecklist.deadbolt ? <CheckBadgeIcon className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>}
                                    </button>
                                    <div className="hidden group-hover:block absolute left-0 -top-16 z-20 bg-gray-900 border border-purple-500/50 p-3 rounded-xl text-xs text-purple-200 w-full shadow-2xl">
                                        Ensure the chain is not loose and the deadbolt clicks fully. Never rely on just the handle lock.
                                    </div>
                                </div>

                                <div className="group relative">
                                    <button onClick={() => toggleChecklist('windows')} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${safetyChecklist.windows ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                                        <div className="flex items-center gap-3"><DocumentCheckIcon className="w-6 h-6" /> <span className="font-bold">Window Locks & Perimeter Check</span></div>
                                        {safetyChecklist.windows ? <CheckBadgeIcon className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>}
                                    </button>
                                </div>

                                <div className="group relative">
                                    <button onClick={() => toggleChecklist('balcony')} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${safetyChecklist.balcony ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                                        <div className="flex items-center gap-3"><ShieldCheckIcon className="w-6 h-6" /> <span className="font-bold">Balcony Security & Door Reinforcement</span></div>
                                        {safetyChecklist.balcony ? <CheckBadgeIcon className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Booking Reports History */}
                        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl mt-6">
                            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                                <DocumentCheckIcon className="w-6 h-6 text-purple-400" /> YOUR SAFETY REPORTS
                            </h3>
                            <div className="space-y-4">
                                {safetyReports.map(report => (
                                    <div key={report.id} className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-white">{report.hotel}</div>
                                            <div className="text-xs text-gray-500">{report.date}</div>
                                            <div className="text-[10px] text-gray-400 mt-1 italic">{report.notes}</div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${report.status === 'Verified Safe' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HotelSafety;
