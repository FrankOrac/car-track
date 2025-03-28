# Car Tracking Frontend

This is the frontend application for a vehicle tracking system. It provides real-time monitoring of vehicle locations, status, and alerts through a user-friendly interface.

## Features

- User authentication (login/registration)
- Dashboard with vehicle statistics and recent alerts
- Interactive map view showing real-time vehicle locations
- Vehicle management (add, edit, delete vehicles)
- Subscription plan management
- Payment history tracking
- User profile management

## Tech Stack

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Leaflet for maps
- Chart.js for data visualization
- Heroicons for SVG icons

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/        # Shared components (Alert, LoadingSpinner, etc.)
│   └── Layout/        # Layout components (AppLayout, etc.)
├── contexts/          # React contexts (AuthContext, etc.)
├── pages/             # Page components
│   ├── auth/          # Authentication pages (Login, Register)
│   ├── dashboard/     # Dashboard pages (Dashboard, VehicleMap, etc.)
│   ├── vehicles/      # Vehicle management pages
│   ├── subscription/  # Subscription pages
│   └── profile/       # User profile pages
├── App.js             # Main app component with routing
└── index.js           # Entry point
```

## API Integration

The frontend connects to a Laravel backend API. Ensure the API is running at the URL specified in the configuration.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8000/api
```

## License

This project is licensed under the MIT License.
