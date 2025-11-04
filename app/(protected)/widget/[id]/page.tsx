"use client";
import React, { useEffect } from "react";
import { getWidgetDetails } from "@/actions/widget";
import { useState, use } from "react";
import { Widget } from "@prisma/client";
import HeaderCard from "@/components/headerCard";
import {
  CodeXml,
  Copy,
  Edit,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteWidget } from "@/actions/widget";
import { pauseWidget } from "@/actions/widget";
import { getUserWidgets } from "@/actions/widget";
import { useCallback } from "react";

type WidgetDetailPageProps = {
  params: Promise<{ id: string }>;
};

function WidgetDetailPage({ params }: WidgetDetailPageProps) {
  const [showCode, setShowCode] = useState(false);
  const [widget, setWidget] = useState<Widget | null>(null);
  const { id } = use(params);

  const copyToClipboard = async () => {
    const code = `<script
    defer
    src="https://cdn.feedbask.com/widget.js"
    data-client-key="${widget?.clientId}"
    data-language="en"
    id="feedbask-widget-script"
></script>`;

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy code.");
    }
  };

  useEffect(() => {
    async function getWidget() {
      const widget = await getWidgetDetails(id);
      console.log(widget);
      setWidget(widget);
    }
    getWidget();
  }, [id]);

  const router = useRouter();

  const DeleteWidget = useCallback(async (widgetId: string) => {
    // Optimistic: remove from UI immediately

    const response = await deleteWidget(widgetId);
    if (response.error) {
      toast.error(`Failed to delete: ${response.error}`);
      // Rollback: refetch on error (or restore from backup)
      const res = await getUserWidgets();
    } else {
      toast.success("Widget deleted");
    }
  }, []);

  // Optimistic pause
  const PauseWidget = useCallback(async (widgetId: string) => {
    // Optimistic: update isActive immediately

    const response = await pauseWidget(widgetId);
    if (response.error) {
      toast.error(`Failed to pause: ${response.error}`);
      // Rollback
    } else {
      toast.success("Widget paused");
    }
  }, []);

  return (
    <div className="p-5">
      <div className="flex flex-col gap-2">
        <div className="p-8 rounded-2xl shadow-lg border-1 border-green-400 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-4 items-center">
              <div className="p-4 rounded-2xl bg-green-300">
                <MessageSquare />
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold text-black">
                  {widget?.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Button
                className="px-3 py-2 bg-white/60 border border-green-400 hover:bg-neutral-300 flex gap-2 items-center justify-center"
                onClick={() => setShowCode(!showCode)}
              >
                <CodeXml className="text-lg text-black" size={10} />
                <p className="text-black">Code</p>
              </Button>

              <Button
                className="px-3 py-2 bg-white/60 border border-green-400 hover:bg-neutral-300 flex gap-2 items-center justify-center"
                onClick={() => router.push(`widget/edit/${widget?.id}`)}
              >
                <Edit className="text-lg text-black" size={10} />
                <p className="text-black">Edit</p>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Button
                        className="flex justify-between items-center gap-2 bg-white hover:bg-neutral-300 text-black"
                        onClick={() => (widget?.id ? widget.id : "null")}
                      >
                        <Pause />
                        Pause Widget
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button
                        className="flex justify-between items-center gap-2 bg-white text-red-700 hover:bg-neutral-300 flex-1"
                        onClick={() =>
                          DeleteWidget(widget?.id ? widget.id : "null")
                        }
                      >
                        <Trash className="text-red-700" />
                        Delete Widget
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {showCode && (
          <div className="flex flex-col gap-2  justify-center bg-[#131b2e] p-5 rounded-2xl">
            <div>
              <h3 className="text-white font-bold">Installation and Setup</h3>
            </div>
            <div className="bg-white rounded-2xl p-4 flex flex-col gap-2">
              <h2 className="font-bold text-xl">Widget Installation</h2>

              <div className="flex flex-col gap-2">
                <h3 className="text-slate-600 text-sm px-1">Client Id:</h3>
                <div className="bg-neutral-200 rounded-xl flex flex-col justify-center text-black p-2 w-fit text-sm">
                  {widget?.clientId}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-slate-600 text-sm px-1">
                  Installation Code:
                </h3>
                <div className="flex rounded-xl bg-[#1e1e1e] p-4">
                  <pre className="text-sm font-mono overflow-x-auto">
                    <code>
                      <span className="text-green-400">{`<script`}</span>
                      {`\n    `}
                      <span className="text-green-400">defer</span>
                      {`\n    `}
                      <span className="text-green-400">src=</span>
                      <span className="text-orange-400">{`"https://cdn.feedbask.com/widget.js"`}</span>
                      {`\n    `}
                      <span className="text-green-400">data-client-key=</span>
                      <span className="text-orange-400">{`"${widget?.clientId}"`}</span>
                      {`\n    `}
                      <span className="text-green-400">data-language=</span>
                      <span className="text-orange-400">{`"en"`}</span>
                      {`\n    `}
                      <span className="text-green-400">id=</span>
                      <span className="text-orange-400">{`"feedbask-widget-script"`}</span>
                      {`\n`}
                      <span className="text-green-400">{`></script>`}</span>
                    </code>
                  </pre>
                </div>
              </div>

              <Button
                className="flex items-center justify-center bg-white border-green-500 w-fit px-4 py-2 text-black border-1 hover:bg-neutral-200"
                onClick={() => {
                  copyToClipboard();
                }}
              >
                <Copy />
                Copy
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <h2 className="font-bold text-xl">
                  Identify Logged-in Users (Optional)
                </h2>
              </div>

              <p className="text-gray-600 text-sm">
                To pre-fill user information and link feedback to users in your
                system, call the{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                  identify
                </code>{" "}
                method after a user authenticates on your site.
              </p>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-base">Identify a User</h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto text-white">
                    <code>
                      <span className="text-green-500">{`// Call this after a user logs into your site`}</span>
                      {`\n`}
                      <span className="text-blue-400">window</span>.
                      <span className="text-blue-400">feedback</span>.
                      <span className="text-yellow-300">identify</span>({`({`}
                      {`\n  `}
                      <span className="text-blue-300">userId</span>:{" "}
                      <span className="text-orange-400">'UNIQUE_USER_ID'</span>,{" "}
                      <span className="text-green-500">
                        // Required: A stable, unique ID from your system
                      </span>
                      {`\n  `}
                      <span className="text-blue-300">name</span>:{" "}
                      <span className="text-orange-400">'Ada Lovelace'</span>,{" "}
                      <span className="text-green-500">
                        // Optional: Pre-fills name field
                      </span>
                      {`\n  `}
                      <span className="text-blue-300">email</span>:{" "}
                      <span className="text-orange-400">'ada@example.com'</span>
                      ,{" "}
                      <span className="text-green-500">
                        // Optional: Pre-fills email field
                      </span>
                      {`\n`}
                      {`\n  `}
                      <span className="text-green-500">
                        // You can add any other custom properties
                      </span>
                      {`\n  `}
                      <span className="text-blue-300">plan</span>:{" "}
                      <span className="text-orange-400">'premium'</span>,
                      {`\n  `}
                      <span className="text-blue-300">createdAt</span>:{" "}
                      <span className="text-orange-400">
                        '2023-10-27T10:00:00Z'
                      </span>
                      {`\n`}
                      {`}));`}
                    </code>
                  </pre>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-base">
                  Unidentify a User (on Logout)
                </h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto text-white">
                    <code>
                      <span className="text-green-500">{`// Call this when a user logs out of your site`}</span>
                      {`\n`}
                      <span className="text-blue-400">window</span>.
                      <span className="text-blue-400">feedback</span>.
                      <span className="text-yellow-300">unidentify</span>();
                    </code>
                  </pre>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Important</h4>
                <p className="text-sm text-gray-700">
                  The{" "}
                  <code className="bg-white px-1 py-0.5 rounded text-xs">
                    userId
                  </code>{" "}
                  should be a stable, non-personally identifiable ID from your
                  database. This allows you to consistently track feedback from
                  the same user.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WidgetDetailPage;
