#!/bin/bash

echo "Adding missing environment variables to Vercel..."

# Add DB_PORT
echo "5432" | npx vercel env add DB_PORT production

# Add DB_NAME  
echo "neondb" | npx vercel env add DB_NAME production

# Add DB_USER
echo "neondb_owner" | npx vercel env add DB_USER production

# Add DB_PASS (sensitive)
printf "npg_7Ngrox9UiFKw" | npx vercel env add DB_PASS production

# Add JWT_SECRET (sensitive)
printf "your-super-secret-jwt-key-change-this-in-production" | npx vercel env add JWT_SECRET production

echo "✅ All environment variables added!"
echo "Now redeploy: npx vercel --prod"
