"use client";
import React from "react";
import { Button } from "../ui/button";
import { House, PanelsTopLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const links = [
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

const SidebarNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 w-full p-2 px-3">
      {links.map((link) => {
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
    </div>
  );
};

export default SidebarNav;
