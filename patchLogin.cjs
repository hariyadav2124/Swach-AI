const fs = require('fs');

let code = fs.readFileSync('src/components/auth/LoginView.tsx', 'utf8');

code = code.replace(
  "import { \n  authenticateCitizen, \n  authenticateStaff, \n  authenticateAdmin, \n  DEMO_PRESETS,\n  createSessionFromAccount \n} from '../../data/mockAccounts';",
  "import { DEMO_PRESETS } from '../../data/mockAccounts';\nimport { useAuth } from '../../context/AuthContext';"
);

// Replace handleVerifyOtp
code = code.replace(
  /const handleVerifyOtp =.*?setAuthError\(null\);\n    setIsLoading\(true\);\n\n    setTimeout\(\(\) => \{.*?\n        \}\n      \} else \{.*?\n      \}\n    \}, 600\);\n  \};/s,
  `const { signIn } = useAuth();\n  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    
    const success = await signIn(citizenPhone, citizenOtp, 'citizen');
    setIsLoading(false);
    if (!success) {
      setAuthError('Authentication failed. Please check your credentials.');
    }
  };`
);

// Replace handleStaffSubmit
code = code.replace(
  /const handleStaffSubmit =.*?setAuthError\(null\);\n    setIsLoading\(true\);\n\n    setTimeout\(\(\) => \{.*?\n        \}\n      \} else \{.*?\n      \}\n    \}, 600\);\n  \};/s,
  `const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    const success = await signIn(staffId, staffPassword, 'staff');
    setIsLoading(false);
    if (!success) {
      setAuthError('Authentication failed. Please check your staff ID and password.');
    }
  };`
);

// Replace handleAdminSubmit
code = code.replace(
  /const handleAdminSubmit =.*?setAuthError\(null\);\n    setIsLoading\(true\);\n\n    setTimeout\(\(\) => \{.*?\n        \}\n      \} else \{.*?\n      \}\n    \}, 600\);\n  \};/s,
  `const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    const success = await signIn(adminIdentifier, adminPassword, 'admin');
    setIsLoading(false);
    if (!success) {
      setAuthError('Authentication failed. Please check your admin credentials.');
    }
  };`
);

// Replace handlePresetSelect
code = code.replace(
  /const handlePresetSelect =.*?onLoginSuccess\(session\);\n    \}, 600\);\n  \};/s,
  `const handlePresetSelect = async (account: UserAccount) => {
    setAuthError(null);
    setIsLoading(true);
    
    // Attempt to log in with the account's credentials
    const passOrOtp = account.password || account.otpCode || 'password123';
    const success = await signIn(account.email || account.identifier, passOrOtp, 'citizen');
    setIsLoading(false);
    if (!success) {
      setAuthError('Preset login failed. Please ensure the user exists in Supabase Auth.');
    }
  };`
);

fs.writeFileSync('src/components/auth/LoginView.tsx', code);
console.log('LoginView.tsx patched successfully.');
