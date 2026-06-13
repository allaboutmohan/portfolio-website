# Mohanraj's Portfolio Website

A complete, aesthetic, professional portfolio website built with Django and designed for Vercel deployment. 
Features a dark & moody aesthetic with neon accents, scroll-triggered animations, and a responsive design.

## Deployment Steps (Vercel)

1. **Install Dependencies (Local Testing)**
   ```bash
   pip install -r requirements.txt
   ```

2. **Collect Static Files**
   ```bash
   python manage.py collectstatic
   ```

3. **Push to GitHub**
   Commit all files (including the generated `staticfiles` directory if preferred, though Vercel can run build steps if configured) and push to a new GitHub repository.

4. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com/) -> New Project
   - Import your GitHub repository.
   - Vercel will automatically detect the `vercel.json` file for routing.

5. **Environment Variables**
   Set the following Environment Variables in your Vercel project settings:
   - `SECRET_KEY` = `your-secure-secret-key-here`
   - `DEBUG` = `False`

6. **Deploy!**
   Click Deploy. Vercel will build and host your Django portfolio.

## Tech Stack
- Python / Django
- HTML5 / CSS3 / Vanilla JavaScript
- WhiteNoise for Static File Serving
- Vercel Serverless Functions
