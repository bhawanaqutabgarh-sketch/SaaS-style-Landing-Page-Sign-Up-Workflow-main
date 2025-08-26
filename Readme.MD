# SaaS Landing + Signup (email verification)

## Prereqs
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- SMTP credentials (Gmail App Password or other SMTP)

## Setup
1. Clone/copy project.
2. `cd saas-landing`
3. `npm install`
4. Copy `.env.example` to `.env` and fill values (MONGO_URI, SMTP_* etc.)
5. Start MongoDB or ensure Atlas is reachable.

## Run
- Development: `npm run dev`  (requires nodemon)
- Production: `npm start`

Visit `http://localhost:5000/` to see landing page. Fill sign-up -> check email -> click verification link -> redirected to thankyou.

## Notes
- Change `BASE_URL` in `.env` to the publicly reachable URL when deploying (eg. `https://myapp.example.com`).
- Use secure SMTP credentials in production and always keep secrets out of source code.
