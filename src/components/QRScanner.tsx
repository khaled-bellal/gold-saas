import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

interface Props {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // يمنع double start (React Strict Mode)
    startedRef.current = true;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },

        // ✅ success
        (decodedText) => {
          console.log("SCANNED:", decodedText);

          onScan(decodedText);

          // 🔥 stop safe
          scanner
            .stop()
            .then(() => scanner.clear())
            .catch(() => {});
        },

        // ✅ failure (مهم باش تسكت errors)
        () => {}
      )
      .catch((err) => {
        console.error("Start error:", err);
      });

    return () => {
      // 🔥 cleanup safe
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
      }
    };
  }, []);

  return <div id="reader" style={{ width: "100%" }} />;
}