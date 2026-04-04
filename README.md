#  GetWork — Gig Job Marketplace Platform

##  Prototype link:
 * https://getworkmain.vercel.app/
##  Overview

**GetWork** is a modern gig economy platform that connects **workers** and **employers** for:

* Hourly jobs
* Daily jobs
* Part-time jobs
* Full-time jobs

It includes real-world features like **wallet system, QR-based job tracking, chat, maps, and safety (SOS)**.

---

##  Key Features

###  Employer (Job Provider)

* Post jobs (Quick Job + Detailed Job)
* View job history
* Wallet system (add money, transactions)
* Worker hiring & management
* Rate & give feedback to workers
* Map view (nearby workers)
* Job scheduling (date & time)
* Dashboard analytics (jobs, hours, spending)

---

###  Worker

* Apply for jobs
* Live job notifications
* Availability toggle (ON/OFF)
* Map view (nearby jobs/shops)
* Chat with employer (after applying)
* QR-based job start system
* Job timer tracking
* Upload job completion proof
* Wallet & earnings tracking
* Dashboard (hours worked, earnings, jobs)

---

###  Shared Features

* Real-time style chat UI
* Feedback & rating system (both sides)
* Notifications system
* Profile management
* Secure authentication (JWT)
* SOS safety system (Call + SMS + Email UI)

---

##  Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* React Router DOM
* Axios
* Context API

### Backend (Planned / In Progress)

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Socket.io (chat)
* Razorpay (payments)
* Cloudinary (image uploads)

---

##  Project Structure

```
src/
├── assets/
├── components/
│   ├── JobGiver/
│   ├── Worker/
│   ├── Ui/
│   ├── Navbar.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── About.jsx
│   ├── ChangePassword.jsx
│   ├── ChooseYourPath.jsx
│   ├── HomeUi.jsx
│   ├── Logout.jsx
├── images/
├── App.jsx
├── main.jsx
```

---

##  Authentication Flow

* User registers as:

  * Worker
  * Employer

* JWT-based authentication

* Role-based dashboards

* Protected routes

---

##  Wallet System

* Add money
* Deduct for job posting
* Track transactions
* Worker receives payment after job approval

---

##  Job Completion Flow

1. Worker completes job
2. Uploads proof image
3. Employer reviews
4. Approves → payment released

---

##  QR + Timer Flow

1. Employer generates QR
2. Worker scans QR at location
3. Timer starts automatically
4. Ends when job is completed

---

##  SOS Safety Feature

* Emergency button for workers
* Triggers:

  * Call simulation
  * SMS alert
  * Email alert

---

##  Map Integration

* Shows nearby jobs
* Shows nearby employers
* Interactive markers

---

##  Chat System

* Available only after job application
* Worker ↔ Employer communication
* Real-time style UI

---

##  Rating & Feedback

* Both sides can rate each other
* Star rating (1–5)
* Feedback comments

---

##  Installation

```bash
git clone https://github.com/your-username/getwork.git
cd getwork
npm install
npm run dev
```

---

##  Environment Variables

Create `.env` file:

```
VITE_API_URL=your_backend_url
```

---

##  Future Improvements

* Real-time chat (Socket.io)
* Live GPS tracking
* Push notifications
* Payment gateway integration
* AI-based job recommendations

---


##  Contributing

Pull requests are welcome. For major changes, open an issue first.

---



## 💡 Inspiration

Built as a real-world startup-level project inspired by gig platforms like Uber and freelance marketplaces.

---


⭐ If you like this project, give it a star!
