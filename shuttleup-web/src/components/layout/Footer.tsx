export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/50 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} ShuttleUp. All rights reserved.</p>
        <p>Built for the badminton community 🏸</p>
      </div>
    </footer>
  )
}
