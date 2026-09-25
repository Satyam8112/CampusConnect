// Authentication, session, and presentation helpers for CampusConnect

export const getAuthToken = () => {
  return localStorage.getItem('campusconnect_token') || sessionStorage.getItem('campusconnect_token') || null;
};

export const getAuthUser = () => {
  try {
    const userStr = localStorage.getItem('campusconnect_user') || sessionStorage.getItem('campusconnect_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error('Error parsing stored user:', err);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const isOrganizer = () => {
  const user = getAuthUser();
  return user?.role === 'organizer';
};

export const isStudent = () => {
  const user = getAuthUser();
  return user?.role === 'student';
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Centralized session storage helpers
export const setAuthSession = (token, user, rememberMe = true) => {
  if (token) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('campusconnect_token', token);
  }
  if (user) {
    localStorage.setItem('campusconnect_user', JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem('campusconnect_token');
  sessionStorage.removeItem('campusconnect_token');
  localStorage.removeItem('campusconnect_user');
};

// Safe date formatting helpers
export const formatEventDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Category styling tokens matching CampusConnect dark aesthetic
export const getCategoryBadgeStyle = (category = '') => {
  const cat = category.toLowerCase();
  switch (cat) {
    case 'technical':
      return {
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        text: 'text-indigo-400',
        badge: 'bg-indigo-600 text-white'
      };
    case 'cultural':
      return {
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        text: 'text-pink-400',
        badge: 'bg-pink-600 text-white'
      };
    case 'sports':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
        badge: 'bg-emerald-600 text-white'
      };
    case 'business':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        badge: 'bg-amber-600 text-white'
      };
    case 'academic':
      return {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        text: 'text-cyan-400',
        badge: 'bg-cyan-600 text-white'
      };
    case 'social':
      return {
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        text: 'text-violet-400',
        badge: 'bg-violet-600 text-white'
      };
    default:
      return {
        bg: 'bg-slate-800/40',
        border: 'border-slate-700/50',
        text: 'text-slate-300',
        badge: 'bg-slate-700 text-white'
      };
  }
};
