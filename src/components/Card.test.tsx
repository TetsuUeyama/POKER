                                                           
  import { render, screen } from "@testing-library/react";                                                                                            
  import { describe, test, expect } from "vitest";
  import Card from "./Card";

  describe("Card コンポーネント", () => {

    test("スートとランクが表示される", () => {
      // コンポーネントを描画する
      render(<Card suit="♠" rank="A" />);

      // 画面に "♠" と "A" が表示されているか検証
      expect(screen.getByText("♠ A")).toBeDefined();
    });

     test("♥は赤色のクラスが適用される", () => {
    render(<Card suit="♥" rank="K" />);
    const card = screen.getByText("♥ K");
    expect(card.className).toContain("text-red-500");
  });

  test("♠は黒色のクラスが適用される", () => {
    render(<Card suit="♠" rank="K" />);
    const card = screen.getByText("♠ K");
    expect(card.className).toContain("text-black");
  });

  });