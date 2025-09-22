import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

export default async function () {
  const session = await auth();

  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
}
