import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const HomePage = lazy(() => import("@/components/pages/HomePage"));
const HotelsPage = lazy(() => import("@/components/pages/HotelsPage"));
const HotelDetailsPage = lazy(() => import("@/components/pages/HotelDetailsPage"));
const BookingPage = lazy(() => import("@/components/pages/BookingPage"));
const BookingsPage = lazy(() => import("@/components/pages/BookingsPage"));
const DashboardPage = lazy(() => import("@/components/pages/DashboardPage"));
const ProfilePage = lazy(() => import("@/components/pages/ProfilePage"));
const AboutPage = lazy(() => import("@/components/pages/AboutPage"));
const ReviewsPage = lazy(() => import("@/components/pages/ReviewsPage"));
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Wrap components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(HomePage)
  },
  {
    path: "hotels",
    element: withSuspense(HotelsPage)
  },
  {
    path: "hotels/:id",
    element: withSuspense(HotelDetailsPage)
  },
  {
    path: "booking",
    element: withSuspense(BookingPage)
  },
  {
    path: "bookings",
    element: withSuspense(BookingsPage)
  },
  {
    path: "dashboard",
    element: withSuspense(DashboardPage)
  },
  {
    path: "profile",
    element: withSuspense(ProfilePage)
  },
  {
    path: "reviews",
    element: withSuspense(ReviewsPage)
  },
  {
    path: "about",
    element: withSuspense(AboutPage)
  },
  {
    path: "login",
    element: withSuspense(Login)
  },
  {
    path: "signup",
    element: withSuspense(Signup)
  },
  {
    path: "callback",
    element: withSuspense(Callback)
  },
  {
    path: "error",
    element: withSuspense(ErrorPage)
  },
  {
    path: "prompt-password/:appId/:emailAddress/:provider",
    element: withSuspense(PromptPassword)
  },
  {
    path: "reset-password/:appId/:fields",
    element: withSuspense(ResetPassword)
  },
  {
    path: "*",
    element: withSuspense(NotFound)
  }
];

// Create routes array
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);