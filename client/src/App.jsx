import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([
    { id: 1, title: "Take out trash", assignedTo: "Dorian Joel Gabriel Bellanger", completed: false, priority: "medium", dueDate: "2024-01-20", points: 10, maxPoints: 10, timeLeft: 3600, maxTime: 3600, createdAt: Date.now() - 1800000 },
    { id: 2, title: "Clean kitchen", assignedTo: "Bilal Rasulovich Mataev", completed: true, priority: "high", dueDate: "2024-01-18", points: 25, maxPoints: 25, timeLeft: 0, maxTime: 7200, createdAt: Date.now() - 7200000 },
    { id: 3, title: "Buy groceries", assignedTo: "Michal Olczak", completed: false, priority: "low", dueDate: "2024-01-22", points: 15, maxPoints: 15, timeLeft: 5400, maxTime: 5400, createdAt: Date.now() - 900000 },
    { id: 4, title: "Walk the dog", assignedTo: "Abdulsamad Sheikh", completed: false, priority: "medium", dueDate: "2024-01-19", points: 20, maxPoints: 20, timeLeft: 2700, maxTime: 2700, createdAt: Date.now() - 900000 },
    { id: 5, title: "Vacuum living room", assignedTo: "Dorian Joel Gabriel Bellanger", completed: true, priority: "medium", dueDate: "2024-01-17", points: 20, maxPoints: 20, timeLeft: 0, maxTime: 3600, createdAt: Date.now() - 3600000 },
    { id: 6, title: "Do laundry", assignedTo: "Bilal Rasulovich Mataev", completed: false, priority: "high", dueDate: "2024-01-21", points: 30, maxPoints: 30, timeLeft: 1800, maxTime: 1800, createdAt: Date.now() - 1800000 },
    { id: 7, title: "Water plants", assignedTo: "Michal Olczak", completed: false, priority: "low", dueDate: "2024-01-23", points: 5, maxPoints: 5, timeLeft: 7200, maxTime: 7200, createdAt: Date.now() - 0 },
    { id: 8, title: "Clean bathroom", assignedTo: "Abdulsamad Sheikh", completed: false, priority: "high", dueDate: "2024-01-20", points: 35, maxPoints: 35, timeLeft: 900, maxTime: 900, createdAt: Date.now() - 2700000 }
  ]);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "House meeting this weekend", content: "We'll discuss the new chore schedule and upcoming events", author: "Dorian Joel Gabriel Bellanger", date: "2024-01-15", priority: "high" },
    { id: 2, title: "New cleaning supplies", content: "I've restocked the cleaning supplies in the utility closet", author: "Bilal Rasulovich Mataev", date: "2024-01-14", priority: "medium" },
    { id: 3, title: "Internet upgrade", content: "Our internet has been upgraded to 1GB speed - enjoy the faster connection!", author: "Michal Olczak", date: "2024-01-13", priority: "low" }
  ]);
  const [newTask, setNewTask] = useState({ title: '', assignedTo: '', priority: 'medium', points: 10, timeLimit: 3600 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'medium' });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streakBonus, setStreakBonus] = useState(1);
  const timerRef = useRef(null);

  const householdMembers = [
    { name: "Dorian Joel Gabriel Bellanger", avatar: "👨‍💼", role: "Admin", level: 5, points: 450, streak: 7, badges: ["🏆", "⭐", "🔥"] },
    { name: "Bilal Rasulovich Mataev", avatar: "👨‍🎓", role: "Member", level: 4, points: 380, streak: 5, badges: ["⭐", "🎯"] },
    { name: "Michal Olczak", avatar: "👨‍💻", role: "Member", level: 3, points: 320, streak: 3, badges: ["🎯"] },
    { name: "Abdulsamad Sheikh", avatar: "👨‍🚀", role: "Member", level: 2, points: 280, streak: 2, badges: ["🆕"] }
  ];

  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first task", icon: "👶", unlocked: true },
    { id: 2, name: "Streak Master", description: "Complete 5 tasks in a row", icon: "🔥", unlocked: true },
    { id: 3, name: "Speed Demon", description: "Complete a task within 1 hour", icon: "⚡", unlocked: false },
    { id: 4, name: "Team Player", description: "Help complete 10 tasks", icon: "🤝", unlocked: true },
    { id: 5, name: "Clean Freak", description: "Complete 20 cleaning tasks", icon: "🧹", unlocked: false },
    { id: 6, name: "Leader", description: "Reach level 5", icon: "👑", unlocked: true }
  ];

  // Timer functionality
  useEffect(() => {
    if (isLoggedIn) {
      timerRef.current = setInterval(() => {
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.completed || task.timeLeft <= 0) return task;
            
            const newTimeLeft = Math.max(0, task.timeLeft - 1);
            const timeProgress = (task.maxTime - newTimeLeft) / task.maxTime;
            const newPoints = Math.max(1, Math.floor(task.maxPoints * (1 - timeProgress * 0.5)));
            
            // Add notification for urgent tasks
            if (newTimeLeft === 300 && task.timeLeft > 300) { // 5 minutes warning
              addNotification(`${task.title} is running out of time! ⏰`, 'warning');
            }
            if (newTimeLeft === 60 && task.timeLeft > 60) { // 1 minute warning
              addNotification(`${task.title} expires in 1 minute! 🚨`, 'urgent');
            }
            
            return {
              ...task,
              timeLeft: newTimeLeft,
              points: newPoints
            };
          })
        );
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoggedIn]);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('HomeRush', { body: message, icon: '/favicon.ico' });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (timeLeft, maxTime) => {
    const percentage = (timeLeft / maxTime) * 100;
    if (percentage > 50) return 'text-green-600 dark:text-green-400';
    if (percentage > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const playSound = (type) => {
    if (!soundEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'complete') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
    } else if (type === 'urgent') {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setActiveTab('dashboard');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const wasCompleted = task.completed;
        const newCompleted = !wasCompleted;
        
        if (newCompleted && !wasCompleted) {
          // Task completed - play sound and add bonus
          playSound('complete');
          
          // Calculate bonus points based on time remaining
          const timeBonus = Math.floor(task.points * (task.timeLeft / task.maxTime) * 0.5);
          const finalPoints = task.points + timeBonus;
          
          addNotification(`🎉 Task completed! +${finalPoints} points${timeBonus > 0 ? ` (+${timeBonus} time bonus!)` : ''}`, 'success');
          
          return {
            ...task,
            completed: newCompleted,
            finalPoints: finalPoints,
            timeBonus: timeBonus
          };
        } else if (!newCompleted && wasCompleted) {
          // Task uncompleted
          return {
            ...task,
            completed: newCompleted,
            finalPoints: undefined,
            timeBonus: undefined
          };
        }
      }
      return task;
    }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.assignedTo.trim()) {
      const timeLimit = parseInt(newTask.timeLimit) || 3600;
      const task = {
        id: Date.now(),
        title: newTask.title,
        assignedTo: newTask.assignedTo,
        completed: false,
        priority: newTask.priority,
        points: parseInt(newTask.points),
        maxPoints: parseInt(newTask.points),
        timeLeft: timeLimit,
        maxTime: timeLimit,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: Date.now()
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', assignedTo: '', priority: 'medium', points: 10, timeLimit: 3600 });
      setShowAddTask(false);
      addNotification(`📋 New task added: ${newTask.title}`, 'info');
    }
  };

  const addAnnouncement = (e) => {
    e.preventDefault();
    if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
      const announcement = {
        id: Date.now(),
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        author: userName,
        date: new Date().toISOString().split('T')[0],
        priority: newAnnouncement.priority
      };
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement({ title: '', content: '', priority: 'medium' });
      setShowAddAnnouncement(false);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteAnnouncement = (announcementId) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId));
  };

  const getPointsForPriority = (priority) => {
    switch(priority) {
      case 'high': return 25;
      case 'medium': return 15;
      case 'low': return 10;
      default: return 10;
    }
  };

  const getTotalPoints = (memberName) => {
    return tasks
      .filter(task => task.assignedTo === memberName && task.completed)
      .reduce((total, task) => total + task.points, 0);
  };

  const getCompletedTasksCount = (memberName) => {
    return tasks.filter(task => task.assignedTo === memberName && task.completed).length;
  };

  const getLeaderboard = () => {
    return householdMembers.map(member => ({
      ...member,
      totalPoints: getTotalPoints(member.name),
      completedTasks: getCompletedTasksCount(member.name)
    })).sort((a, b) => b.totalPoints - a.totalPoints);
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="glass-effect p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce-gentle">🏠</div>
            <h1 className="text-4xl font-display font-bold gradient-text">
              HomeRush
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
              Gamified Household Management
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Enter your name to continue
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              🚀 Enter HomeRush
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={toggleTheme}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300 flex items-center justify-center mx-auto space-x-2"
            >
              <span>{theme === 'light' ? '🌙' : '☀️'}</span>
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`glass-effect p-4 rounded-xl shadow-lg animate-slide-up ${
                  notification.type === 'success' ? 'border-green-500 bg-green-50/80 dark:bg-green-900/20' :
                  notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50/80 dark:bg-yellow-900/20' :
                  notification.type === 'urgent' ? 'border-red-500 bg-red-50/80 dark:bg-red-900/20' :
                  'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20'
                }`}
              >
                <div className="font-medium text-sm">{notification.message}</div>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="text-4xl animate-bounce-gentle">🏠</div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text">
              HomeRush
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              Welcome, {userName}!
            </span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`glass-effect p-3 rounded-xl hover:shadow-lg transition-all duration-300 ${
                soundEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
              }`}
              title={soundEnabled ? 'Sound On' : 'Sound Off'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button 
              onClick={requestNotificationPermission}
              className="glass-effect p-3 rounded-xl hover:shadow-lg transition-all duration-300"
              title="Enable Notifications"
            >
              🔔
            </button>
            <button 
              onClick={toggleTheme} 
              className="glass-effect p-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button 
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 glass-effect p-2 rounded-2xl">
          {[
            { id: 'dashboard', label: '🏠 Dashboard', icon: '🏠' },
            { id: 'tasks', label: '📋 Tasks', icon: '📋' },
            { id: 'leaderboard', label: '🏆 Leaderboard', icon: '🏆' },
            { id: 'announcements', label: '📢 Announcements', icon: '📢' },
            { id: 'achievements', label: '🎖️ Achievements', icon: '🎖️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${
                activeTab === tab.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="stat-card text-center animate-slide-up">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Tasks</div>
              </div>
              <div className="stat-card text-center animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="text-4xl mb-3">✅</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{tasks.filter(t => t.completed).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Completed</div>
              </div>
              <div className="stat-card text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl mb-3">⏰</div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{tasks.filter(t => !t.completed).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Pending</div>
              </div>
              <div className="stat-card text-center animate-slide-up" style={{animationDelay: '0.3s'}}>
                <div className="text-4xl mb-3">📢</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{announcements.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Announcements</div>
              </div>
            </div>

            {/* Household Members */}
            <div className="glass-effect rounded-3xl p-6 animate-fade-in">
              <h2 className="text-2xl font-display font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                <span className="text-3xl mr-3">👥</span>
                Gruppemedlemmer
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {householdMembers.map((member, index) => (
                  <div key={index} className="member-card animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="text-4xl mb-3">{member.avatar}</div>
                    <div className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{member.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-3 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">{member.role}</div>
                    <div className="flex justify-center space-x-1 mb-3">
                      {member.badges.map((badge, i) => (
                        <span key={i} className="text-lg animate-bounce-gentle" style={{animationDelay: `${i * 0.2}s`}}>{badge}</span>
                      ))}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Level {member.level} • {member.points} pts</div>
                    <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">🔥 {member.streak} day streak</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-8 animate-fade-in">
            {/* Add Task Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white flex items-center">
                <span className="text-3xl mr-3">📋</span>
                Tasks
              </h2>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="btn-accent"
              >
                ➕ Add Task
              </button>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <div className="glass-effect rounded-3xl p-6 animate-slide-up">
                <h3 className="text-xl font-display font-semibold mb-6 text-gray-800 dark:text-white">Add New Task</h3>
                <form onSubmit={addTask} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Task title"
                      className="input-field sm:col-span-2"
                      required
                    />
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value="">Assign to...</option>
                      {householdMembers.map((member, index) => (
                        <option key={index} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="input-field"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input
                      type="number"
                      value={newTask.points}
                      onChange={(e) => setNewTask({...newTask, points: e.target.value})}
                      placeholder="Points"
                      min="1"
                      className="input-field"
                    />
                    <select
                      value={newTask.timeLimit}
                      onChange={(e) => setNewTask({...newTask, timeLimit: e.target.value})}
                      className="input-field"
                    >
                      <option value="900">15 minutes</option>
                      <option value="1800">30 minutes</option>
                      <option value="3600">1 hour</option>
                      <option value="7200">2 hours</option>
                      <option value="14400">4 hours</option>
                      <option value="86400">24 hours</option>
                    </select>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tasks List */}
            <div className="glass-effect rounded-3xl p-6 animate-fade-in">
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={task.id} className={`task-item ${task.priority === 'high' ? 'priority-high' : task.priority === 'medium' ? 'priority-medium' : 'priority-low'} animate-slide-up`} style={{animationDelay: `${index * 0.05}s`}}>
                    <div className="space-y-3">
                      {/* Timer Progress Bar */}
                      {!task.completed && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              task.timeLeft / task.maxTime > 0.5 ? 'bg-green-500' :
                              task.timeLeft / task.maxTime > 0.2 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(task.timeLeft / task.maxTime) * 100}%` }}
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-4 flex-1">
                          <input 
                            type="checkbox" 
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <span className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                              {task.title}
                            </span>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              <span className="font-medium">Assigned to:</span> {task.assignedTo}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Due:</span> {task.dueDate} • 
                              <span className={`font-medium ml-1 ${task.completed && task.finalPoints ? 'text-green-600 dark:text-green-400' : ''}`}>
                                {task.completed && task.finalPoints ? `${task.finalPoints} pts` : `${task.points} pts`}
                                {task.completed && task.timeBonus > 0 && (
                                  <span className="text-green-600 dark:text-green-400 ml-1">
                                    (+{task.timeBonus} bonus!)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {/* Timer Display */}
                          {!task.completed && (
                            <div className={`text-sm font-mono font-bold ${getTimeColor(task.timeLeft, task.maxTime)}`}>
                              ⏰ {formatTime(task.timeLeft)}
                            </div>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
                            task.completed && task.finalPoints ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                          }`}>
                            {task.completed && task.finalPoints ? `${task.finalPoints} pts` : `${task.points} pts`}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white flex items-center">
              <span className="text-3xl mr-3">🏆</span>
              Leaderboard
            </h2>
            <div className="glass-effect rounded-3xl p-6 animate-fade-in">
              <div className="space-y-4">
                {getLeaderboard().map((member, index) => (
                  <div key={index} className={`leaderboard-item ${
                    index === 0 ? 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50/80 to-yellow-100/80 dark:from-yellow-900/20 dark:to-yellow-800/20' :
                    index === 1 ? 'border-l-4 border-gray-400 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/20 dark:to-gray-600/20' :
                    index === 2 ? 'border-l-4 border-orange-600 bg-gradient-to-r from-orange-50/80 to-orange-100/80 dark:from-orange-900/20 dark:to-orange-800/20' :
                    'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20'
                  } animate-slide-up`} style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="text-4xl">{member.avatar}</div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white text-lg">{member.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Level {member.level} • {member.completedTasks} tasks completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{member.totalPoints}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">points</div>
                        <div className="text-sm text-orange-600 dark:text-orange-400 font-semibold">🔥 {member.streak} streak</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white flex items-center">
                <span className="text-3xl mr-3">📢</span>
                Announcements
              </h2>
              <button
                onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}
                className="btn-primary"
              >
                ➕ Add Announcement
              </button>
            </div>

            {/* Add Announcement Form */}
            {showAddAnnouncement && (
              <div className="glass-effect rounded-3xl p-6 animate-slide-up">
                <h3 className="text-xl font-display font-semibold mb-6 text-gray-800 dark:text-white">Add New Announcement</h3>
                <form onSubmit={addAnnouncement} className="space-y-6">
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Announcement title"
                    className="input-field"
                    required
                  />
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    placeholder="Announcement content"
                    rows="4"
                    className="input-field resize-none"
                    required
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                      className="input-field sm:w-auto"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Add Announcement
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Announcements List */}
            <div className="glass-effect rounded-3xl p-6 animate-fade-in">
              <div className="space-y-6">
                {announcements.map((announcement, index) => (
                  <div key={announcement.id} className={`announcement-item ${
                    announcement.priority === 'high' ? 'priority-high' :
                    announcement.priority === 'medium' ? 'priority-medium' :
                    'priority-low'
                  } animate-slide-up`} style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-lg">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                          {announcement.content}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          By <span className="font-semibold">{announcement.author}</span> • {announcement.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          announcement.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' :
                          announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                        }`}>
                          {announcement.priority}
                        </span>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white flex items-center">
              <span className="text-3xl mr-3">🎖️</span>
              Achievements
            </h2>
            <div className="glass-effect rounded-3xl p-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={achievement.id} className={`achievement-card ${
                    achievement.unlocked 
                      ? 'border-green-500 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-900/20 dark:to-green-800/20' 
                      : 'border-gray-300 bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-700/20 dark:to-gray-600/20'
                  } animate-slide-up`} style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="text-center">
                      <div className="text-5xl mb-4 animate-bounce-gentle">{achievement.icon}</div>
                      <div className={`font-semibold mb-2 text-lg ${
                        achievement.unlocked 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </div>
                      <div className={`text-sm mb-3 ${
                        achievement.unlocked 
                          ? 'text-green-600 dark:text-green-300' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {achievement.description}
                      </div>
                      {achievement.unlocked && (
                        <div className="text-sm text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-800 px-3 py-1 rounded-full">
                          ✅ UNLOCKED
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;