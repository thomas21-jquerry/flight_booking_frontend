# Flight Booking App

A Next.js application for booking flights with Supabase authentication and database integration.
The backend for this can be found at https://github.com/thomas21-jquerry/flight_booking_backend

## Features

- User authentication (sign up, login, email verification)
- Protected routes
- Flight search functionality
- Modern UI with Tailwind CSS
- TypeScript support

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd flight_booking_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project and get your project URL and anon key.

4. Create a `.env.local` file in the root directory with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app directory with pages and layouts
- `/src/contexts` - React contexts for state management
- `/src/lib` - Utility functions and configurations
- `/src/components` - Reusable React components

## Authentication Flow

1. Users can sign up with email and password
2. Email verification is required
3. Users can log in with their credentials
4. Protected routes require authentication
5. Session management is handled by Supabase

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
