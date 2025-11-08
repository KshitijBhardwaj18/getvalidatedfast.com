"use client";
import React from "react";
import { Button } from "../ui/button";
import { BrickWall, Bug, House, Lightbulb, MenuIcon, PanelsTopLeft, Star } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navlinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <House />,
  },
  {
    label: "Widget",
    href: "/widget",
    icon: <PanelsTopLeft />,
  },
];

const anlyticalLink = [
   {
    label: "Responses",
    href: "/responses",
    icon: <MenuIcon/>
   },
   {
    label: "Feature Request",
    href: "/features",
    icon: <Lightbulb/>
   },
   {
    label: "Bug Report",
    href: "/bugs",
    icon: <Bug/>
   },
   {
    label: "Reviews",
    href: "/review",
    icon: <Star/>
   },
   {
    label: "Roadmap",
    href: "/roadmap",
    icon: <BrickWall/>
   }

]

const SidebarNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 w-full p-2 px-3">
      {navlinks.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(link.href + "/");

        return (
          <Button
            key={link.label}
            onClick={() => router.push(link.href)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex-1 flex w-full justify-start",
              isActive
                ? "bg-green-400 text-black hover:bg-green-200"
                : "hover:bg-neutral-200",
              "gap-2",
            ].join(" ")}
          >
            {link.icon}
            <span>{link.label}</span>
          </Button>
        );
      })}

      <h3 className="text-md text-black font-seimbold text-neutral-600 font-bold mt-4">Analytics and Feedback </h3>
      {
        anlyticalLink.map((link) => {
           const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(link.href + "/");
          
          
           return (
          <Button
            key={link.label}
            onClick={() => router.push(link.href)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex-1 flex w-full justify-start",
              isActive
                ? "bg-green-400 text-black hover:bg-green-200"
                : "hover:bg-neutral-200",

              "gap-2", "hover:text-black"
            ].join(" ")}
          >
            {link.icon}
            <span>{link.label}</span>
          </Button>
        );

        }) 
      }
    </div>
  );
};

export default SidebarNav;
