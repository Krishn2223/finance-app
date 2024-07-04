"use client";
//for rendering user name from gmail login. 
import { useUser } from "@clerk/nextjs";

const WelcomeMsg = () => {
const {user,isLoaded}=useUser();

  return ( 
    <div className="space-y-2 mb-4">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Welcome back{isLoaded ? ", ":" "}{user?.firstName} 👋 
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        This is you financial overview report
      </p>
    </div>
   );
}
 
export default WelcomeMsg;