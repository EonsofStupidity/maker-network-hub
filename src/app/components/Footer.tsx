
import React from "react";
import { cn } from "@/shared/utils/cn";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-2">MakersIMPULSE</h3>
            <p className="text-muted-foreground text-sm mb-4">
              The ultimate 3D printing community for makers and enthusiasts.
            </p>
            <div className="flex space-x-3">
              <SocialIcon name="twitter" href="https://twitter.com/" />
              <SocialIcon name="github" href="https://github.com/" />
              <SocialIcon name="discord" href="https://discord.com/" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/builds/explore">Explore Builds</FooterLink>
              <FooterLink href="/parts">Parts Database</FooterLink>
              <FooterLink href="/guides">Guides</FooterLink>
              <FooterLink href="/forum">Community Forum</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
              <FooterLink href="/contribute">Contribute</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
              <FooterLink href="/licenses">Licenses</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MakersIMPULSE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, className }) => {
  return (
    <li>
      <a
        href={href}
        className={cn(
          "text-sm text-muted-foreground hover:text-primary transition-colors",
          className
        )}
      >
        {children}
      </a>
    </li>
  );
};

interface SocialIconProps {
  name: string;
  href: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ name, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
      aria-label={name}
    >
      <span className={`sr-only`}>{name}</span>
      <i className={`icon-${name.toLowerCase()} text-lg`} />
    </a>
  );
};

export default Footer;
