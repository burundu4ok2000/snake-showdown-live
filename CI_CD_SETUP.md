# CI/CD Pipeline Setup

This project uses GitHub Actions for Continuous Integration and Continuous Deployment.
The pipeline is defined in `.github/workflows/ci-cd.yml`.

## 🔄 Workflow Overview

Every time you push to `main` or open a Pull Request:

1.  **Backend Tests**:
    *   Installs Python 3.12 and dependencies (`uv sync`).
    *   Runs unit and integration tests (`pytest`).
2.  **Frontend Tests**:
    *   Installs Node.js 20 and dependencies.
    *   Runs linting (`eslint`).
    *   Runs unit tests (`vitest`).
    *   Checks build validity (`vite build`).
3.  **Deploy (Only on push to `main`)**:
    *   Running ONLY if both test jobs pass.
    *   Triggers a deployment on Render via a Deploy Hook.

## ⚙️ Configuration Required

To verify tests before deploying, you must configure Render and GitHub:

### 1. Disable Auto-Deploy on Render
By default, Render deploys every push. To let GitHub Actions control the deployment:
1.  Go to your **Render Dashboard**.
2.  Select your **Web Service**.
3.  Go to **Settings**.
4.  Scroll down to **Auto-Deploy**.
5.  Set it to **No** (Disable).
6.  Click **Save Changes**.

### 2. Get the Deploy Hook URL
1.  In the same **Settings** page on Render.
2.  Scroll down to **Deploy Hook**.
3.  Copy the **Deploy Hook URL**. It looks like:
    `https://api.render.com/deploy/srv-xxxxxx?key=yyyyyy`

### 3. Add Key to GitHub Secrets
1.  Go to your GitHub Repository.
2.  Click **Settings** -> **Secrets and variables** -> **Actions**.
3.  Click **New repository secret**.
4.  **Name**: `RENDER_DEPLOY_HOOK_URL`
5.  **Value**: Paste the URL you copied from Render.
6.  Click **Add secret**.

## ✅ Verification
Next time you push code to `main`:
1.  Go to the **Actions** tab in GitHub.
2.  You will see the pipeline running.
3.  If tests fail ❌, Render will **NOT** deploy.
4.  If tests pass ✅, the "Deploy to Render" job will run and trigger the update.
