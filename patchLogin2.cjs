const fs = require('fs');

let code = fs.readFileSync('src/components/auth/LoginView.tsx', 'utf8');

// The original file still has authenticateCitizen calls. Let's find and replace the functions.
code = code.replace(
  /const result: AuthResult = authenticateCitizen\(citizenPhone, citizenOtp\);/,
  "// Replaced by useAuth signIn\n      const success = false; // Replaced"
);
code = code.replace(
  /const result: AuthResult = authenticateStaff\(staffId, staffPassword\);/,
  "// Replaced"
);
code = code.replace(
  /const result: AuthResult = authenticateAdmin\(adminIdentifier, adminPassword\);/,
  "// Replaced"
);
code = code.replace(
  /const session = createSessionFromAccount\(account\);/,
  "// Replaced"
);

// Actually, let's just replace the entire handle functions with the proper logic since the regex failed last time.
code = code.replace(
  /const handleVerifyOtp =.*?setAuthError\(null\).*?setIsLoading\(true\).*?setTimeout\(\(\) => \{.*?\}, 600\);\n  \};/s,
  `const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(citizenPhone, citizenOtp, 'citizen');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed.');
  };`
);

code = code.replace(
  /const handleStaffSubmit =.*?setAuthError\(null\).*?setIsLoading\(true\).*?setTimeout\(\(\) => \{.*?\}, 600\);\n  \};/s,
  `const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(staffId, staffPassword, 'staff');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed.');
  };`
);

code = code.replace(
  /const handleAdminSubmit =.*?setAuthError\(null\).*?setIsLoading\(true\).*?setTimeout\(\(\) => \{.*?\}, 600\);\n  \};/s,
  `const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(adminIdentifier, adminPassword, 'admin');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed.');
  };`
);

code = code.replace(
  /const handlePresetSelect =.*?setIsLoading\(true\).*?setTimeout\(\(\) => \{.*?\}, 600\);\n  \};/s,
  `const handlePresetSelect = async (account: UserAccount) => {
    setAuthError(null);
    setIsLoading(true);
    const pass = account.password || account.otpCode || 'password123';
    const success = await signIn(account.email || account.identifier, pass, 'citizen');
    setIsLoading(false);
    if (!success) setAuthError('Preset login failed.');
  };`
);

// Check if signIn exists. If not, add const { signIn } = useAuth();
if (!code.includes('const { signIn } = useAuth();')) {
  code = code.replace(
    /const \[activeChannel, setActiveChannel\] = useState<AccessChannel>\('citizen'\);/,
    "const { signIn } = useAuth();\n  const [activeChannel, setActiveChannel] = useState<AccessChannel>('citizen');"
  );
}

fs.writeFileSync('src/components/auth/LoginView.tsx', code);
