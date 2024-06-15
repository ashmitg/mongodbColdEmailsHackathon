"use client";
import { Button } from "@/components/ui/button";

export default function Page() {
  const clicked = async () => {
    console.log("gonna call run");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-center text-3xl">Repo Page</h1>
      <Button
        className="content-center w-[30rem] h-[3rem] my-4"
        onClick={clicked}
      >
        Run
      </Button>

      <Button
        className="content-center w-[30rem] h-[3rem] my-4"
        onClick={clickRes}
      >
        clickRes
      </Button>
    </div>
  );
}
