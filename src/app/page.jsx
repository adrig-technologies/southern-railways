import { currentUser } from '@clerk/nextjs/server';
import { WelcomeScreenContainer } from "@/components/custom/home";

async function getData() {
  const res = await fetch('https://api.sampleapis.com/wines/reds');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  console.log(user);

  return res.json();
}

export default async function Home() {
  try {
    // Fetch the current user
    const user = await currentUser();
    
    // Fetch the data
    const data = await getData();
    // Assuming user object contains organization details
    const organizationRole = user?.organization?.role || "No organization role found";

    
    return (
      <>
        <p>Current User: {user ? user.fullName : "No user logged in"}</p>
        <p>Organization Role: {organizationRole}</p>
        <p>First Winery: {data[0]?.winery}</p>
        <WelcomeScreenContainer />
      </>
    );
  } catch (error) {
    return (
      <>
        <p>Error: {error.message}</p>
        <WelcomeScreenContainer />
      </>
    );
  }
}