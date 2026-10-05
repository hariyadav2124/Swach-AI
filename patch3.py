import re

with open('src/components/auth/LoginView.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

def replace_block(pattern, replacement):
    global code
    code = re.sub(pattern, replacement, code, flags=re.DOTALL)

replace_block(
    r'const handleVerifyOtp =.*?setTimeout\(\(\) => \{.*?\}, 500\);\n  \};',
    '''const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(citizenPhone, citizenOtp, 'citizen');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please verify your OTP code.');
  };'''
)

replace_block(
    r'const handleStaffSubmit =.*?setTimeout\(\(\) => \{.*?\}, 600\);\n  \};',
    '''const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(staffId, staffPassword, 'staff');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please check your credentials.');
  };'''
)

replace_block(
    r'const handleAdminSubmit =.*?setTimeout\(\(\) => \{.*?\}, 600\);\n  \};',
    '''const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const success = await signIn(adminIdentifier, adminPassword, 'admin');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed. Please check your credentials.');
  };'''
)

replace_block(
    r'const handlePresetSelect =.*?setTimeout\(\(\) => \{.*?\}, 600\);\n  \};',
    '''const handlePresetSelect = async (account: UserAccount) => {
    setAuthError(null);
    setIsLoading(true);
    const pass = account.password || account.otpCode || 'password123';
    const success = await signIn(account.email || account.identifier, pass, 'citizen');
    setIsLoading(false);
    if (!success) setAuthError('Authentication failed.');
  };'''
)

with open('src/components/auth/LoginView.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("LoginView patched again")
