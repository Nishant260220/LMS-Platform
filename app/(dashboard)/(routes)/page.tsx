import { Appbar } from "@/components/app";
import { Button } from "@/components/ui/button";


export default async function Home() {
  return (
    <div>
      <p className="text-3xl font-medium text-sky-700">
        This page is protected
      </p>
      <Button variant={"outline"}>Hello</Button>
      <Appbar />
    </div>
  );
}
