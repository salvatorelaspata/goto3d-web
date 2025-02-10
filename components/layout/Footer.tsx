import type React from "react";
export const Footer: React.FC = () => {
  return (
    <footer className="m-0 bg-palette1 p-1 text-center text-palette3">
      <p>
        <span className="font-bold">{`<POC/>`}</span> Powered with ❤️ by{" "}
        <a href="https://salvatorelaspata.net" className="underline">
          Salvatore La Spata
        </a>
      </p>
    </footer>
  );
};
