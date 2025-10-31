// import { LoginView } from "@/features/auth/views/Login";
import { FeatureContainer } from '@/features/Feature';

const authProtectedRoutes = [
  { path: '/map', component: FeatureContainer },
];

const publicRoutes = [
  // { path: "/", component: LoginView },
  { path: '/map-free', component: FeatureContainer },

]

export { authProtectedRoutes, publicRoutes };
