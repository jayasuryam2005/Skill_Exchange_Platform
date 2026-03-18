export const mockUsers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Senior React Developer with a passion for teaching and UI/UX design.',
    skillsOffered: ['React', 'Tailwind CSS', 'JavaScript'],
    skillsWanted: ['UI/UX Design', 'Figma', 'Python'],
    rating: 4.8,
    reviews: 12,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Product Designer specializing in clean, user-centric interfaces.',
    skillsOffered: ['UI/UX Design', 'Figma', 'User Research'],
    skillsWanted: ['React', 'Node.js'],
    rating: 4.9,
    reviews: 24,
  },
  {
    id: '3',
    name: 'Michael Smith',
    email: 'michael@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    bio: 'Data Scientist and Python enthusiast.',
    skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'],
    skillsWanted: ['JavaScript', 'HTML/CSS'],
    rating: 4.7,
    reviews: 8,
  }
];

export const mockRequests = [
  {
    id: 'req1',
    senderId: '2',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    skillOffered: 'UI/UX Design',
    skillWanted: 'React',
    status: 'received',
    timestamp: '2 hours ago',
  },
  {
    id: 'req2',
    senderId: '3',
    senderName: 'Michael Smith',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    skillOffered: 'Python',
    skillWanted: 'JavaScript',
    status: 'sent',
    timestamp: '1 day ago',
  }
];

export const mockSessions = [
  {
    id: 'sess1',
    partnerName: 'Sarah Chen',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    topic: 'Intro to Figma for React Devs',
    date: 'March 20, 2026',
    time: '2:00 PM',
    type: 'upcoming',
  },
  {
    id: 'sess2',
    partnerName: 'Michael Smith',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    topic: 'JavaScript Basics',
    date: 'March 15, 2026',
    time: '10:00 AM',
    type: 'completed',
  }
];

export const mockNotifications = [
  {
    id: 'ntf1',
    message: 'Sarah Chen sent you a skill exchange request!',
    type: 'request',
    isRead: false,
    timestamp: '2 hours ago',
  },
  {
    id: 'ntf2',
    message: 'Your session with Michael is starting in 30 minutes.',
    type: 'session',
    isRead: true,
    timestamp: '5 hours ago',
  }
];
