git init
git add .
git commit -m "Initial commit: DevPulse React app"

Write-Host "Checking GitHub CLI..."
gh repo create devpulse-react-app --public --source=. --remote=origin --push

Write-Host "Deploying to Vercel..."
npx vercel --prod --yes
