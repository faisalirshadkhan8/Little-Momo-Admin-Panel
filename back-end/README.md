# Backend Setup

## 1. Install Dependencies
```
npm install
```

## 2. Configure Environment Variables
Create a `.env` file in the `back-end` directory with the following content:
```
MONGO_URI=mongodb://localhost:27017/admin_panel
PORT=5000
```

## 3. Run the Server
For development (with auto-reload):
```
npx nodemon server.js
```
Or for production:
```
node server.js
```

## 4. Test the Server
Visit [http://localhost:5000/api/health](http://localhost:5000/api/health) to check if the backend is running. 