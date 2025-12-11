import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Icons } from "./icons";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col-reverse items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center justify-center space-x-2 md:justify-start">
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">TaskSync</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TaskSync. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium font-headline">About</h4>
              <ul className="space-y-1">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Our Story</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Press</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium font-headline">Support</h4>
              <ul className="space-y-1">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Trust & Safety</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium font-headline">Legal</h4>
              <ul className="space-y-1">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground"><Twitter size={20} /></a>
            <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-foreground"><Github size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
