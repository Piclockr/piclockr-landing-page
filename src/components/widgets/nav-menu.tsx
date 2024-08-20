import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

const navItems = [
    {
        id: "features",
        title: "Features",
    },
    {
        id: "pricing",
        title: "Pricing",
    },
    {
        id: "faq",
        title: "FAQ",
    },
];

export function MainNavigationMenu() {
    return (
        <>
            <DesktopNavigationMenu />
            <MobileNavigationMenu />
        </>
    );
}

const MobileNavigationMenu = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="secondary" size="sm" className="mr-2 h-8 px-1.5 md:hidden">
                        <Icon icon="mdi:menu" className="size-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="top">
                    <SheetHeader>
                        <div className="flex justify-center items-center gap-8">
                            <a href="/" className="flex items-center space-x-2  gap-4">
                                <span className="font-bold inline-block">Piclockr</span>
                            </a>
                        </div>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 pt-6">
                        {navItems.map((item) => (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="px-0"
                                onClick={() => {
                                    setOpen(false);
                                }}
                                asChild
                            >
                                <a href={`#${item.id}`}>{item.title}</a>
                            </Button>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

const DesktopNavigationMenu = () => {
    return (
        <>
            <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                    {navItems.map((item) => (
                        <NavigationMenuItem>
                            <NavigationMenuLink href={`#${item.id}`} className={navigationMenuTriggerStyle()}>
                                {item.title}
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
};

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className,
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
