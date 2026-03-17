# Fampy – Food Delivery API (College Project)

This project is a backend API for a food delivery system built during my undergraduate studies. It was my first full backend project where I worked on authentication, order management, and integrating with a mobile application.

The API allows users to browse restaurants, select food items, and place orders using location data.

---

## Features

- User registration and login  
- JWT-based authentication  
- Password hashing using bcrypt  
- Browse restaurants and food items  
- Place food orders  
- Location-based ordering (Google Maps integration)  
- Update user profile and password  
- API documentation using Swagger  
- Unit testing using Mocha  

---

## Tech Stack

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT (Authentication)  
- bcrypt (Password hashing)  
- Mocha (Testing)  
- Swagger (API documentation)  

---

## API Structure

The API is structured around different modules:

- `/user` – user authentication and profile management  
- `/food` – food items  
- `/restaurant` – restaurant data  
- `/order` – order handling  
- `/location` – location-based features  
- `/feedback` – user feedback  
- `/upload` – file/image uploads  

---

## Authentication

Authentication is handled using JSON Web Tokens (JWT):

- Users receive a token on login/signup  
- Protected routes require a valid token  
- Passwords are securely hashed using bcrypt  

---

## Running the Project

Install dependencies:

npm install

Run development server:

npm run dev

Run tests:

npm run test

Run lint:

npm run lint

---

## Example Request

POST /signup

{
  "email": "test@test.com",
  "password": "123456"
}

---

## Notes

This was one of my earlier projects, but it helped me build a strong foundation in backend development, REST APIs, and working with databases. More recently, I’ve been focusing on modern .NET development and building more advanced systems such as real-time applications.
