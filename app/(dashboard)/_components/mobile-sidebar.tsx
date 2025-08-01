import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"
export const MobileSidebar = () => {
    return(
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu/>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                 <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}