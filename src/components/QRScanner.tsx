import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

interface Props {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: Props) {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().then(() => scanner.clear());
        },
        () => {}
      )
      .catch((err) => {
        console.error("Camera error:", err);
        alert("Camera not working ❌");
      });

    return () => {
      scanner.stop().then(() => scanner.clear()).catch(() => {});
    };
  }, []);

  return <div id="reader" style={{ width: "100%" }} />;
}