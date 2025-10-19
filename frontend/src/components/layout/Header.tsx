import { HamburgerMenu } from "./HamburgerMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container relative flex h-14 items-center justify-between">
        <div className="absolute left-0">
          <div className="w-10" />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 transform font-medium">
          おくすり管理
        </div>

        <div className="absolute right-0">
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
