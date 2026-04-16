"use client";

import { useSession } from "@/lib/auth-client";
import { User, Activity, MapPin, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-8">
        <div className="h-32 bg-slate-100 relative">
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-sm bg-white">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback className="text-4xl">{session.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{session.user.name}</h1>
              <p className="text-slate-500 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" /> Ho Chi Minh City
              </p>
            </div>
          </div>
          
          <div className="pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-slate-500">Matches Played</div>
              <div className="text-2xl font-bold">42</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Sessions Hosted</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Current Rating</div>
              <div className="text-2xl font-bold text-emerald-600 flex items-center">
                1254 <Activity className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Skill Level</div>
              <div className="text-2xl font-bold flex items-center">
                <Badge>Advanced</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <Card>
        <CardContent className="py-10 text-center text-slate-500">
           No recent matches found. Start playing to see your history!
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
      {children}
    </span>
  );
}
