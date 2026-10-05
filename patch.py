import re

with open('src/components/auth/LoginView.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace handleVerifyOtp
code = re.sub(
    r'const handleVerifyOtp =.*?setAuthError\(null\);.*?setIsLoading\(true\);.*?setTimeout\(\(\) => \{.*?\}, 600\);\s*\};',
    '''const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(citizenPhone, citizenOtp, 'citizen');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed.');
  };''',
    code, flags=re.DOTALL
)

# Replace handleStaffSubmit
code = re.sub(
    r'const handleStaffSubmit =.*?setAuthError\(null\);.*?setIsLoading\(true\);.*?setTimeout\(\(\) => \{.*?\}, 600\);\s*\};',
    '''const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(staffId, staffPassword, 'staff');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed.');
  };''',
    code, flags=re.DOTALL
)

# Replace handleAdminSubmit
code = re.sub(
    r'const handleAdminSubmit =.*?setAuthError\(null\);.*?setIsLoading\(true\);.*?setTimeout\(\(\) => \{.*?\}, 600\);\s*\};',
    '''const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(adminIdentifier, adminPassword, 'admin');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed.');
  };''',
    code, flags=re.DOTALL
)

# Replace handlePresetSelect
code = re.sub(
    r'const handlePresetSelect =.*?setIsLoading\(true\);.*?setTimeout\(\(\) => \{.*?\}, 600\);\s*\};',
    '''const handlePresetSelect = async (account: UserAccount) => {
    setAuthError(null);
    setIsLoading(true);
    const pass = account.password || account.otpCode || 'password123';
    const success = await signIn(account.email || account.identifier, pass, 'citizen');
    setIsLoading(false);
    if (!success) setAuthError('Preset login failed.');
  };''',
    code, flags=re.DOTALL
)

with open('src/components/auth/LoginView.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("LoginView patched")
