import { ConnectKitButton } from "connectkit";

export function Navbar() {
  return (
    <div className="w-full border-b border-metal-gray py-4 px-4 bg-white">
      <div className="w-full md:max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="font-medium text-xl">idasa.</h1>
        <ConnectKitButton />
      </div>
    </div>
  );
}
