# PRODIGY_FS_03 - Ratna Supermarket – Local store E-Commerce platform 

Task 03 of the Full Stack Web Development Internship at **Prodigy Infotech**

## 🔐 Task Overview

Ratna Supermarket is a local online grocery platform designed to provide users with a seamless and secure shopping experience. The platform allows customers to browse products, manage their shopping cart, and place orders—all within a user-friendly interface

### ✅ Key Requirements from Prodigy Infotech:
- Create an e-commerce website for a local store in your area.
- The platform should feature:
    - Product listings with images, descriptions, and prices
    - Shopping cart functionality
      
## 🚀 **Features Implemented**  

| Feature                    | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| 🛒 **Product Browsing**    | Browse, search, and filter grocery items                                    |
| 🔑 **Login Page**          | Existing users can securely log in                                          |
| 🛍️ **Cart Management**     | Add, remove, and adjust quantities of products in the cart                  |
| 🔐 **User Authentication** | Secure registration, login, and logout using JWT and password hashing       |
| 📄 **Protected Dashboard** | Access to user dashboard and purchase product only after login              |
| 💸 **Order Management**    | Place and view order details                                                |


## 🛠️ Tech Stack Used

**Frontend**:  
- React (Vite)  
- React Router  
- Axios for API calls and connecting backend with frontend

 **Backend**:  
- Node.js & Express.js  
- MongoDB (Mongoose)
- Bcrypt for password hashing
- JWT for authentication 

## 📁 Folder Structure

![image](https://github.com/user-attachments/assets/4550f2c5-5344-43d4-89d8-8a354560d21a)

## 🚀 Getting Started

### 1. Clone the Repository
```markdown
git clone https://github.com/Mdraza78/PRODIGY_FS_03.git
cd PRODIGY_FS_03
```
### 2. Backend Setup
```markdown
- cd backend
- npm install
- npm start
```
### 3. Frontend Setup
```markdown
- cd frontend
- npm install
- npm run dev
```

### 4. Create an `.env` file in the `backend/` directory with the following variables:
```markdown
- MONGO_URI=mongodb://127.0.0.1:27017/authdb
- JWT_SECRET=your_jwt_secret_key
```

## 📄 License
This project is developed as part of Prodigy Infotech Internship and is intended for educational use.


