import { createBrowserRouter, redirect } from "react-router";
import { SplashPage } from "./pages/SplashPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPhonePage } from "./pages/SignupPhonePage";
import { SignupOtpPage } from "./pages/SignupOtpPage";
import { SignupProfilePage } from "./pages/SignupProfilePage";
import { HomePage } from "./pages/HomePage";
import { PointsHistoryPage } from "./pages/PointsHistoryPage";
import { CreditsPage } from "./pages/CreditsPage";
import { PackagePage } from "./pages/PackagePage";
import { PointsPage } from "./pages/PointsPage";
import { RewardsPage } from "./pages/RewardsPage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AppointmentPage } from "./pages/AppointmentPage";
import { AppointmentHistoryPage } from "./pages/AppointmentHistoryPage";
import { BookAppointmentPage } from "./pages/BookAppointmentPage";
import { MePage } from "./pages/MePage";
import { MembershipBenefitPage } from "./pages/MembershipBenefitPage";
import { QuestionnairePage } from "./pages/QuestionnairePage";
import { GiftCardPage } from "./pages/GiftCardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ProfilePage } from "./pages/ProfilePage";

export const router = createBrowserRouter([
  // Auth flow
  { path: "/splash", Component: SplashPage },
  { path: "/onboarding", Component: OnboardingPage },
  { path: "/login", Component: LoginPage },
  { path: "/signup-phone", Component: SignupPhonePage },
  { path: "/signup-otp", Component: SignupOtpPage },
  { path: "/signup-profile", Component: SignupProfilePage },

  // Main app — bottom nav tabs
  { path: "/", Component: HomePage },
  { path: "/rewards", Component: RewardsPage },
  { path: "/history", Component: HistoryPage },
  { path: "/profile", Component: ProfilePage },

  // Supporting pages
  { path: "/points-history", Component: PointsHistoryPage },
  { path: "/credits", Component: CreditsPage },
  { path: "/package", Component: PackagePage },
  { path: "/points", Component: PointsPage },
  { path: "/shop", Component: ShopPage },
  { path: "/product", Component: ProductPage },
  { path: "/checkout", Component: CheckoutPage },

  // Appointment flow
  { path: "/appointment", Component: AppointmentPage },
  { path: "/appointment-history", Component: AppointmentHistoryPage },
  { path: "/appointment/book", Component: BookAppointmentPage },

  // Me / Profile (legacy routes kept for compatibility)
  { path: "/me", Component: MePage },
  { path: "/me/membership", Component: MembershipBenefitPage },
  { path: "/me/questionnaire", Component: QuestionnairePage },
  { path: "/me/gift-cards", Component: GiftCardPage },

  // Catch-all
  { path: "*", loader: () => redirect("/") },
]);
