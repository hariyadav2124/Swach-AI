import re
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r"import \{\s*MOCK_ACCOUNTS.*?\}.*?mockAccounts';\n", "", code, flags=re.DOTALL)
# Also remove MOCK_ACCOUNTS from any other spots
code = re.sub(r"MOCK_ACCOUNTS\[\d+\]", "null", code)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

with open('src/components/auth/AuthBanner.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r"import \{.*?MOCK_ACCOUNTS.*?\}.*?mockAccounts';", "", code, flags=re.DOTALL)
with open('src/components/auth/AuthBanner.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
