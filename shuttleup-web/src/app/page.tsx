import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Users, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 bg-slate-50 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-8 bg-white">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2" />
            Join 1,000+ players already on ShuttleUp
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mb-6">
            Find the Perfect <span className="text-emerald-500">Badminton</span> Session Near You
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
            Stop messaging multiple groups to find an open slot. Discover active courts, match with players of your skill level, and book instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/sessions" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base h-12 px-8 bg-emerald-600 hover:bg-emerald-700">
                Find a Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/sessions/new" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-base h-12 px-8">
                Host a Session
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Location Based</h3>
              <p className="text-slate-600">Find courts near you instantly with our interactive map and geo-search.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Skill Matching</h3>
              <p className="text-slate-600">Filter sessions by skill levels to ensure competitive and fun games for everyone.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-slate-600">Secure your slot with live availability and pay effortlessly through integrated payments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Feed / CTA out to full feed */}
      <section className="py-24 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to play?</h2>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto">
            Browse our live feed of upcoming sessions happening in your area over the next 7 days.
          </p>
          <Link href="/sessions">
            <Button size="lg" variant="default" className="text-base px-8 h-12">
              <Users className="mr-2 h-5 w-5" />
              Browse All Sessions
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
