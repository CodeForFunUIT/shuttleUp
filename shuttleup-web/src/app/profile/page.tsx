import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      
      <Card>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 rounded-full bg-emerald-100 flex items-center justify-center text-4xl font-bold text-emerald-700">
            MT
          </div>
          <div className="text-center md:text-left space-y-2 flex-1">
            <h2 className="text-2xl font-bold">Minh Tran</h2>
            <p className="text-muted-foreground">host@shuttleup.com</p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <Badge variant="outline" className="text-base px-3 py-1">
                ELO: 1450
              </Badge>
              <Badge variant="secondary" className="text-base px-3 py-1">
                INTERMEDIATE
              </Badge>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No recent activity matching your profile.</p>
        </CardContent>
      </Card>
    </div>
  )
}
