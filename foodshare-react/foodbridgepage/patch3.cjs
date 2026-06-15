const fs = require('fs');
let content = fs.readFileSync('src/context/FoodBridgeContext.tsx', 'utf-8');

content = content.replace(
  /const addNotificationGlobal = \([\s\S]*?\n  \};/,
  `const addNotificationGlobal = (title: string, message: string, type: 'info' | 'success' | 'alert' | 'urgent') => {
    // We post to backend if we have a current user
    if (currentUser) {
      fetch(\`\${API_URL}/notifications\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, message: \`\${title}: \${message}\` })
      }).catch(console.error);
    }
    
    // Also update locally immediately for snappy UI
    const newNotif: AppNotification = {
      id: \`notif_\${Date.now()}\`,
      title,
      message,
      time: 'Just Now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };`
);

fs.writeFileSync('src/context/FoodBridgeContext.tsx', content, 'utf-8');
console.log('patched addNotificationGlobal');
