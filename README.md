# 🌸 CareMaa – Full Stack Health Platform

CareMaa is a full-stack health platform built using **React, Node.js, Express, and MongoDB**.  
It provides features like authentication, disease search (Community page), health tracking, and specialist recommendations.

---

## 🧩 Tech Stack

### Frontend
- React
- Material UI (MUI)
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt

---

## 📁 Project Structure
CareMaa/
├── Backend/
│ ├── server.js
│ ├── models/
│ │ └── Disease.js
│ └── routes/
│ └── diseaseRoutes.js
│
├── Frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ └── Community.jsx
│ │ ├── components/
│ │ └── context/
│ ├── package.json
│ └── .gitignore
│
└── README.md



---


## ⚙️ Prerequisites (Install These First)


Make sure these are installed on the system:


- **Node.js** (v16+ recommended)  
  👉 https://nodejs.org/


- **MongoDB**
  - Local MongoDB **OR**
  - MongoDB Atlas (cloud)


- **Git**
  👉 https://git-scm.com/


---


## 🚀 How to Run the Project (From Scratch)


### 1️⃣ Clone the Repository


```bash
git clone https://github.com/<your-username>/CareMaa-Updated.git
cd CareMaa-Updated
🔧 Backend Setup
2️⃣ Go to Backend folder
cd Backend
3️⃣ Install backend dependencies
npm install
4️⃣ Create .env file inside Backend/
MONGO_URI=mongodb://127.0.0.1:27017/caremaa
JWT_SECRET=secretkey
PORT=5000

🔹 If using MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

5️⃣ Start Backend Server
npm start

If everything is correct, you will see:

✅ CareMaa MongoDB Connected!
🚀 CareMaa Backend running at http://localhost:5000

Test backend:

http://localhost:5000/api/health
http://localhost:5000/api/diseases
🎨 Frontend Setup
6️⃣ Open a NEW terminal and go to Frontend
cd Frontend
7️⃣ Install frontend dependencies
npm install
8️⃣ Start React App
npm start

Frontend will run at:

http://localhost:3000
🧠 Community Page (Disease Search)

Login to the app

Go to Community page

Enter disease names like:

Anemia

PCOS

Worm Infection

Menstrual Cramps

Gestational Diabetes

You will see:

Symptoms

Common medicines

Severity

Recommended specialist

🗄️ MongoDB Disease Data Format

Example document in diseases collection:

{
  "disease_name": "Anemia",
  "category": "Pregnancy",
  "symptoms": ["Fatigue", "Weakness"],
  "common_medicines": ["Iron Tablets", "Folic Acid"],
  "recommended_specialist": "Gynecologist",
  "severity": "Moderate"
}
🚫 Important Notes

❌ Do NOT push node_modules

❌ Do NOT push .env

✅ Always commit src/, public/, package.json

Backend must be running before frontend

🧪 Common Errors & Fixes
❌ Cannot GET /api/diseases

✔ Ensure backend is running
✔ Check server.js has routes above app.listen()

❌ MongoDB connection error

✔ MongoDB service running
✔ Correct MONGO_URI in .env

👨‍⚕️ Future Enhancements

Doctor appointment booking

AI health recommendations

Admin dashboard

Deployment (Vercel + Render)

👨‍💻 Author

CareMaa Project
Built for hackathon & learning purposes 💙

⭐ If this project helped you, give it a star!



---


## ✅ What You Should Do Now
1. Create a file named **`README.md`** in project root  
2. Paste the above content  
3. Commit & push:


```bash
git add README.md
git commit -m "Add README with setup instructions"
<<<<<<< HEAD
git push origin main
=======
git push origin main
>>>>>>> 6cbabb2eca70dc8d1c913a070525397fad1fa9cb
