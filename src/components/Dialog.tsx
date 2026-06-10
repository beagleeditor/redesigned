import { ReactNode, useEffect } from "react";

type DialogProps = {
  title: string;
  message: string | ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel: () => void;
};

export default function Dialog({
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: DialogProps) {
  useEffect(() => {
    console.log("Dialog mounted");
  }, []);
  console.log("I'm dialog. I'm called now")
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h3>{title}</h3>

        {typeof message === "string" ? (
          <p>{message}</p>
        ) : (
          message
        )}

        <div className="dialog-actions">
          <button onClick={onCancel}>{cancelText}</button>

          <button className="dialog-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
