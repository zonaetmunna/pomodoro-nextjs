import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { BarChart2, Clock, ListTodo } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Boost Your Productivity
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              One Pomodoro at a Time
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            PomodoroFocus helps you stay productive with the proven Pomodoro technique. 
            Work in focused sprints, take regular breaks, and track your progress.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90">
                Get Started - It's Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-black/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            Features Designed for Focus
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            PomodoroFocus combines the proven Pomodoro technique with modern features 
            to help you achieve deep focus and maximize your productivity.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/30 border border-white/10 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Timers</h3>
              <p className="text-gray-400">
                Set your own focus and break durations to match your personal productivity rhythm.
              </p>
            </div>
            
            <div className="bg-black/30 border border-white/10 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                <ListTodo className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-400">
                Organize your work with an integrated task list that syncs with your Pomodoro sessions.
              </p>
            </div>
            
            <div className="bg-black/30 border border-white/10 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Productivity Analytics</h3>
              <p className="text-gray-400">
                Track your focus sessions and productivity trends over time with detailed statistics.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">How the Pomodoro Technique Works</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            The Pomodoro Technique is a time management method that uses a timer to break work 
            into intervals, traditionally 25 minutes in length, separated by short breaks.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/30 border border-white/10 p-6 rounded-xl relative">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600 mb-4">
                01
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Your Timer</h3>
              <p className="text-gray-400">
                Choose a task and set the timer for 25 minutes (a standard Pomodoro).
              </p>
              
              <div className="hidden md:block absolute bottom-6 right-0 transform translate-x-1/2 translate-y-1/2 z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-black/30 border border-white/10 p-6 rounded-xl relative">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 mb-4">
                02
              </div>
              <h3 className="text-xl font-semibold mb-2">Focus Deeply</h3>
              <p className="text-gray-400">
                Work on your task with complete focus until the timer rings.
              </p>
              
              <div className="hidden md:block absolute bottom-6 right-0 transform translate-x-1/2 translate-y-1/2 z-10 rotate-90">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-black/30 border border-white/10 p-6 rounded-xl relative">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 mb-4">
                03
              </div>
              <h3 className="text-xl font-semibold mb-2">Take a Break</h3>
              <p className="text-gray-400">
                Take a short 5-minute break to rest your mind.
              </p>
              
              <div className="hidden md:block absolute bottom-6 right-0 transform translate-x-1/2 translate-y-1/2 z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-black/30 border border-white/10 p-6 rounded-xl">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600 mb-4">
                04
              </div>
              <h3 className="text-xl font-semibold mb-2">Repeat & Track</h3>
              <p className="text-gray-400">
                After 4 pomodoros, take a longer break (15-30 minutes). Repeat the cycle and track your progress.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-red-500/20 to-orange-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of professionals who have transformed their work habits with PomodoroFocus.
          </p>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 px-8 py-6 text-lg">
              Start Using PomodoroFocus
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-white">PomodoroFocus</span>
            </div>
            
            <div className="flex gap-8">
              <Link href="#features" className="text-sm text-gray-400 hover:text-white">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-gray-400 hover:text-white">
                How It Works
              </Link>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="text-sm text-gray-400 hover:text-white">
                Sign Up
              </Link>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} PomodoroFocus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

