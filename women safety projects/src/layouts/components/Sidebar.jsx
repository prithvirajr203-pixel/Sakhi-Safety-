import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import {
  HomeIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  MapIcon,
  CameraIcon,
  UsersIcon,
  GiftIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon, category: 'Main' },
  
  { name: 'SOS Center', to: '/sos', icon: ExclamationTriangleIcon, category: 'Emergency' },
  { name: 'Emergency Hub', to: '/emergency-hub', icon: ExclamationTriangleIcon, category: 'Emergency' },
  { name: 'Silent Alert', to: '/silent-emergency', icon: ShieldCheckIcon, category: 'Emergency' },
  
  { name: 'Safety Navigation', to: '/safety-navigation', icon: MapIcon, category: 'Safety' },
  { name: 'Live Tracking', to: '/live-tracking', icon: MapIcon, category: 'Safety' },
  { name: 'Location History', to: '/location-history', icon: MapIcon, category: 'Safety' },
  { name: 'Transport Safety', to: '/transport-safety', icon: ShieldCheckIcon, category: 'Safety' },
  { name: 'Hotel Safety', to: '/hotel-safety', icon: ShieldCheckIcon, category: 'Safety' },
  { name: 'Share Location', to: '/share-location', icon: MapIcon, category: 'Safety' },
  
  { name: 'AI Threat', to: '/ai-threat', icon: ShieldCheckIcon, category: 'AI' },
  { name: 'AI Fake Call', to: '/ai-fake-call', icon: ShieldCheckIcon, category: 'AI' },
  { name: 'Crime Prediction', to: '/crime-prediction', icon: ShieldCheckIcon, category: 'AI' },
  { name: 'Face Recognition', to: '/face-recognition', icon: CameraIcon, category: 'AI' },
  { name: 'AI Misuse', to: '/ai-misuse-detections', icon: ShieldCheckIcon, category: 'AI' },
  { name: 'Voice Hub', to: '/voice-hub', icon: Cog6ToothIcon, category: 'AI' },
  
  { name: 'Legal Hub', to: '/legal-hub', icon: ScaleIcon, category: 'Legal' },
  { name: 'Legal Aid', to: '/legal-aid', icon: ScaleIcon, category: 'Legal' },
  { name: 'Women Rights', to: '/women-rights', icon: ScaleIcon, category: 'Legal' },
  { name: 'Lok Adalat', to: '/lokadalat', icon: ScaleIcon, category: 'Legal' },
  { name: 'Cyber Crime', to: '/cyber-crime', icon: ShieldCheckIcon, category: 'Legal' },
  { name: 'UPI Safety', to: '/upi-safety', icon: ShieldCheckIcon, category: 'Legal' },
  { name: 'Fraud Detection', to: '/fraud-detections', icon: ShieldCheckIcon, category: 'Legal' },
  
  { name: 'Safety Education', to: '/safety-education', icon: AcademicCapIcon, category: 'Education' },
  { name: 'Digital Literacy', to: '/digital-literacy', icon: AcademicCapIcon, category: 'Education' },
  { name: 'Self Defense', to: '/self-defense', icon: AcademicCapIcon, category: 'Education' },
  { name: 'NGO Finder', to: '/ngo-finder', icon: UsersIcon, category: 'Education' },
  { name: 'Benefits Hub', to: '/benifits', icon: GiftIcon, category: 'Education' },
  
  { name: 'Community', to: '/community', icon: UsersIcon, category: 'Community' },
  { name: 'Smart Safety', to: '/smart-safety', icon: ShieldCheckIcon, category: 'Community' },
  { name: 'Wearable Tech', to: '/wearable', icon: Cog6ToothIcon, category: 'Devices' },
  { name: 'Spy Detection', to: '/spy-camera', icon: ShieldCheckIcon, category: 'Devices' },
  
  { name: 'Media Hub', to: '/media-hub', icon: CameraIcon, category: 'Records' },
  { name: 'My Records', to: '/my-records', icon: Cog6ToothIcon, category: 'Records' },
  { name: 'Reports', to: '/reports', icon: Cog6ToothIcon, category: 'Records' },
  { name: 'Gallery', to: '/gallery', icon: CameraIcon, category: 'Records' },
  { name: 'Camera', to: '/camera', icon: CameraIcon, category: 'Records' },
  
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon, category: 'System' },
  { name: 'Profile', to: '/profile', icon: Cog6ToothIcon, category: 'System' },
];

const Sidebar = ({ onClose }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <aside className="h-full w-72 bg-slate-900 border-r border-white/5 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">NEEPO</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Safety Portal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full lg:hidden">
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Nav Content */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {['Main', 'Emergency', 'Safety', 'AI', 'Legal', 'Education', 'Community', 'Devices', 'Records', 'System'].map((cat) => (
          <div key={cat}>
            <h3 className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              {cat}
            </h3>
            <div className="space-y-1">
              {navigation.filter(n => n.category === cat || (cat === 'Main' && !n.category)).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                      <span className="text-sm font-medium">{item.name}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 overflow-hidden">
            {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
                <span className="text-white font-bold">{user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Portal User'}</p>
            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium border border-transparent hover:border-red-500/20"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
