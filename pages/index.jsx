import * as React from "react";
import DefaultLayout from "../src/components/layout/DefaultLayout";
import { useSession } from "next-auth/react";
import Hero from "../src/components/landing/Hero";
import Portal from "./protected/portal";

export default function Index() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <DefaultLayout>
        <Hero />
      </DefaultLayout>
    );
  } else {
    return (
      <DefaultLayout>
        <Portal />
      </DefaultLayout>
    );
  }
  
}
