export const Footer = () => {
  return (
    <footer className="max-w-7xl xl:mx-auto mx-4 p-4 bg-zinc-800/50 text-center py-16 mb-4">
      <p className="text-xl">
        &apos;Minecraft&apos; is a trademark of Mojang. This site is not
        affiliated with Mojang or Microsoft.
      </p>
      <h1 className="text-white text-2xl mt-2">
        &copy;&nbsp;{new Date().getFullYear()} Summit. All rights reserved.
      </h1>
    </footer>
  );
};
