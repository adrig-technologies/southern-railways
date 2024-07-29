import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import WelcomeScreenContainer from '../../components/custom/home/WelcomeScreenContainer';



export default async function Home() {
 
  const user = await currentUser();

  // Check if user is an admin
  const isAdmin = user?.emailAddresses.some(email => email.emailAddress === "nishaanthms1@gmail.com");

  // Redirect if the user is an admin
  if (isAdmin) {
    redirect('/admin-home');
  }

    return (
      <>
        <WelcomeScreenContainer />
      </>
    );
  
}