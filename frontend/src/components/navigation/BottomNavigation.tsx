import { Calendar, Home, PieChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { label: "ホーム", icon: Home },
  { label: "カレンダー", icon: Calendar },
  { label: "統計", icon: PieChart },
  { label: "設定", icon: Settings },
];

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-md justify-around px-2">
        {navItems.map(({ label, icon: Icon }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            className="flex h-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Button>
        ))}
      </nav>
    </div>
  );
}

