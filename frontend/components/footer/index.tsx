import { MuteButton } from "./mute";

export const Footer = () => {
  return (
    <footer className="mx-4 mb-4 flex max-w-7xl flex-col items-center justify-center gap-2 bg-zinc-800/50 p-4 py-16 text-center xl:mx-auto">
      <p className="text-xl">
        &apos;Minecraft&apos; is a trademark of Mojang. This site is not
        affiliated with Mojang or Microsoft.
      </p>
      <h1 className="text-2xl text-white">
        &copy;&nbsp;{new Date().getFullYear()} Summit. All rights reserved.
      </h1>
      <MuteButton />
    </footer>
  );
};
