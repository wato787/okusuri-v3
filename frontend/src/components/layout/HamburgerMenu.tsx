'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, Menu, User } from "lucide-react";

export function HamburgerMenu() {
  const menuItems = [
    {
      label: "ログイン / 登録",
      icon: LogIn,
      onClick: () => {
        // TODO: 認証モーダルや遷移処理を実装
      },
    },
    {
      label: "プロフィール",
      icon: User,
      onClick: () => {
        // TODO: プロフィールモーダルや遷移処理を実装
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className="flex items-center cursor-pointer"
            onClick={item.onClick}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          追加メニューは今後実装予定
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
