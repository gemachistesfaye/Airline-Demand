\# Contributing to AeroDemand AI



Thank you for your interest in contributing to \*\*AeroDemand AI\*\*! 🛫



This is a university academic project but we welcome improvements, bug fixes

and suggestions from the community.



\---



\## 🐛 Reporting Bugs



Before reporting a bug, please:

1\. Check the \[existing issues](https://github.com/gemachistesfaye/AeroDemand-AI/issues) to avoid duplicates

2\. Make sure the backend server is running (`python backend/train.py` then `python backend/app.py`)

3\. Check the browser console for errors



When reporting, please include:

\- Your operating system and Python version

\- Steps to reproduce the bug

\- What you expected to happen

\- What actually happened

\- Any error messages or screenshots



\---



\## 💡 Suggesting Features



Open an issue with the label `enhancement` and describe:

\- What problem it solves

\- How it should work

\- Any examples or mockups



\---



\## 🔧 Making Changes



\### Setup



```bash

\# Fork the repo, then clone your fork

git clone https://github.com/YOUR-USERNAME/AeroDemand-AI.git

cd AeroDemand-AI



\# Create a virtual environment

python -m venv venv

source venv/bin/activate  # Mac/Linux

venv\\Scripts\\activate     # Windows



\# Install dependencies

pip install -r requirements.txt



\# Train the model first

python backend/train.py



\# Start the server

python backend/app.py

```



\### Workflow



```bash

\# Create a new branch for your change

git checkout -b fix/your-fix-name



\# Make your changes

\# ...



\# Commit with a clear message

git commit -m "Fix: description of what you fixed"



\# Push and open a Pull Request

git push origin fix/your-fix-name

```



\---



\## 📋 Code Style



\- \*\*Python:\*\* follow PEP 8, use descriptive variable names

\- \*\*JavaScript:\*\* use `const`/`let`, async/await, add comments for complex logic

\- \*\*HTML:\*\* keep Tailwind classes readable, one attribute per line for long tags

\- \*\*Commits:\*\* use prefixes — `Fix:`, `Feat:`, `Docs:`, `Refactor:`



\---



\## 🏗️ Project Structure



| File | What to know before editing |

|---|---|

| `backend/train.py` | Re-run after any feature changes to regenerate `model.pkl` |

| `backend/app.py` | Feature list in `features` must match `train.py` exactly |

| `frontend/js/app.js` | API response keys must match what `app.py` returns |

| `frontend/index.html` | Element IDs must match what `app.js` queries |



\---



\## ✅ Pull Request Checklist



Before submitting a PR, make sure:



\- \[ ] `python backend/train.py` runs without errors

\- \[ ] `python backend/app.py` starts without errors

\- \[ ] The dashboard loads at `http://localhost:5000`

\- \[ ] Predictions work on the Predictions page

\- \[ ] Analytics charts load correctly

\- \[ ] No `console.error` in the browser on page load



\---



Thank you for helping make AeroDemand AI better! 🙏

