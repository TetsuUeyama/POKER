"use client";
  import { createContext, useContext, useState } from "react";

  const PlayerContext = createContext<{ playerName: string; setPlayerName: (name: string) => void }>({ playerName: "ゲスト", setPlayerName: () => {} });

    export function usePlayer() {
    return useContext(PlayerContext);
  }
  export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [playerName, setPlayerName] = useState("ゲスト");
    return (
      <PlayerContext.Provider value={{ playerName, setPlayerName }}>
        {children}
      </PlayerContext.Provider>
    );
  }