const fs = require('fs');
let content = fs.readFileSync('src/context/FoodBridgeContext.tsx', 'utf-8');

content = content.replace(
  /const approveNgo = \([\s\S]*?\n  \};/,
  `const approveNgo = (ngoId: string) => {
    fetch(\`\${API_URL}/users/\${ngoId}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_verified: true })
    }).then(() => fetchData()).catch(console.error);

    if (currentUser && currentUser.id === ngoId) {
      setCurrentUser(prev => prev ? { ...prev, isVerified: true } : null);
    }
    addNotificationGlobal('NGO Verification Certified', 'NGO approved successfully.', 'success');
  };`
);

content = content.replace(
  /const rejectNgo = \([\s\S]*?\n  \};/,
  `const rejectNgo = (ngoId: string) => {
    fetch(\`\${API_URL}/users/\${ngoId}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_verified: false })
    }).then(() => fetchData()).catch(console.error);
    addNotificationGlobal('NGO Verification Rejected', 'NGO rejected successfully.', 'alert');
  };`
);

fs.writeFileSync('src/context/FoodBridgeContext.tsx', content, 'utf-8');
console.log('patched approve/reject');
