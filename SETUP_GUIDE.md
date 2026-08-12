# 🚀 Quick Start Guide - Medico Overseas Callback System

## What's Been Set Up?

✅ **Frontend**: Callback form with form submission to backend API
✅ **Backend**: Node.js/Express server with SQLite database
✅ **Dashboard**: Admin panel to view all callback requests
✅ **Database**: Automatic storage of all submitted callbacks

---

## 📋 Step-by-Step Setup

### Step 1: Install Node.js
Download and install Node.js from: https://nodejs.org/
- Choose LTS version
- Verify installation by running in terminal: `node -v`

### Step 2: Open Terminal in Backend Folder
```bash
# Navigate to the backend folder
cd "c:\Users\gadda\Downloads\VERY\VERY\NONE - Copy\RAMP\medico-overseas-sponsor-ready-v41\backend"
```

### Step 3: Install Dependencies
```bash
npm install
```
This will install all required packages (Express, SQLite, CORS, etc.)

### Step 4: Start the Backend Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🏥 MEDICO OVERSEAS BACKEND SERVER                       ║
║                                                            ║
║    Server running at: http://localhost:3001               ║
║    ...
╚════════════════════════════════════════════════════════════╝
```

### Step 5: Test the Backend
Open your browser and go to:
- **Health Check**: http://localhost:3001/api/health
- **View Callbacks**: http://localhost:3001/api/callbacks

### Step 6: Open the Website
Open the HTML file in a browser:
```
c:\Users\gadda\Downloads\VERY\VERY\NONE - Copy\RAMP\medico-overseas-sponsor-ready-v41\index.html
```

Or use a local web server (recommended):
- Install Python: https://www.python.org/
- Run in the project directory:
  ```bash
  python -m http.server 8000
  ```
- Then open: http://localhost:8000

### Step 7: Test the Callback Form
1. Scroll down to "Check your MBBS abroad eligibility" section
2. Fill in the form:
   - Full Name: Any name
   - Phone: Any number (e.g., +919876543210)
   - Other fields optional
3. Click "Request a callback →"
4. You should see a success message: "✓ Thank you! We'll contact you soon."

### Step 8: View Stored Data
Open the admin dashboard:
```
c:\Users\gadda\Downloads\VERY\VERY\NONE - Copy\RAMP\medico-overseas-sponsor-ready-v41\backend\dashboard.html
```

Or access it via:
```
file:///c:/Users/gadda/Downloads/VERY/VERY/NONE%20-%20Copy/RAMP/medico-overseas-sponsor-ready-v41/backend/dashboard.html
```

---

## 📁 Project Structure

```
medico-overseas-sponsor-ready-v41/
├── index.html (Main website - UPDATED with form)
├── assets/
│   ├── styles.css
│   ├── script.js
│   └── ...
├── backend/
│   ├── server.js (Main server file)
│   ├── database.js (Database setup)
│   ├── package.json (Dependencies)
│   ├── .env (Configuration)
│   ├── dashboard.html (Admin dashboard)
│   ├── callbacks.db (Database file - auto-created)
│   ├── README.md (Documentation)
│   └── .gitignore
└── ... (other files)
```

---

## 🔌 API Endpoints

### Submit Callback
```
POST http://localhost:3001/api/callback
Content-Type: application/json

{
  "fullName": "Student Name",
  "phone": "+91XXXXXXXXXX",
  "email": "student@example.com",
  "city": "Mumbai",
  "country": "Russia",
  "neetScore": "650",
  "message": "Message"
}
```

### Get All Callbacks
```
GET http://localhost:3001/api/callbacks
```

### Update Callback Status
```
PUT http://localhost:3001/api/callbacks/:id
Content-Type: application/json

{
  "status": "contacted"
}
```

### Health Check
```
GET http://localhost:3001/api/health
```

---

## ⚠️ Troubleshooting

### Error: "Cannot find module 'express'"
**Solution**: Run `npm install` in the backend folder

### Error: "Port 3001 already in use"
**Solution**: 
- Edit `backend/.env` and change PORT to 3002
- Or close other applications using port 3001

### Error: "Cannot connect to backend"
**Solution**:
- Make sure backend server is running (`npm start`)
- Check that port 3001 is accessible
- Check browser console (F12) for errors

### Database file not found
**Solution**: 
- Run the server once, it will auto-create the database
- Check the backend folder for `callbacks.db` file

### CORS Error in browser
**Solution**: This is normal for local development
- Backend is already configured to accept requests
- The form should work if following all steps

---

## 🎯 Next Steps

1. **Email Notifications**: Add email alerts when callbacks are received
2. **Database Upgrade**: Switch from SQLite to MySQL or MongoDB for production
3. **Authentication**: Add login for admin dashboard
4. **Validation**: Add server-side validation for form data
5. **Export**: Export callbacks to Excel or CSV
6. **CRM Integration**: Connect with CRM systems
7. **Analytics**: Track callback statistics and trends

---

## 📞 Support

If you encounter any issues:
1. Check the error message in terminal/console
2. Review the README.md in backend folder
3. Check the browser's Developer Console (F12)
4. Make sure all ports are available and Node.js is properly installed

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server running (`npm start`)
- [ ] Website accessible in browser
- [ ] Form submission works
- [ ] Dashboard loads and shows callbacks
- [ ] Database file created (`callbacks.db`)

Once all checks are complete, your system is ready to receive callback requests! 🎉

