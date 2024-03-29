**I. Project introduction**
The website is used for booking hotels.
Frontend: React, Bootstrap, Redux, link: https://github.com/TuyetAnh82198/booking-frontend
Backend: NodeJS, Express, link: https://github.com/TuyetAnh82198/booking-backend
Database: MongoDB
Performance optimization: useCallback, Lazy loading, Compression
Language: English

**II. Functional description**
Create account, create random password.
Only logged in users can book hotels and view Transactions.
Return to the page just visited after successfully logging in.
Input value validation.
Using the library react-date-range for picking date.
Display the number of hotels by city.
Display the number of hotels by property type (hotel, apartment, resort,...).
Display the top 3 hotels with the highest ratings.
Search for hotels by city, date, number of people (adult and children), number of rooms.
Only shows rooms that are available during picked date.
Display a hotel's detail with a conditional booking form.


**III. Demo link**
https://booking-frontend-mlab.onrender.com
*Recommended browser: Firefox

**IV. Deployment guide (on local)**

1. We need to install NodeJS 

2. Frontend:
npm start (localhost 3000) 
.env: REACT_APP_BACKEND, REACT_APP_FRONTEND

3. Backend:
npm start (localhost 5000)
nodemon.json:
{
  "env": {
    "CLIENT_APP": "for example http://localhost:3000",
    "MONGO_USER": "",
    "MONGO_PASS": "",
    "SESSION_SECRET": ""
  }
}
And then update scripts in package.json, for example:
"start": "NODE_ENV=development CLIENT_APP=http://localhost:3000 MONGO_USER=abc MONGO_PASS=xyz SESSION_SECRET= nodemon app.js"


**Login information:**
email: abc@gmail.com
pass: 12345678
