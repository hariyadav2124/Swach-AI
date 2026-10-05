const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Auth logic
const authReplacement = `
  const { session, signOut: handleSignOut } = useAuth();
  
  useEffect(() => {
    if (session) {
      binService.getBins().then(setBins).catch(console.error);
      reportService.getRequests().then(setRequests).catch(console.error);
      
      const unsubscribeBins = binService.subscribeToBins(() => {
        binService.getBins().then(setBins);
      });
      const unsubscribeReqs = reportService.subscribeToRequests(() => {
        reportService.getRequests().then(setRequests);
      });
      
      return () => {
        unsubscribeBins.unsubscribe();
        unsubscribeReqs.unsubscribe();
      };
    }
  }, [session]);
`;

code = code.replace(
  /const \[session, setSession\] = useState.*?handleSignOut = \(\) => \{.*?\};\n/s,
  authReplacement
);

code = code.replace(
  /import React, \{ useState, useMemo \} from 'react';/,
  "import React, { useState, useMemo, useEffect } from 'react';\nimport { useAuth } from './context/AuthContext';\nimport { binService } from './services/binService';\nimport { reportService } from './services/reportService';"
);

code = code.replace(
  /<LoginView onLoginSuccess=\{handleLoginSuccess\} \/>/,
  "<LoginView />"
);

// We need to fix LoginView interface inside App.tsx (it expects onLoginSuccess) but we can just pass an empty func to avoid TS error
code = code.replace(
  /<LoginView \/>/,
  "<LoginView onLoginSuccess={() => {}} />"
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched successfully.');
