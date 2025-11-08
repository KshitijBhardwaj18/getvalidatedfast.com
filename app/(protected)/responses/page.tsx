import HeaderCard from "@/components/headerCard";
import { Menu } from "lucide-react";

export default function Responses() {
  return (
    <div className="p-5">
      <HeaderCard
        title="Responses"
        description="View and manage response to your survey widget."
        icon={<Menu />}
        actionButton={false}
      />
    </div>
  );
}
