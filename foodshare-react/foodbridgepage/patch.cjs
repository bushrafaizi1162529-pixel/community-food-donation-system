const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'context', 'FoodBridgeContext.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add API_URL at the top of the provider
content = content.replace(
  '// Persistence',
  'const API_URL = "http://localhost:5000";\n\n  // Persistence'
);

// 2. Replace users useState
content = content.replace(
  /const \[users, setUsers\] = useState<UserProfile\[\]>\(\(\) => \{[\s\S]*?\}\);/,
  `const [users, setUsers] = useState<UserProfile[]>(defaultUsers);`
);

// 3. Replace donations useState
content = content.replace(
  /const \[donations, setDonations\] = useState<FoodDonation\[\]>\(\(\) => \{[\s\S]*?\}\);/,
  `const [donations, setDonations] = useState<FoodDonation[]>(defaultDonations);`
);

// 4. Replace notifications useState
content = content.replace(
  /const \[notifications, setNotifications\] = useState<AppNotification\[\]>\(\(\) => \{[\s\S]*?\}\);/,
  `const [notifications, setNotifications] = useState<AppNotification[]>(defaultNotifications);`
);

// 5. Add data fetching useEffect after notifications
content = content.replace(
  /const \[foodSavedToday, setFoodSavedToday\] = useState<number>\(318\);/,
  `const [foodSavedToday, setFoodSavedToday] = useState<number>(318);

  const fetchData = async () => {
    try {
      const usersRes = await fetch(\`\${API_URL}/users\`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.map((u: any) => ({
          ...u,
          address: u.address || '',
          donorType: u.donor_type || 'individual',
          ngoRegId: u.ngo_reg_id || '',
          isVerified: u.is_verified || false,
          points: u.points || 100,
          badges: u.badges || [],
          joinedDate: u.created_at || new Date().toISOString()
        })));
      }

      const foodRes = await fetch(\`\${API_URL}/food\`);
      if (foodRes.ok) {
        const foodData = await foodRes.json();
        setDonations(foodData.map((f: any) => ({
          ...f,
          donorId: f.donor_id,
          donorName: f.donor_name || 'Anonymous',
          donorType: 'individual',
          title: f.food_name || 'Food Donation',
          category: f.category || 'cooked',
          quantityValue: parseInt(f.quantity) || 10,
          expiryTime: f.expiry_time || new Date().toISOString(),
          expiryHours: 12,
          lat: f.latitude || 17.3850,
          lng: f.longitude || 78.4867,
          instructions: f.description || '',
          imageUrl: f.image_url || 'https://images.unsplash.com/photo-1488459711615-4f4047a0fc91?w=600&auto=format&fit=crop&q=80',
          createdAt: f.created_at || new Date().toISOString(),
          claimedByNgoId: f.assigned_ngo_id,
          claimedByNgoName: f.assigned_ngo_name,
          pickupTime: f.pickup_time
        })));
      }
    } catch (error) {
      console.error("Failed to fetch from backend", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
`
);

// 6. Rewrite registerDonor
content = content.replace(
  /const registerDonor = \((.*?)\): UserProfile => \{([\s\S]*?return newUser;\n  \};)/,
  `const registerDonor = (name: string, email: string, phone: string, address: string, type: DonorType): UserProfile => {
    fetch(\`\${API_URL}/register\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, role: 'donor' })
    }).then(() => fetchData()).catch(console.error);

    const newUser: UserProfile = {
      id: \`donor_\${Date.now()}\`,
      name, email, phone, address, role: 'donor', donorType: type,
      points: 100, badges: ['First Responder Badge'], joinedDate: new Date().toISOString(),
      avatarUrl: \`https://images.unsplash.com/photo-\${1500000000000 + Math.floor(Math.random() * 900000)}?w=150&auto=format&fit=crop&q=80\`
    };
    setCurrentUser(newUser);
    addNotificationGlobal('Account Created Successfully', \`Welcome \${name}! Setup completed as \${type}.\`, 'success');
    return newUser;
  };`
);

// 7. Rewrite registerNgo
content = content.replace(
  /const registerNgo = \((.*?)\): UserProfile => \{([\s\S]*?return newUser;\n  \};)/,
  `const registerNgo = (name: string, email: string, phone: string, address: string, regId: string): UserProfile => {
    fetch(\`\${API_URL}/register\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, role: 'ngo' })
    }).then(() => fetchData()).catch(console.error);

    const newUser: UserProfile = {
      id: \`ngo_\${Date.now()}\`,
      name, email, phone, address, role: 'ngo', ngoRegId: regId, isVerified: false,
      points: 100, badges: ['Alliance Built Badge'], joinedDate: new Date().toISOString(),
      avatarUrl: \`https://images.unsplash.com/photo-\${1500000000000 + Math.floor(Math.random() * 900000)}?w=150&auto=format&fit=crop&q=80\`
    };
    setCurrentUser(newUser);
    addNotificationGlobal('NGO Application Received', \`Welcome \${name}! Your certificate is pending clearance.\`, 'info');
    return newUser;
  };`
);

// 8. Rewrite createDonation
content = content.replace(
  /const createDonation = \([\s\S]*?imageUrl\?: string\n  \) => \{[\s\S]*?addNotificationGlobal\([\s\S]*?'urgent'\n    \);\n  \};/,
  `const createDonation = (
    title: string, category: FoodCategory, quantity: string, quantityValue: number, 
    expiryHours: number, location: string, instructions: string, imageUrl?: string
  ) => {
    if (!currentUser) return;
    const payload = {
      food_name: title,
      category,
      quantity,
      description: instructions,
      expiry_time: new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString(),
      location,
      latitude: 17.3850 + (Math.random() - 0.5) * 0.2,
      longitude: 78.4867 + (Math.random() - 0.5) * 0.2,
      donor_id: currentUser.id,
      donor_name: currentUser.name,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1488459711615-4f4047a0fc91?w=600&auto=format&fit=crop&q=80'
    };
    
    fetch(\`\${API_URL}/food\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => fetchData()).catch(console.error);

    addNotificationGlobal('New Cargo Posted', \`\${currentUser.name} has posted \${quantity} of food.\`, 'urgent');
  };`
);

// 9. Rewrite claimDonation
content = content.replace(
  /const claimDonation = \([\s\S]*?\n  \};/,
  `const claimDonation = (donationId: string, pickupTime?: string) => {
    if (!currentUser || currentUser.role !== 'ngo') return;
    
    fetch(\`\${API_URL}/pickup\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food_id: donationId, ngo_id: currentUser.id })
    }).catch(console.error);

    fetch(\`\${API_URL}/food/\${donationId}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        status: 'claimed', 
        assigned_ngo_id: currentUser.id,
        assigned_ngo_name: currentUser.name,
        pickup_time: pickupTime || 'As soon as possible'
      })
    }).then(() => fetchData()).catch(console.error);

    addNotificationGlobal('Donation Cargo Claimed', \`Claimed successfully.\`, 'success');
  };`
);

// 10. Rewrite updateDonationStatus
content = content.replace(
  /const updateDonationStatus = \([\s\S]*?\n  \};/,
  `const updateDonationStatus = (donationId: string, status: DonationStatus) => {
    fetch(\`\${API_URL}/food/\${donationId}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => fetchData()).catch(console.error);
  };`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully patched FoodBridgeContext.tsx');
