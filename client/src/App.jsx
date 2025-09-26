import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([
    { id: 1, title: "Take out trash", assignedTo: "Dorian Joel Gabriel Bellanger", completed: false, priority: "medium", dueDate: "2024-01-20", points: 10 },
    { id: 2, title: "Clean kitchen", assignedTo: "Bilal Rasulovich Mataev", completed: true, priority: "high", dueDate: "2024-01-18", points: 25 },
    { id: 3, title: "Buy groceries", assignedTo: "Michal Olczak", completed: false, priority: "low", dueDate: "2024-01-22", points: 15 },
    { id: 4, title: "Walk the dog", assignedTo: "Abdulsamad Sheikh", completed: false, priority: "medium", dueDate: "2024-01-19", points: 20 },
    { id: 5, title: "Vacuum living room", assignedTo: "Dorian Joel Gabriel Bellanger", completed: true, priority: "medium", dueDate: "2024-01-17", points: 20 },
    { id: 6, title: "Do laundry", assignedTo: "Bilal Rasulovich Mataev", completed: false, priority: "high", dueDate: "2024-01-21", points: 30 },
    { id: 7, title: "Water plants", assignedTo: "Michal Olczak", completed: false, priority: "low", dueDate: "2024-01-23", points: 5 },
    { id: 8, title: "Clean bathroom", assignedTo: "Abdulsamad Sheikh", completed: false, priority: "high", dueDate: "2024-01-20", points: 35 }
  ]);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "House meeting this weekend", content: "We'll discuss the new chore schedule and upcoming events", author: "Dorian Joel Gabriel Bellanger", date: "2024-01-15", priority: "high" },
    { id: 2, title: "New cleaning supplies", content: "I've restocked the cleaning supplies in the utility closet", author: "Bilal Rasulovich Mataev", date: "2024-01-14", priority: "medium" },
    { id: 3, title: "Internet upgrade", content: "Our internet has been upgraded to 1GB speed - enjoy the faster connection!", author: "Michal Olczak", date: "2024-01-13", priority: "low" }
  ]);
  const [newTask, setNewTask] = useState({ title: '', assignedTo: '', priority: 'medium', points: 10 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'medium' });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);

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
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.assignedTo.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        assignedTo: newTask.assignedTo,
        completed: false,
        priority: newTask.priority,
        points: parseInt(newTask.points),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', assignedTo: '', priority: 'medium', points: 10 });
      setShowAddTask(false);
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
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
            🏠 HomeRush
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your name to continue
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Enter HomeRush
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={toggleTheme}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            🏠 HomeRush
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">Welcome, {userName}!</span>
            <button 
              onClick={toggleTheme} 
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
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
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 font-semibold' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{tasks.filter(t => t.completed).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <div className="text-3xl mb-2">⏰</div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{tasks.filter(t => !t.completed).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <div className="text-3xl mb-2">📢</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{announcements.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Announcements</div>
              </div>
            </div>

            {/* Household Members */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                👥 Gruppemedlemmer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {householdMembers.map((member, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">{member.avatar}</div>
                    <div className="font-medium text-gray-800 dark:text-white text-sm">{member.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">{member.role}</div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {member.badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Level {member.level} • {member.points} pts</div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">🔥 {member.streak} day streak</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Add Task Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">📋 Tasks</h2>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                ➕ Add Task
              </button>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Task</h3>
                <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Task title"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Assign to...</option>
                    {householdMembers.map((member, index) => (
                      <option key={index} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  >
                    Add Task
                  </button>
                </form>
              </div>
            )}

            {/* Tasks List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className={`p-4 rounded-lg border-l-4 ${
                    task.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    task.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-green-500 bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                            {task.title}
                          </span>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Assigned to: {task.assignedTo} • Due: {task.dueDate} • {task.points} pts
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                          task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                          'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {task.points} pts
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
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

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">🏆 Leaderboard</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                {getLeaderboard().map((member, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    index === 0 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    index === 1 ? 'border-gray-400 bg-gray-50 dark:bg-gray-700' :
                    index === 2 ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="text-3xl">{member.avatar}</div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">{member.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Level {member.level} • {member.completedTasks} tasks completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{member.totalPoints}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">points</div>
                        <div className="text-sm text-orange-600 dark:text-orange-400">🔥 {member.streak} streak</div>
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">📢 Announcements</h2>
              <button
                onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                ➕ Add Announcement
              </button>
            </div>

            {/* Add Announcement Form */}
            {showAddAnnouncement && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Announcement</h3>
                <form onSubmit={addAnnouncement} className="space-y-4">
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Announcement title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    placeholder="Announcement content"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <div className="flex justify-between items-center">
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Add Announcement
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Announcements List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={`border-l-4 pl-4 p-4 rounded-r-lg ${
                    announcement.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    announcement.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-green-500 bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {announcement.content}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          By {announcement.author} • {announcement.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          announcement.priority === 'high' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                          announcement.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                          'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        }`}>
                          {announcement.priority}
                        </span>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
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
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">🎖️ Achievements</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                    achievement.unlocked 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <div className={`font-semibold mb-1 ${
                        achievement.unlocked 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </div>
                      <div className={`text-sm ${
                        achievement.unlocked 
                          ? 'text-green-600 dark:text-green-300' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {achievement.description}
                      </div>
                      {achievement.unlocked && (
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
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