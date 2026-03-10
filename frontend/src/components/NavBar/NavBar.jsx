import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ShoppingCart, User, Moon, Sun, Search } from "lucide-react"
import { useEffect, useState } from "react"
import logo from "../../img/logo-membrana.png"

export function Navbar() {
    const [dark, setDark] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
    }, [dark])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const navItems = ["Inicio", "Productos", "Contacto"]

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
                ? "bg-background/95 backdrop-blur-sm border-border/50 shadow-lg"
                : "bg-background"
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <img
                            src={logo}
                            alt="Membranas"
                            className="h-16 w-auto transition-transform hover:scale-105"
                        />

                        <NavigationMenu className="hidden lg:block">
                            <NavigationMenuList className="gap-1">
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item}>
                                        <NavigationMenuLink className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                                            {item}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="¿Qué estás buscando?"
                                className="pl-9 pr-4 py-2 w-full rounded-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            aria-label="Iniciar sesión"
                            title="Iniciar sesión"
                        >
                            <User className="h-5 w-5" />
                        </Button>

                        <Button variant="ghost" size="icon" className="relative rounded-full">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center shadow-sm">
                                2
                            </span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDark(!dark)}
                            className="rounded-full"
                            aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        >
                            {dark ? (
                                <Sun className="h-5 w-5 transition-transform hover:rotate-45" />
                            ) : (
                                <Moon className="h-5 w-5 transition-transform hover:rotate-45" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
