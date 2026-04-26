import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { 
  Bars3Icon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-b border-white/5 z-[60] h-16 shadow-xl">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all transform active:scale-95"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 md:hidden bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden md:block">
              NEEPO <span className="text-purple-500">.</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 w-80 group focus-within:border-purple-500/50 transition-all">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 group-focus-within:text-purple-400" />
            <input 
              type="text" 
              placeholder="Search features..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-gray-500 w-full ml-2" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <button className="p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all relative">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
          </button>

          <button 
           onClick={() => navigate('/community/forum')}
           className="hidden md:flex items-center gap-2 p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </button>

          <div className="h-8 w-px bg-white/10 hidden md:block"></div>

          <Link to="/profile" className="flex items-center gap-3 pl-2 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none group-hover:text-purple-400 transition-colors uppercase tracking-tight">{user?.name || 'Portal User'}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-1">PRO Membership</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-white font-bold">{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
