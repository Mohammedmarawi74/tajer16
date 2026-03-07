<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1oFbkjKGzhFnUqEbq3CCWTCyMRlN7oKYi

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment to Vercel

To deploy this project to Vercel:

1. Connect your GitHub repository to Vercel.
2. In the project settings, go to **Environment Variables**.
3. Add a new variable named `GEMINI_API_KEY` with your actual API key as the value.
4. Click **Deploy**.

Vercel will automatically detect the Vite configuration and build your app.
