import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  SpeakerWaveIcon,
  CommandLineIcon,
  LanguageIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ListBulletIcon,
  ClockIcon,
  HeartIcon,
  ShieldCheckIcon,
  PhoneIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { MicrophoneIcon as MicrophoneIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const VoiceHub = () => {
  const navigate = useNavigate();
  const {
    isListening,
    lastCommand,
    confidence,
    transcript,
    supported,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    getVoices,
    setVoice
  } = useVoiceCommands({ language: 'en-US', autoStart: false });

  const [activeTab, setActiveTab] = useState('commands');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [favoriteCommands, setFavoriteCommands] = useState([]);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { id: 'commands', name: 'Voice Commands', icon: CommandLineIcon },
    { id: 'history', name: 'History', icon: ClockIcon },
    { id: 'favorites', name: 'Favorites', icon: HeartIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
  ];

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'gu-IN', name: 'Gujarati' }
  ];

  const commandCategories = [
    {
      name: 'Emergency Commands',
      commands: [
        { phrase: 'Help', action: 'Triggers SOS emergency' },
        { phrase: 'Emergency', action: 'Triggers SOS' },
        { phrase: 'SOS', action: 'Activates SOS' },
        { phrase: 'Police', action: 'Calls police' },
        { phrase: 'Ambulance', action: 'Calls ambulance' }
      ],
      icon: '🚨'
    },
    {
      name: 'Safety Commands',
      commands: [
        { phrase: 'Start tracking', action: 'Begins live location tracking' },
        { phrase: 'Stop tracking', action: 'Stops location tracking' },
        { phrase: 'Where am I', action: 'Tells current location' },
        { phrase: 'Safety score', action: 'Gives safety score for area' },
        { phrase: 'Find police', action: 'Shows nearby police stations' }
      ],
      icon: '🛡️'
    },
    {
      name: 'Call Commands',
      commands: [
        { phrase: 'Call mother', action: 'Calls mother' },
        { phrase: 'Call father', action: 'Calls father' },
        { phrase: 'Call sister', action: 'Calls sister' },
        { phrase: 'Call brother', action: 'Calls brother' },
        { phrase: 'Fake call', action: 'Triggers fake call' }
      ],
      icon: '📞'
    },
    {
      name: 'Navigation Commands',
      commands: [
        { phrase: 'Open safety navigation', action: 'Opens the safety navigation page' },
        { phrase: 'Open live tracking', action: 'Opens the live tracking page' },
        { phrase: 'Open share location', action: 'Opens the share location page' },
        { phrase: 'Find hospital', action: 'Shows nearby hospitals' },
        { phrase: 'Find shelter', action: 'Shows women shelters' }
      ],
      icon: '🗺️'
    },
    {
      name: 'Family Commands',
      commands: [
        { phrase: 'Locate family', action: 'Shows family locations' },
        { phrase: 'Open family tracking', action: 'Opens the family tracking section' },
        { phrase: 'Message mother', action: 'Opens message to mother' },
        { phrase: 'Track sister', action: 'Tracks sister' },
        { phrase: 'Share location', action: 'Shares current location' }
      ],
      icon: '👨‍👩‍👧'
    },
    {
      name: 'Mode Commands',
      commands: [
        { phrase: 'Silent mode', action: 'Activates silent mode' },
        { phrase: 'Normal mode', action: 'Deactivates silent mode' },
        { phrase: 'Activate silent', action: 'Turns on silent mode' },
        { phrase: 'Threat detected', action: 'Reports threat' },
        { phrase: 'I am safe', action: 'Reports safety' }
      ],
      icon: '🔇'
    }
  ];

  useEffect(() => {
    // Load available voices
    const availableVoices = getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].name);
    }
  }, [getVoices]);

  useEffect(() => {
    // Add to command history when command received
    if (lastCommand) {
      setCommandHistory(prev => [
        {
          command: lastCommand,
          timestamp: new Date().toLocaleTimeString(),
          confidence
        },
        ...prev
      ].slice(0, 20));
    }
  }, [lastCommand, confidence]);

  // Execute actual capabilities automatically based on recognized speech
  useEffect(() => {
    if (!lastCommand || confidence < 0.3) return;
    
    const cmdStr = lastCommand.toLowerCase();

    if (cmdStr.includes('sos') || cmdStr.includes('emergency') || cmdStr.includes('help')) {
        toast.error('🚨 EMERGENCY VOICE COMMAND DETECTED! Deploying SOS protocol...', { duration: 5000 });
        navigate('/sos');
    } 
    else if (cmdStr.includes('police')) {
        toast.success('📞 Voice routing: Dialing Police (100)...');
        setTimeout(() => { window.location.href = 'tel:100'; }, 1000);
    } 
    else if (cmdStr.includes('15100') || cmdStr.includes('legal aid')) {
        toast.success('📞 Voice routing: Dialing Legal Aid (15100)...');
        setTimeout(() => { window.location.href = 'tel:15100'; }, 1000);
    } 
    else if (cmdStr.includes('rights') || cmdStr.includes('show right')) {
        toast.success('⚖️ Voice routing: Opening Legal Rights Toolkit...');
        navigate('/women-rights');
    }
    else if (cmdStr.includes('open safety navigation') || cmdStr.includes('show safety navigation') || cmdStr.includes('open safety')) {
        toast.success('🗺️ Opening Safety Navigation...');
        navigate('/safety-navigation');
    }
    else if (cmdStr.includes('open live tracking') || cmdStr.includes('live tracking')) {
        toast.success('📍 Opening Live Tracking...');
        navigate('/live-tracking');
    }
    else if (cmdStr.includes('open share location') || cmdStr.includes('share location')) {
        toast.success('📤 Opening Share Location...');
        navigate('/share-location');
    }
    else if (cmdStr.includes('open family tracking') || cmdStr.includes('family tracking')) {
        toast.success('👨‍👩‍👧 Opening Family Tracking...');
        navigate('/safety-navigation');
    }
    else if (cmdStr.includes('open dashboard') || cmdStr.includes('dashboard')) {
        toast.success('🏠 Opening Dashboard...');
        navigate('/dashboard');
    }
    else if (cmdStr.includes('open voice hub') || cmdStr.includes('voice hub')) {
        toast.success('🎤 Opening Voice Command Center...');
        navigate('/voice-hub');
    }
    else if (cmdStr.includes('open schedules') || cmdStr.includes('schedules') || cmdStr.includes('my schedule')) {
        toast.success('📅 Opening Schedules Hub...');
        navigate('/schedules');
    }
  }, [lastCommand, confidence, navigate]);

  const handleStartListening = () => {
    const started = startListening();
    if (started) {
      toast.success('Listening for voice commands...');
    }
  };

  const handleStopListening = () => {
    stopListening();
    toast.info('Voice recognition stopped');
  };

  const handleSpeak = (text) => {
    speak(text, {
      rate: speechRate,
      pitch: speechPitch,
      voice: voices.find(v => v.name === selectedVoice)
    });
  };

  const handleTestCommand = (command) => {
    speak(`Testing command: ${command}`);
    toast.success(`Command recognized: ${command}`);
  };

  const toggleFavorite = (command) => {
    if (favoriteCommands.includes(command)) {
      setFavoriteCommands(favoriteCommands.filter(c => c !== command));
      toast.info('Removed from favorites');
    } else {
      setFavoriteCommands([...favoriteCommands, command]);
      toast.success('Added to favorites');
    }
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    // In real app, reinitialize voice recognition with new language
    toast.success(`Language changed to ${languages.find(l => l.code === langCode)?.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🎤 Voice Command Center
          </h1>
          <p className="text-gray-600 mt-1">
            Control the app with your voice - Multilingual support
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/schedules')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <ClockIcon className="w-5 h-5" />
            📅 Schedules
          </button>

          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>

          {!supported ? (
            <div className="bg-danger/10 text-danger px-4 py-2 rounded-lg">
              Voice recognition not supported
            </div>
          ) : (
            <div className="flex gap-2">
              {!isListening ? (
                <Button
                  variant="primary"
                  onClick={handleStartListening}
                >
                  <MicrophoneIcon className="w-5 h-5 mr-2" />
                  Start Listening
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={handleStopListening}
                >
                  <StopIcon className="w-5 h-5 mr-2" />
                  Stop Listening
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Card */}
      <Card className={`bg-gradient-to-r ${
        isListening ? 'from-success to-green-600' : 'from-gray-500 to-gray-600'
      } text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isListening ? (
              <div className="flex gap-1">
                <div className="w-2 h-8 bg-white rounded-full animate-wave"></div>
                <div className="w-2 h-12 bg-white rounded-full animate-wave animation-delay-200"></div>
                <div className="w-2 h-6 bg-white rounded-full animate-wave animation-delay-400"></div>
                <div className="w-2 h-10 bg-white rounded-full animate-wave animation-delay-600"></div>
                <div className="w-2 h-8 bg-white rounded-full animate-wave animation-delay-800"></div>
              </div>
            ) : (
              <MicrophoneIconSolid className="w-8 h-8 opacity-75" />
            )}
            <div>
              <p className="text-lg font-bold">
                {isListening ? 'Listening...' : 'Voice Recognition Inactive'}
              </p>
              {isListening && transcript && (
                <p className="text-sm opacity-90 mt-1">Heard: "{transcript}"</p>
              )}
            </div>
          </div>

          {lastCommand && (
            <div className="text-right">
              <p className="text-sm opacity-75">Last Command</p>
              <p className="text-lg font-bold">{lastCommand}</p>
              <p className="text-xs opacity-75">Confidence: {Math.round(confidence * 100)}%</p>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Commands Tab */}
        {activeTab === 'commands' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commandCategories.map((category, idx) => (
              <Card key={idx}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>

                <div className="space-y-2">
                  {category.commands.map((cmd, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group"
                    >
                      <div>
                        <p className="font-medium text-sm">"{cmd.phrase}"</p>
                        <p className="text-xs text-gray-500">{cmd.action}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTestCommand(cmd.phrase)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                          title="Test command"
                        >
                          <PlayIcon className="w-4 h-4 text-primary-500" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(cmd.phrase)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                          title="Add to favorites"
                        >
                          <HeartIcon className={`w-4 h-4 ${
                            favoriteCommands.includes(cmd.phrase) ? 'text-danger fill-current' : 'text-gray-400'
                          }`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Command History</h3>

            {commandHistory.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No command history yet</p>
                <p className="text-sm text-gray-400 mt-1">Start speaking to see commands here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {commandHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">"{entry.command}"</p>
                      <p className="text-xs text-gray-500">{entry.timestamp}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.confidence > 0.8 ? 'bg-success/10 text-success' :
                      entry.confidence > 0.5 ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {Math.round(entry.confidence * 100)}% confidence
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Favorite Commands</h3>

            {favoriteCommands.length === 0 ? (
              <div className="text-center py-8">
                <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No favorite commands yet</p>
                <p className="text-sm text-gray-400 mt-1">Click the heart icon on commands to add them</p>
              </div>
            ) : (
              <div className="space-y-2">
                {favoriteCommands.map((command, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <p className="font-medium">"{command}"</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTestCommand(command)}
                    >
                      <PlayIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Voice Selection */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SpeakerWaveIcon className="w-4 h-4 inline mr-1" />
                    Voice
                  </label>
                  <select
                    value={selectedVoice || ''}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    {voices.map((voice, index) => (
                      <option key={index} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Rate: {speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Pitch: {speechPitch}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleSpeak('This is a test of your voice settings')}
                >
                  <SpeakerWaveIcon className="w-5 h-5 mr-2" />
                  Test Voice
                </Button>
              </div>
            </Card>

            {/* Language Settings */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Language Settings</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LanguageIcon className="w-4 h-4 inline mr-1" />
                    Recognition Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-primary-50 border border-primary-200">
              <h4 className="font-medium text-primary-800 mb-2">Voice Command Tips</h4>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Reduce background noise for better recognition</li>
                <li>• Use specific commands for best results</li>
                <li>• Emergency commands work even in low confidence</li>
                <li>• Test your voice settings regularly</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceHub;
