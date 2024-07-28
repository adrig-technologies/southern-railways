import { WelcomeScreenContainerUser } from "@/components/custom/home-admin";
import { auth } from "@clerk/nextjs/server";

async function getData() {
  const res = await fetch('https://api.sampleapis.com/wines/reds');
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  auth().protect()

  return res.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      {/* <p>{data[0]?.winery}</p> */}
      <WelcomeScreenContainerUser />
    </>
  );
}