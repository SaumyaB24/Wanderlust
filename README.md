# 🌍 Wanderlust — Full-Stack Travel Experience Platform

**Wanderlust** is a full-featured travel website that allows users to explore, list, and review travel destinations around the world. Built using the MVC architecture with Node.js, Express.js, MongoDB, and EJS, it delivers a dynamic, scalable, and user-friendly experience. The project includes secure authentication, interactive destination management, geolocation support, and image uploads — all wrapped in a clean and intuitive interface.

## ✨ Features

- User authentication with Passport.js, Express-Session, and Cookie-Parser
- Add, edit, and delete property listings with image uploads and geolocation
- Review system with full CRUD operations for logged-in users
- Location-based data using OpenCage API and OpenStreetMap
- Cloud image storage using Multer and Cloudinary
- Robust data validation with Joi and Mongoose
- Dynamic frontend using EJS templates and flash messages

## 🛠️ Tech Stack

- **Frontend**: EJS, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js, Express-Session, Cookie-Parser
- **Validation**: Joi, Mongoose
- **File Uploads**: Multer, Cloudinary
- **Geolocation**: OpenCage API, OpenStreetMap

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- Cloudinary account
- OpenCage API key

### Installation

```bash
git clone https://github.com/SaumyaB24/Wanderlust.git
cd wanderlust
npm install
cp .env.example .env
# Fill in your MONGO_URI, CLOUDINARY credentials, and OPENCAGE_API_KEY
npm start
```

## 👥 Demo Credentials

| Email                 | Password |
|----------------------|----------|
| demo1@wanderlust.com | 123456   |
| demo2@wanderlust.com | 123456   |

## 🔮 Future Enhancements

- Mobile responsiveness improvements  
- Listing categories and tag-based filtering  
- Interactive maps with Leaflet or Mapbox  
- Favorite/bookmark listings  
- Email notifications and calendar integration  

## 📄 License

This project is licensed under the MIT License.
