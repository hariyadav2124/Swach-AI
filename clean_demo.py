import re

with open('src/components/auth/LoginView.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Remove DEMO_PRESETS import
code = re.sub(r"import \{ DEMO_PRESETS \} from '../../data/mockAccounts';\n", '', code)

# Clear default credentials
code = re.sub(r"useState<string>\('\+91 9876543210'\)", "useState<string>('')", code)
code = re.sub(r"useState<string>\('CW-1048'\)", "useState<string>('')", code)
code = re.sub(r"useState<string>\('demo123'\)", "useState<string>('')", code)
code = re.sub(r"useState<string>\('ADM-0014'\)", "useState<string>('')", code)
code = re.sub(r"useState<string>\('admin123'\)", "useState<string>('')", code)

# Remove the fast pass section completely
# It's at the end of the form area
# We can just remove everything from `{/* REVIEWER FAST-PASS BAR (VC & MUNICIPAL DEMO SHORTCUT) */}`
# up to `</div>\n\n          {/* Footer note */}`
code = re.sub(
    r"\{\/\* REVIEWER FAST-PASS BAR.*?\n\s+</div>\s+</div>\n\n\s+\{\/\* Footer note",
    "</div>\n\n          {/* Footer note",
    code, flags=re.DOTALL
)

# Remove the "Fill Admin Demo" button
code = re.sub(
    r"<button\s+type=\"button\"\s+onClick=\{.*?\).*?Fill Admin Demo.*?</button>",
    "",
    code, flags=re.DOTALL
)
code = re.sub(
    r"<button\s+type=\"button\"\s+onClick=\{.*?\).*?Fill CW-1048.*?</button>",
    "",
    code, flags=re.DOTALL
)
code = re.sub(
    r"<button\s+type=\"button\"\s+onClick=\{.*?\).*?Fill SW-2031.*?</button>",
    "",
    code, flags=re.DOTALL
)
code = re.sub(
    r"<span className=\"text-\[11px\] text-neutral-400\">Default: admin123</span>",
    "",
    code
)
code = re.sub(
    r"<span className=\"text-\[11px\] text-neutral-400\">Default: demo123</span>",
    "",
    code
)

# Also clear preset references in TS if they exist
code = re.sub(
    r"const handlePresetSelect = async.*?};\n",
    "",
    code, flags=re.DOTALL
)

with open('src/components/auth/LoginView.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Demo references removed from LoginView.tsx")
