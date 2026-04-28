import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

interface Props {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          console.log("SCANNED:", decodedText); // مهم

          onScan(decodedText);

          if (isRunningRef.current) {
            scanner
              .stop()
              .then(() => {
                isRunningRef.current = false;
                scanner.clear();
              })
              .catch(() => {});
          }
        },
        () => {}
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.error("Camera error:", err);
        alert("Camera not working ❌");
      });

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            isRunningRef.current = false;
            scannerRef.current?.clear();
          })
          .catch(() => {});
      }
    };
  }, []);

  return <div id="reader" style={{ width: "100%" }} />;
}