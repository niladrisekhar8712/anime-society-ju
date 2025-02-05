# Event Registration API 

A simple Node.js + Express + MongoDB REST API for managing events and user registrations.

## Features
- Create and fetch events
- Register users for multiple events
- Fetch registered users for an event
- Unregister users from events

## Setup Instructions

### 1️ Install Dependencies
```sh
npm install
```
### 2 Start MongoDB
Make Sure the mongoDB is running
```sh
mongod --dbpath "C:\data\db"
```
### 3 Start the Server
```sh
node server.js
```

## API Endpoints

### Events API
| Method | Endpoint         | Description            |
|--------|-----------------|------------------------|
| GET    | `/api/events`   | Get all events        |
| POST   | `/api/events`   | Create a new event    |
| GET    | `/api/events/:id` | Get event details |

###  Users API
| Method | Endpoint                         | Description                  |
|--------|----------------------------------|------------------------------|
| GET    | `/api/users`                     | Get all users                |
| POST   | `/api/users`                     | Register a new user          |
| POST   | `/api/users/:userId/register`    | Register user for events     |
| DELETE | `/api/users/:userId/unregister/:eventId` | Unregister user from event |
