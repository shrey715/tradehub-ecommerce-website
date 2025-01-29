# TradeHub - IIITH Market Place

TradeHub is an e-commerce platform that allows users to buy and sell products. It is developed as a part of the Design and Analysis of Software Systems course
at IIIT Hyderabad. The platform is built using MERN stack.

## Libraries Used:

- Frontend: 
    - React: JavaScript library for building user interfaces.
    - Zustand: State management library.
    - Axios: Promise based HTTP client for the browser and Node.js
    - React Router: Declarative routing for React.
    - Filepond: A JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.
    - React-hot-toast: A super easy toast library for React applications.
    - React-icons: Popular icons for React projects.
    - Motion: Animation library for React.
    - Tailwind CSS: A utility-first CSS framework for rapidly building custom designs.
    - React-Helmet: A document head manager for React.
    - Google-generative-ai: A library for powering the chatbot using Google's generative AI models, `Gemini 1.5 Flash` in this case.

- Backend:
    - Express: Fast, unopinionated, minimalist web framework for Node.js.
    - Mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
    - Multer: Node.js middleware for handling `multipart/form-data`.
    - JWT: JSON Web Token is a compact, URL-safe means of representing claims to be transferred between two parties.
    - Bcrypt: A library to help you hash passwords.
    - Cors: A package for providing a Connect/Express middleware that can be used to enable CORS with various options.
    - Dotenv: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
    - Cloudinary: Cloudinary is a cloud service that offers a solution to a web application's entire image management pipeline.

## How to run

- Clone the repository
- Run `npm install` in both the `frontend` and `backend` directories
- Create a `.env` file in the `backend` directory and add the following environment variables:
    - `MONGO_URI`: MongoDB connection string
    - `JWT_SECRET`: Secret key for JWT
    - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
    - `CLOUDINARY_API_KEY`: Cloudinary API key
    - `CLOUDINARY_API_SECRET`: Cloudinary API secret
- Run `npm run dev` in the `backend` directory
- Create a `.env` file in the `frontend` directory and add the following environment variables:
    - `VITE_BACKEND_URL`: Backend API URL
    - `VITE_GEMINI_API_KEY`: Gemini API key for chat support
- Run `npm run dev` in the `frontend` directory
- Open `http://localhost:5173` in your browser

