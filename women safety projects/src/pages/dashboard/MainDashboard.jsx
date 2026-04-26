import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authstores'
import { useLocationStore } from '../../store/locationsstore'
import { useEmergencyStore } from '../../store/emergencystore'
import { useSakshiEyeStore } from '../../store/sakshieyestore'
import { SakshiEyeStatusCard } from '../../components/sakshieye/SakshiEyeComponents'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebases'
import StatsCard from './components/statscard'
import QuickActions from './components/quickactions'
import SafetyChart from './components/safetycharts'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import {
  MapPinIcon,
  ShieldCheckIcon,
  UsersIcon,
  BuildingLibraryIcon,
  ScaleIcon,
  MicrophoneIcon,
  PhoneIcon,
  ChartBarIcon,
  CameraIcon,
  DocumentIcon,
  BellAlertIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const features = [
  // Emergency Features
  {
    title: '🚨 SOS Center',
    description: 'Instantly raise an alert in emergencies',
    route: '/sos',
    icon: ExclamationTriangleIcon,
    category: 'Emergency',
    color: 'from-danger to-red-600'
  },
  {
    title: '🔇 Silent Emergency',
    description: 'Discreet emergency activation',
    route: '/silent-emergency',
    icon: ExclamationTriangleIcon,
    category: 'Emergency',
    color: 'from-danger to-red-600'
  },
  {
    title: '🆘 Emergency Hub',
    description: 'Comprehensive emergency management',
    route: '/emergency-hub',
    icon: PhoneIcon,
    category: 'Emergency',
    color: 'from-danger to-red-600'
  },

  // Safety Features
  {
    title: '📍 Live Tracking',
    description: 'Real-time location tracking',
    route: '/live-tracking',
    icon: MapPinIcon,
    category: 'Safety',
    color: 'from-primary-500 to-primary-600'
  },
  {
    title: '🗺️ Safety Navigation',
    description: 'Safe route navigation',
    route: '/safety-navigation',
    icon: MapPinIcon,
    category: 'Safety',
    color: 'from-primary-500 to-primary-600'
  },
  {
    title: '🚗 Transport Safety',
    description: 'Cab, bus & train safety features',
    route: '/transport-safety',
    icon: MapPinIcon,
    category: 'Safety',
    color: 'from-primary-500 to-primary-600'
  },
  {
    title: '🏨 Hotel Safety',
    description: 'Stay safe while traveling',
    route: '/hotel-safety',
    icon: MapPinIcon,
    category: 'Safety',
    color: 'from-primary-500 to-primary-600'
  },
  {
    title: '📍 Share Location',
    description: 'Share your location with contacts',
    route: '/share-location',
    icon: MapPinIcon,
    category: 'Safety',
    color: 'from-primary-500 to-primary-600'
  },

  // AI Features
  {
    title: '🤖 AI Threat Detection',
    description: 'Analyze surroundings for risks',
    route: '/ai-threat',
    icon: ShieldCheckIcon,
    category: 'AI Safety',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: '📞 AI Fake Call Detector',
    description: 'Detect scam and spam calls',
    route: '/ai-fake-call',
    icon: PhoneIcon,
    category: 'AI Safety',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: '🎤 Voice Clone AI',
    description: 'Create AI voice response',
    route: '/ai-voice-clone',
    icon: MicrophoneIcon,
    category: 'AI Safety',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: '🧠 Crime Prediction',
    description: 'AI crime risk analysis',
    route: '/crime-prediction',
    icon: ShieldCheckIcon,
    category: 'AI Safety',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: '👤 Face Recognition',
    description: 'Identify suspected criminals',
    route: '/face-recognition',
    icon: CameraIcon,
    category: 'AI Safety',
    color: 'from-purple-500 to-purple-600'
  },

  // Legal Features
  {
    title: '⚖️ Legal Hub',
    description: 'Legal services & rights info',
    route: '/legal-hub',
    icon: ScaleIcon,
    category: 'Legal Support',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: '📋 Legal Aid',
    description: 'Free legal assistance',
    route: '/legal-aid',
    icon: DocumentIcon,
    category: 'Legal Support',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: '🏛️ Lok Adalat',
    description: 'Alternative dispute resolution',
    route: '/lokadalat',
    icon: BuildingLibraryIcon,
    category: 'Legal Support',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: '📜 Women Rights',
    description: 'Know your legal rights',
    route: '/women-rights',
    icon: DocumentIcon,
    category: 'Legal Support',
    color: 'from-blue-500 to-blue-600'
  },

  // Media & Evidence
  {
    title: '📸 Media Hub',
    description: 'Capture & manage evidence',
    route: '/media-hub',
    icon: CameraIcon,
    category: 'Evidence',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: '📷 Camera',
    description: 'Professional photo capture',
    route: '/camera',
    icon: CameraIcon,
    category: 'Evidence',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: '🖼️ Gallery',
    description: 'Evidence gallery management',
    route: '/gallery',
    icon: CameraIcon,
    category: 'Evidence',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: '📊 Evidence Management',
    description: 'Organize evidence securely',
    route: '/evidence-manage',
    icon: DocumentIcon,
    category: 'Evidence',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: '🎯 AI Misuse Detection',
    description: 'Detect deepfakes & fake photos',
    route: '/ai-misuse-detections',
    icon: ShieldCheckIcon,
    category: 'Evidence',
    color: 'from-orange-500 to-orange-600'
  },

  // Records & Reports
  {
    title: '📁 My Records',
    description: 'Personal records management',
    route: '/my-records',
    icon: DocumentIcon,
    category: 'Records',
    color: 'from-green-500 to-green-600'
  },
  {
    title: '📄 Documents',
    description: 'Important documents storage',
    route: '/documents',
    icon: DocumentIcon,
    category: 'Records',
    color: 'from-green-500 to-green-600'
  },
  {
    title: '📋 My Reports',
    description: 'Your filed reports',
    route: '/my-reports',
    icon: DocumentIcon,
    category: 'Records',
    color: 'from-green-500 to-green-600'
  },
  {
    title: '📊 All Reports',
    description: 'Browse all reports',
    route: '/reports',
    icon: ChartBarIcon,
    category: 'Records',
    color: 'from-green-500 to-green-600'
  },

  // Community
  {
    title: '👥 Community Hub',
    description: 'Connect & share with community',
    route: '/community',
    icon: UsersIcon,
    category: 'Community',
    color: 'from-pink-500 to-pink-600'
  },
  {
    title: '💬 Forum',
    description: 'Community discussions',
    route: '/community/forum',
    icon: ChatBubbleLeftRightIcon,
    category: 'Community',
    color: 'from-pink-500 to-pink-600'
  },
  {
    title: '📰 Social Feed',
    description: 'Share experiences & tips',
    route: '/community/social-feed',
    icon: DocumentIcon,
    category: 'Community',
    color: 'from-pink-500 to-pink-600'
  },

  // Education
  {
    title: '📚 Safety Education',
    description: 'Learn safety practices',
    route: '/safety-education',
    icon: DocumentIcon,
    category: 'Education',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    title: '💻 Digital Literacy',
    description: 'Digital safety training',
    route: '/digital-literacy',
    icon: DocumentIcon,
    category: 'Education',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    title: '🥋 Self Defense',
    description: 'Self defense techniques',
    route: '/self-defense',
    icon: DocumentIcon,
    category: 'Education',
    color: 'from-yellow-500 to-yellow-600'
  },

  // Financial Safety
  {
    title: '💳 UPI Safety',
    description: 'Check UPI payment safety',
    route: '/upi-safety',
    icon: DocumentIcon,
    category: 'Finance',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    title: '🚨 Fraud Detection',
    description: 'Detect payment fraud',
    route: '/fraud-detections',
    icon: ShieldCheckIcon,
    category: 'Finance',
    color: 'from-indigo-500 to-indigo-600'
  },

  // Benefits & Support
  {
    title: '🎁 Benefits Hub',
    description: 'Government schemes & benefits',
    route: '/benefits',
    icon: DocumentIcon,
    category: 'Support',
    color: 'from-teal-500 to-teal-600'
  },
  {
    title: '💼 Schemes',
    description: 'Government schemes',
    route: '/benefits/schemes',
    icon: DocumentIcon,
    category: 'Support',
    color: 'from-teal-500 to-teal-600'
  },
  {
    title: '🎓 Scholarship',
    description: 'Scholarship opportunities',
    route: '/benefits/scholarship',
    icon: DocumentIcon,
    category: 'Support',
    color: 'from-teal-500 to-teal-600'
  },

  // Devices
  {
    title: '⌚ Wearable Devices',
    description: 'Smartwatch safety features',
    route: '/wearable',
    icon: ShieldCheckIcon,
    category: 'Devices',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    title: '📷 Spy Camera Detection',
    description: 'Detect hidden cameras',
    route: '/spy-camera',
    icon: CameraIcon,
    category: 'Devices',
    color: 'from-cyan-500 to-cyan-600'
  },

  // Cyber Crime
  {
    title: '🛡️ Cyber Crime Portal',
    description: 'Report cyber crimes',
    route: '/cyber-crime',
    icon: ShieldCheckIcon,
    category: 'Cyber Security',
    color: 'from-red-500 to-red-600'
  },
  {
    title: '📝 File Complaint',
    description: 'File cyber crime complaint',
    route: '/cyber/file-complaints',
    icon: DocumentIcon,
    category: 'Cyber Security',
    color: 'from-red-500 to-red-600'
  },

  // Other Services
  {
    title: '🏢 NGO Finder',
    description: 'Find NGOs & support groups',
    route: '/ngo-finder',
    icon: BuildingLibraryIcon,
    category: 'Services',
    color: 'from-slate-500 to-slate-600'
  },
  {
    title: '🔊 Voice Hub',
    description: 'Voice commands & features',
    route: '/voice-hub',
    icon: MicrophoneIcon,
    category: 'Services',
    color: 'from-slate-500 to-slate-600'
  },
  {
    title: '🔐 Smart Safety',
    description: 'Advanced safety features',
    route: '/smart-safety',
    icon: ShieldCheckIcon,
    category: 'Services',
    color: 'from-slate-500 to-slate-600'
  },
  {
    title: '📍 Location History',
    description: 'View location history',
    route: '/location-history',
    icon: MapPinIcon,
    category: 'Services',
    color: 'from-slate-500 to-slate-600'
  },
  {
    title: '⚙️ Settings',
    description: 'App settings & preferences',
    route: '/settings',
    icon: DocumentIcon,
    category: 'Services',
    color: 'from-slate-500 to-slate-600'
  },
  {
    title: '👤 Profile',
    description: 'Your profile & account',
    route: '/profile',
    icon: UsersIcon,
    category: 'Services',
    color: 'from-slate-500 to-slate-600'
  }
]

const MainDashboard = () => {
  const { user } = useAuthStore()
  const { currentLocation } = useLocationStore()
  const { emergencyContacts } = useEmergencyStore()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    photos: 0,
    documents: 0,
    reports: 0,
    contacts: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    try {
      // Load photos count
      const photosQuery = query(collection(db, 'photos'), where('userId', '==', user.uid))
      const photosSnapshot = await getDocs(photosQuery)
      
      // Load documents count
      const docsQuery = query(collection(db, 'documents'), where('userId', '==', user.uid))
      const docsSnapshot = await getDocs(docsQuery)
      
      // Load reports count
      const reportsQuery = query(collection(db, 'reports'), where('userId', '==', user?.uid))
      const reportsSnapshot = await getDocs(reportsQuery)

      setStats({
        photos: photosSnapshot.size,
        documents: docsSnapshot.size,
        reports: reportsSnapshot.size,
        contacts: emergencyContacts.length
      })

      // Load recent activities
      const activities = []
      const now = new Date()
      
      if (photosSnapshot.size > 0) {
        activities.push({
          id: 'photo',
          icon: CameraIcon,
          text: 'Recent photo captured',
          time: '2 hours ago',
          color: 'text-primary-500'
        })
      }
      
      if (reportsSnapshot.size > 0) {
        activities.push({
          id: 'report',
          icon: DocumentIcon,
          text: 'Safety report filed',
          time: '5 hours ago',
          color: 'text-warning'
        })
      }

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      if (error?.code === 'permission-denied') {
        toast.error('Firebase permissions denied: please update Firestore rules for user data.');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false)
    }
  }

  const quickStats = [
    {
      title: 'Safety Score',
      value: '85%',
      icon: ShieldCheckIcon,
      color: 'from-green-500 to-green-600',
      trend: '+5%'
    },
    {
      title: 'Emergency Contacts',
      value: stats.contacts.toString(),
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600',
      trend: '+2'
    },
    {
      title: 'Nearby Police',
      value: '2.3 km',
      icon: BuildingLibraryIcon,
      color: 'from-purple-500 to-purple-600',
      trend: '3 stations'
    },
    {
      title: 'Voice Clone',
      value: user?.voiceCloned ? 'Active' : 'Setup',
      icon: MicrophoneIcon,
      color: 'from-orange-500 to-orange-600',
      trend: user?.voiceCloned ? 'Ready' : 'Required'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            From Fear to Freedom, One Click Away
          </p>
        </div>
        
        {/* Live Location Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {currentLocation && currentLocation.lat && currentLocation.lng 
              ? `${currentLocation.lat.toFixed(6)}°N, ${currentLocation.lng.toFixed(6)}°E`
              : 'Location loading...'
            }
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* SAKHI EYE Status */}
      <SakshiEyeStatusCard
        isActive={true}
        detectionCount={0}
        facesCount={0}
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Safety Chart */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Safety Trends</h3>
              <select className="text-sm border rounded-lg px-3 py-2">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <SafetyChart />
          </Card>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </Card>

          {/* NALSA Alert */}
          <div className="bg-gradient-to-r from-success to-green-600 text-white p-6 rounded-xl animate-pulse-slow">
            <div className="flex items-start gap-4">
              <BellAlertIcon className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">NALSA Free Legal Aid</h3>
                <p className="text-sm opacity-90 mb-3">Call 15100 for free legal assistance</p>
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => navigate('/legal-hub')}
                  className="text-success"
                >
                  Apply Now
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white p-4 rounded-xl text-center">
          <UsersIcon className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">100</div>
          <div className="text-sm opacity-90">Women Trained</div>
        </div>
        <div className="bg-gradient-to-br from-success to-green-600 text-white p-4 rounded-xl text-center">
          <ScaleIcon className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">18</div>
          <div className="text-sm opacity-90">Legal Aid Cases</div>
        </div>
        <div className="bg-gradient-to-br from-warning to-orange-600 text-white p-4 rounded-xl text-center">
          <DocumentIcon className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">57</div>
          <div className="text-sm opacity-90">Schemes Applied</div>
        </div>
        <div className="bg-gradient-to-br from-danger to-red-600 text-white p-4 rounded-xl text-center">
          <CameraIcon className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.photos}</div>
          <div className="text-sm opacity-90">Photos Captured</div>
        </div>
      </div>

      {/* All Features by Category */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">All Features & Services</h2>
          <p className="text-gray-600">Access all {features.length}+ features for your safety</p>
        </div>

        {/* Group features by category */}
        {[
          'Emergency',
          'Safety',
          'AI Safety',
          'Legal Support',
          'Evidence',
          'Records',
          'Community',
          'Education',
          'Finance',
          'Support',
          'Devices',
          'Cyber Security',
          'Services'
        ].map((category) => {
          const categoryFeatures = features.filter(f => f.category === category)
          if (categoryFeatures.length === 0) return null

          return (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {category === 'Emergency' && '🆘 '}
                {category === 'Safety' && '🛡️ '}
                {category === 'AI Safety' && '🤖 '}
                {category === 'Legal Support' && '⚖️ '}
                {category === 'Evidence' && '📸 '}
                {category === 'Records' && '📁 '}
                {category === 'Community' && '👥 '}
                {category === 'Education' && '📚 '}
                {category === 'Finance' && '💳 '}
                {category === 'Support' && '🎁 '}
                {category === 'Devices' && '⚙️ '}
                {category === 'Cyber Security' && '🛡️ '}
                {category === 'Services' && '🔧 '}
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryFeatures.map((feature) => (
                  <button
                    key={feature.route}
                    onClick={() => navigate(feature.route)}
                    className={`bg-gradient-to-br ${feature.color} text-white rounded-xl p-5 hover:shadow-xl transition-all transform hover:scale-105 text-left`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <feature.icon className="w-6 h-6 flex-shrink-0" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {category}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                    <p className="text-sm opacity-90">{feature.description}</p>
                    <div className="mt-4 flex items-center text-sm opacity-75">
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Summary Stats */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-600 text-white rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{features.length}+</div>
              <div className="text-sm opacity-90">Features Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">13</div>
              <div className="text-sm opacity-90">Feature Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Instant Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-sm opacity-90">Secure & Private</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard




