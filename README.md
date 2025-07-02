# 🩸 BloodLink - Digital Blood Bank & Donor Finder

BloodLink is a full-stack web application for connecting blood donors and recipients, managing blood requests, and tracking donations. Built with React (Vite), Node.js/Express, and MongoDB Atlas.

---

## 🚀 Features

- **User Authentication:** Register/login as Donor, Needy, or Both (JWT-based).
- **Profile Management:** Edit personal info, blood type, location, phone, and donor status (paid/free).
- **Blood Requests:** Needy users can create blood requests; donors can apply to help.
- **Applicant Selection:** Requesters can view applicants (with name, phone, address, charges) and select a donor.
- **Appointments:** When a donor is selected, an appointment is automatically created for both donor and requester.
- **Contact Info:** Donor and requester can see each other's phone numbers for coordination.
- **Donation History:** Donors' successful donations are tracked and shown in their history.
- **Dashboard:** Central user dashboard with tabs for profile, requests, appointments, donation history, and all open requests.
- **Responsive UI:** Modern, mobile-friendly design.

---

## 🛠️ Project Structure

```
/
├── backend/           # Express API, MongoDB models, routes
├── src/               # React frontend (Vite)
│   ├── components/    # Shared React components
│   └── pages/         # Main app pages (UserPage, Registration, etc.)
├── public/            # Static assets
├── package.json       # Frontend dependencies/scripts
├── backend/package.json # Backend dependencies/scripts
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/BloodLink.git
cd BloodLink
```

### 2. **Backend Setup**

```bash
cd backend
npm install
```

#### **Environment Variables**

Create a `.env` file in the `backend/` directory with the following (replace with your own values):

```
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
EMAIL_FROM=your_email@example.com
```

- For development, you can comment out or ignore email settings if you don't want to send emails.

#### **Start the Backend**

```bash
node index.js
```

---

### 3. **Frontend Setup**

```bash
cd ..
npm install
```

#### **Start the Frontend**

```bash
npm run dev
```

- The app will be available at [http://localhost:5173](http://localhost:5173)

---

## 🧑‍💻 Usage Guide

- **Register:** Choose Donor, Needy, or Both. Fill in your details.
- **Dashboard:** After login, access your dashboard at `/user`.
- **Create Request:** Go to "My Blood Requests" tab and click "+ Create New Request".
- **Apply to Requests:** Donors can view all open requests and apply to help.
- **Select Donor:** Requesters can view applicants (with name, phone, address, charges) and select a donor.
- **Appointments:** When a donor is selected, an appointment is created for both parties. Both can see each other's contact info.
- **Donation History:** Donors' successful donations are tracked and shown in the "Donation History" tab.

---

## 🧩 Tech Stack

- **Frontend:** React, Vite, React Router, Formik, Yup, CSS
- **Backend:** Node.js, Express, Mongoose, JWT, Nodemailer
- **Database:** MongoDB Atlas

---

## 🛡️ Security & Notes

- Never commit your real `.env` file or credentials to version control.
- For production, set up proper email credentials and IP whitelisting for MongoDB Atlas.
- All sensitive routes are protected by JWT authentication.

---

## 📬 Contact & Support

For issues, open a GitHub issue or contact the maintainer.

---

## 📄 License

MIT
