// src/components/dashboard/header.tsx
"use client";

import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  // حرف اول نام کاربر برای avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "?";

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="md:hidden">
          <span className="font-bold">دایرکتوری مشاغل</span>
        </div>

        <div className="flex-1" />

        {isLoading ? (
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className="flex items-center gap-2 px-2" />}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm">{user.name}</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                <UserIcon className="h-4 w-4 me-2" />
                پروفایل
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 me-2" />
                خروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}