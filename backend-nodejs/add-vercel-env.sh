#!/bin/bash

# Script to add all environment variables to Vercel
# Run this from backend-nodejs directory

echo "Adding environment variables to Vercel..."

# DB_PORT
echo "ep-hidden-smoke-aft4i376.c-2.us-west-2.aws.neon.tech" | npx vercel env add DB_HOST production --yes

echo "5432" | npx vercel env add DB_PORT production --yes

echo "neondb" | npx vercel env add DB_NAME production --yes

echo "neondb_owner" | npx vercel env add DB_USER production --yes

echo "npg_7Ngrox9UiFKw" | npx vercel env add DB_PASS production --yes --sensitive

echo "your-super-secret-jwt-key-change-this-in-production" | npx vercel env add JWT_SECRET production --yes --sensitive

echo "✅ All environment variables added!"
echo "Now run: npx vercel --prod"
