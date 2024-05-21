import type React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-palette1 text-palette3 text-center p-1 m-0">
      <p>
        <span className="font-bold">{`<POC/>`}</span> Powered with ❤️ by{" "}
        <a href="https://salvatorelaspata.net" className="underline">
          Salvatore La Spata
        </a>
      </p>
    </footer>
  );
};
