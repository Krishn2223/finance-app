//when we want to use hook we have to write 'use client'. It is like boundry.
"use client";

import { usePathname , useRouter} from "next/navigation";
import NavButton from "./nav-button";
import { useMedia } from "react-use";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const routes = [
{
  href : "/",
  label:"Overview",
},
{
  href : "/transactions",
  label:"Transactions",
},
{
  href : "/accounts",
  label:"Accounts",
},
{
  href : "/categories",
  label:"Categories",
},
{
  href : "/settings",
  label:"Settings",
},
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)",false);

  const onClick = (href:string)=>{
    router.push(href);
    setIsOpen(false);
  }

  //For mobile view
  if(isMobile){
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant={"outline"}
            size={"sm"}
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
            >
              <Menu className="size-4"/>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route)=>(
              <Button 
                key={route.href}
                variant={route.href === pathname ? "secondary":"ghost"}
                onClick={()=>onClick(route.href)}
                className="w-full justify-start"
                >
                  {route.label}
              </Button>

            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }
  
  return ( 
    <nav className="hiiden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((routes)=>(
       <NavButton 
        key={routes.href}
        href = {routes.href}
        label = {routes.label}
        isActive = {pathname===routes.href}
       />
      ))}
    </nav>
   );
}
 
export default Navigation;