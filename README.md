# Car Tracking System (SaaS)

A subscription-based SaaS application for vehicle tracking and management, built with Laravel and React.

## Features

- **User Management**: Admin, regular users, and company accounts
- **Vehicle Tracking**: Real-time GPS tracking of vehicles
- **Geofencing**: Create virtual boundaries and get alerts when vehicles enter or exit
- **Maintenance Records**: Keep track of vehicle maintenance history
- **Alerts & Notifications**: Receive alerts for speed, geofence violations, maintenance due, etc.
- **Subscription Plans**: Tiered pricing plans with different features
- **Payment Processing**: Handle subscription payments
- **Responsive Dashboard**: Monitor all vehicles from any device

## Technology Stack

### Backend

- **Laravel**: PHP framework for the backend API
- **MySQL**: Database for storing user, vehicle, and tracking data
- **Sanctum**: API authentication

### Frontend

- **React**: JavaScript library for building the user interface
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API requests
- **Mapbox/Google Maps**: For map visualization
- **TailwindCSS**: Utility-first CSS framework

## Getting Started

### Prerequisites

- PHP 8.0 or higher
- Composer
- Node.js and npm
- MySQL

### Installation

#### Backend Setup

1. Clone the repository
2. Navigate to the backend directory: `cd car-tracking-backend`
3. Install dependencies: `composer install`
4. Copy `.env.example` to `.env` and configure your database
5. Generate application key: `php artisan key:generate`
6. Run migrations: `php artisan migrate`
7. Seed the database (optional): `php artisan db:seed`
8. Start the development server: `php artisan serve`

#### Frontend Setup

1. Navigate to the frontend directory: `cd car-tracking-frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
