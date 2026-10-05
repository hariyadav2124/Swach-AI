import re

with open('src/components/auth/LoginView.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace handleStaffSubmit entirely
code = re.sub(
    r'const handleStaffSubmit =.*?\}, 550\);\n  \};',
    '''const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(staffId, staffPassword, 'staff');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please check your credentials.');
  };''',
    code, flags=re.DOTALL
)

# Replace handleAdminSubmit entirely
code = re.sub(
    r'const handleAdminSubmit =.*?\}, 550\);\n  \};',
    '''const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(adminIdentifier, adminPassword, 'admin');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please check your credentials.');
  };''',
    code, flags=re.DOTALL
)

# Fix handlePresetSelect which got broken at the end
code = re.sub(
    r'const handlePresetSelect =.*?\n\s*// Replaced.*?(?=\n\s*return \()',
    '''const handlePresetSelect = async (account: UserAccount) => {
    setAuthError(null);
    setIsLoading(true);
    setAuthSuccessMsg(`Authenticating ${account.name}...`);
    
    const pass = account.password || account.otpCode || 'password123';
    const success = await signIn(account.email || account.identifier, pass, 'citizen');
    setIsLoading(false);
    if (!success) {
      setAuthSuccessMsg(null);
      setAuthError('Preset login failed.');
    }
  };\n''',
    code, flags=re.DOTALL
)

with open('src/components/auth/LoginView.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
