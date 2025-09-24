// components/widgetpage/header.tsx
import React from "react";
import Link from "next/link";

import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionButton: boolean;
  actionButtonText?: string;
  actionHref?: string;
}

const HeaderCard = ({
  icon,
  title,
  description,
  actionButton,
  actionButtonText,
  actionHref,
}: HeaderProps) => {
  return (
    <div className="p-8 rounded-2xl shadow-lg border-1 border-green-400 bg-gradient-to-r from-green-50 to-white">
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <div className="p-4 rounded-2xl bg-green-300">{icon}</div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-black">{title}</h1>
            <p className="text-sm text-neutral-400">{description}</p>
          </div>
        </div>

        {actionButton && actionHref ? (
          <div>
            <Button
              asChild
              className="px-3 py-2 bg-green-400 hover:bg-green-600 flex gap-2 items-center justify-center"
            >
              <Link href={actionHref}>
                  <Plus/>
                {actionButtonText}
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderCard;
