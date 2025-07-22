# 🥟 Little Momo Admin Panel

A comprehensive restaurant management system built with **React.js** frontend and **Node.js** backend, specifically designed for Little Momo restaurant operations. Features real-time order management, menu administration, customer tracking, and delivery monitoring with Firebase integration.

![Little Momo Logo](front-end/src/assets/Logo.webp)

## 🚀 Features

### 📊 **Dashboard Overview**
- Real-time analytics and key metrics
- Order statistics and revenue tracking
- Quick access to critical operations
- Notification system for important updates

### 🛒 **Order Management**
- **Real-time order tracking** with Firebase Firestore
- **Order status updates**: Pending → Preparing → Ready → Delivered
- **Live order notifications** with instant updates
- **Order filtering** by status, date, and customer
- **Bulk order operations** and status management

### 🍜 **Menu Management**
- **Complete menu CRUD operations**
- **Image upload** for menu items with Multer
- **Category-based organization**:
  - Classic Momos
  - Pan Fried Momos
  - Creamy Momos
  - Spicy Gravy Momos
  - Steak Sauce Momos
  - Newly Launched Momos
  - Noodles & Soups
  - Chinese Entrees
  - Beverages
- **Price management** and inventory tracking
- **Batch menu updates**

### 👥 **Customer Management**
- **Customer database** with detailed profiles
- **Order history tracking** per customer
- **Customer analytics** and preferences
- **Contact information** management

### 🚚 **Delivery Monitoring**
- **Real-time delivery tracking**
- **Delivery status updates**
- **Driver assignment** and monitoring
- **Delivery time optimization**

### ⚙️ **Settings & Configuration**
- **User account management**
- **System preferences**
- **Theme customization** (Light/Dark mode)
- **Notification settings**

### 🔐 **Authentication & Security**
- **Firebase Authentication** integration
- **JWT token-based** secure API access
- **Role-based access control**
- **Secure password hashing** with bcryptjs

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Latest React version with modern features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Firebase SDK** - Real-time database and authentication
- **Axios** - HTTP client for API requests
- **React Toastify** - Beautiful notifications
- **Tailwind CSS** - Utility-first CSS framework

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Firebase Admin SDK** - Server-side Firebase integration
- **JWT** - JSON Web Token authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### **Database**
- **MongoDB** - Primary database for menu items and users
- **Firebase Firestore** - Real-time data for orders and customers

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **Firebase project** with Firestore enabled
- **Git** for version control

## 🚀 Installation & Setup

### 1. **Clone the Repository**
```bash
git clone https://github.com/faisalirshadkhan8/Little-Momo-Admin-Panel.git
cd Little-Momo-Admin-Panel
```

### 2. **Backend Setup**

#### Install Dependencies
```bash
cd back-end
npm install
```

#### Environment Configuration
Create a `.env` file in the `back-end` directory:
```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/little_momo_admin
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/little_momo_admin

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Firebase Configuration (if using Firebase Admin SDK)
FIREBASE_PROJECT_ID=your_firebase_project_id
```

#### Firebase Service Account Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Project Settings → Service Accounts
3. Generate a new private key
4. Save the JSON file as `firebaseServiceAccountKey.json` in the `back-end` directory

#### Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev
# or
npx nodemon server.js

# Production mode
npm start
# or
node server.js
```

The backend will run on `http://localhost:5000`

### 3. **Frontend Setup**

#### Install Dependencies
```bash
cd front-end
npm install
```

#### Firebase Configuration
Create a `firebase.js` configuration file with your Firebase project credentials:
```javascript
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. **Build for Production**

#### Frontend Build
```bash
cd front-end
npm run build
```

#### Backend Production
```bash
cd back-end
npm start
```

## 📁 Project Structure

```
Little-Momo-Admin-Panel/
├── 📁 back-end/                    # Node.js Backend
│   ├── 📁 middleware/              # Authentication & validation
│   │   ├── auth.js                 # JWT authentication middleware
│   │   └── firebaseAuth.js         # Firebase authentication
│   ├── 📁 models/                  # Database models
│   │   ├── MenuItem.js             # Menu item schema
│   │   └── User.js                 # User schema
│   ├── 📁 routes/                  # API routes
│   │   ├── auth.js                 # Authentication routes
│   │   └── menu.js                 # Menu management routes
│   ├── 📁 uploads/                 # Uploaded images storage
│   ├── server.js                   # Main server file
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables
│
├── 📁 front-end/                   # React.js Frontend
│   ├── 📁 public/                  # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/          # React components
│   │   │   ├── 📁 dashboard/       # Dashboard-specific components
│   │   │   │   ├── Overview.jsx            # Analytics dashboard
│   │   │   │   ├── OrderManagement.jsx     # Order tracking system
│   │   │   │   ├── MenuManagement.jsx      # Menu CRUD operations
│   │   │   │   ├── CustomerManagement.jsx  # Customer database
│   │   │   │   ├── DeliveryMonitoring.jsx  # Delivery tracking
│   │   │   │   └── Settings.jsx            # System settings
│   │   │   ├── Dashboard.jsx       # Main dashboard layout
│   │   │   ├── Login.jsx          # Authentication component
│   │   │   └── Sidebar.jsx        # Navigation sidebar
│   │   ├── 📁 contexts/           # React Context APIs
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   └── ThemeContext.jsx   # Theme management
│   │   ├── 📁 styles/            # CSS stylesheets
│   │   ├── 📁 assets/            # Images and static files
│   │   ├── firebase.jsx          # Firebase configuration
│   │   ├── App.jsx              # Main App component
│   │   └── main.jsx             # React entry point
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js           # Vite configuration
│
├── .gitignore                    # Git ignore rules
└── README.md                     # Project documentation
```

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification

### **Menu Management**
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item
- `POST /api/menu/upload` - Upload menu item image

### **Health Check**
- `GET /api/health` - Server health status

## 🔧 Configuration

### **Environment Variables**

#### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/little_momo_admin
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### Firebase Configuration
- Set up Firebase project with Firestore
- Enable Authentication
- Configure security rules
- Download service account key

## 🚀 Deployment

### **Backend Deployment (Heroku/Railway/DigitalOcean)**
1. Set environment variables on your hosting platform
2. Upload Firebase service account key securely
3. Configure MongoDB connection (MongoDB Atlas recommended)
4. Deploy using your platform's deployment process

### **Frontend Deployment (Vercel/Netlify)**
1. Build the project: `npm run build`
2. Configure environment variables
3. Deploy the `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Firebase** for real-time database capabilities
- **MongoDB** for robust data storage
- **React** and **Vite** for modern frontend development
- **Express.js** for reliable backend framework

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

**Made with ❤️ for Little Momo Restaurant**

*Streamlining restaurant operations with modern technology*
