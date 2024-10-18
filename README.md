# Cost Compass  (mainly Expense Tracker with some cool features) API

## Overview

The Expense Tracker API is a backend application built using Node.js and Express, designed to manage user expenses efficiently. It includes features such as user authentication, expense management, secure payment processing, and file handling through AWS S3. The front end is developed using React, providing a seamless user experience.

## Features

- **Backend Development with Node.js & Express**: Scalable RESTful APIs for expense management.
- **Frontend Development with React**: Responsive user interface for enhanced user interaction.
- **Database Management & Security**: Utilizes MySQL with Sequelize for data handling and JWT/bcrypt for secure user authentication.
- **Third-Party Integrations**: Razorpay for secure payment processing and AWS SDK for S3 file management.
- **Email Services**: Transactional email notifications using the Sib API to enhance user engagement.
- **Middleware & Performance Optimization**: Implements cors, helmet, and morgan for security and performance enhancements.

## Technologies Used

- **Backend**: Node.js, Express, MySQL, Sequelize, JWT, bcrypt
- **Frontend**: React
- **Payment Integration**: Razorpay
- **File Storage**: AWS S3
- **Email Service**: Sib API
- **Development Tools**: Nodemon, dotenv, morgan, helmet, cors

## Installation

1. Clone the repository:
   ```bash
2. Install dependencies:
   npm install
3. Create a .env file in the root directory and add your environment variables or if u wonna add other gateway proceed a/q to documentation :
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   SENTITBLUE_BREVO_EXPENSE_TRACKER_API_KEY=your_api_key
4. Start the server:
   npm run server and for backend npm run dev(or u can rename/check package.json)

i
