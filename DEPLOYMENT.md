# Deployment Guide

## Backend Deployment (Render)

1. **Create MongoDB Atlas Database** (Free tier)
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

2. **Deploy to Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: taskflow-backend
     - **Root Directory**: server
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Generate a random secret key
     - `PORT`: 5000

3. **Copy your backend URL** (e.g., https://taskflow-backend.onrender.com)

## Frontend Deployment (Netlify)

1. **Update Client Environment**
   - Create `client/.env.production`:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure:
     - **Base directory**: client
     - **Build command**: npm run build
     - **Publish directory**: client/build
   - Add Environment Variable:
     - `REACT_APP_API_URL`: https://your-backend-url.onrender.com/api

3. **Deploy!**

## Alternative: Deploy Both on Render

You can deploy both frontend and backend on Render:

**Backend**: Follow steps above

**Frontend**:
- New → Static Site
- Root Directory: client
- Build Command: `npm run build`
- Publish Directory: `build`
- Environment Variable: `REACT_APP_API_URL`

## Quick Commands

Push to GitHub:
```bash
git add .
git commit -m "Add deployment configuration"
git push
```
