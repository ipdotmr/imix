#!/bin/bash

cat > /www/wwwroot/imix/imix/frontend/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iMix CRM by IPROD</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      color: white;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    h1 {
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 2rem;
    }
    .logo {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .features {
      text-align: left;
      margin: 1.5rem 0;
    }
    .features li {
      margin-bottom: 0.5rem;
    }
    .footer {
      font-size: 0.8rem;
      margin-top: 2rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">📱</div>
    <h1>iMix CRM by IPROD</h1>
    <p>WhatsApp Business API Platform</p>
    <div class="features">
      <h3>Coming Soon:</h3>
      <ul>
        <li>Multi-tenant WhatsApp business management</li>
        <li>Advanced contact organization</li>
        <li>AI-powered conversation assistant</li>
        <li>Automated chat flows</li>
        <li>Comprehensive analytics</li>
      </ul>
    </div>
    <p>Our platform is currently under development and will be available soon.</p>
    <div class="footer">© 2024 IPROD - All Rights Reserved</div>
  </div>
</body>
</html>
EOF

chmod 644 /www/wwwroot/imix/imix/frontend/dist/index.html
chown www-data:www-data /www/wwwroot/imix/imix/frontend/dist/index.html

find /www/wwwroot/imix -name ".env" -type f -exec grep -l "api.imix.ip.mr" {} \; | xargs -r sed -i 's/api\.imix\.ip\.mr/apimix\.ip\.mr/g'

find /www/wwwroot/imix -type f -name "*.conf" -exec grep -l "api.imix.ip.mr" {} \; | xargs -r sed -i 's/api\.imix\.ip\.mr/apimix\.ip\.mr/g'

mkdir -p /www/wwwroot/imix/imix/frontend
cat > /www/wwwroot/imix/imix/frontend/.env << 'EOF'
VITE_API_URL=https://apimix.ip.mr
EOF

supervisorctl restart imix-backend

echo "Checking backend service status..."
supervisorctl status imix-backend
echo "Checking if port 8000 is bound..."
netstat -tulpn | grep 8000

echo "Domain update complete. Please verify the following:"
echo "1. Create a new DNS record in Cloudflare for apimix.ip.mr"
echo "2. Create a new website in aaPanel for apimix.ip.mr"
echo "3. Set up the proxy configuration to point to localhost:8000"
echo "4. Set up SSL certificate for the new domain"
echo "5. Test the API health endpoint: curl -L https://apimix.ip.mr/healthz"
echo "6. Verify the frontend is displaying properly: https://imix.ip.mr"
