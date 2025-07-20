"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/userDefine/ThemeToggle/ThemeToggle"
import { Users, Eye, EyeOff, Mail, Lock, GraduationCap, BookOpen, BarChart3, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// SIGN IN BUTTON
import SignInButton from "@/components/sessionwrapper/signIn/SignInButton"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Route
  const router = useRouter();
  const dashboard_route = "/dashboard";
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-32 w-16 h-16 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border border-white rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center space-y-8">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">AttendanceHub</span>
            </div>

            {/* Main Illustration Area */}
            <div className="relative">
              <img
                src="/images/education-illustration.png"
                alt="Educational illustration"
                className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
              />

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-1/2 -left-6 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight">
                Streamline Your
                <span className="block text-yellow-300">Student Management</span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Track attendance, monitor performance, and engage with students through our comprehensive management
                platform.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Smart Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Mobile Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center lg:hidden">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white lg:hidden">AttendanceHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Text */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
              <p className="text-gray-600 dark:text-gray-400">Sign in to access your student management dashboard</p>
            </div>

            {/* Login Form */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-6 space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button className="w-full h-12 text-base font-medium" onClick={() => router.push(dashboard_route)}>Sign in to Dashboard</Button>

                {/* Create Account Link */}
                <div className="text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
                  <Link
                    href="/register"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Create account
                  </Link>
                </div>

                {/* Divider */}
                <div className="relative">
                  <Separator className="my-6" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>

                {/* Social Login Options */}
                <div className="space-y-3">
                  {/* <Button
                    variant="outline"
                    className="w-full h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button> */}
                  <SignInButton/>

                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                    Continue with Microsoft
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 sm:hidden">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-4">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
