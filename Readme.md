TechStack used: 
  front end: vite-react , tailwindcss, zustand, lucid-react icons
  backend: express js, mongoose, nodemon, jwt, bcrypt
  used cloudinary and multer for file storage.

Setup steps:
  create mongodb atlas account and cloudinary account
  clone this repository
  git clone https://github.com/AthrvaNaik/careers-page-builder.git
  cd careers-page-builder

  Backend Setup:
    cd backend
    npm install

  Create .env file with:
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    CORS_ORIGIN=http://localhost:3000 --> front end url

  Create uploads folder
    mkdir uploads
    
  Start backend
    npm run dev

  Backend runs on http://localhost:5000


  Frontend setup:
    cd frontend
    npm install

  Create .env file and add
   VITE_API_URL=http://localhost:5000/api

  Start frontend
    npm run dev

  Frontend runs on: http://localhost:3000


Data:
  access the website below and use preety-print extension for clearer formatting.
  https://api.npoint.io/8b7b42b35856a4b426ee

  if above link doesnot work, use this: https://www.npoint.io/docs/8b7b42b35856a4b426ee

Video preview of the project: https://drive.google.com/file/d/1uWQA2e0Oti3le8FwoumogEc2Iq-Q36Iq/view?usp=drive_link
