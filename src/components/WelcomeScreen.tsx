type Props = {
  onOpen: () => void;
  onNewFile: () => void;
  onOpenFolder: () => void;
};

export default function WelcomeScreen({ onOpen, onNewFile, onOpenFolder }: Props) {
  return (
    <div className="welcome">
      <h1>🐾 BeagleEditor</h1>

      <p>A focused editor for coding and writing.</p>

      <div className="welcome-actions">
        <button onClick={onNewFile}>New File</button>

        <button onClick={onOpen}>Open File</button>

        <button onClick={onOpenFolder}>Open Folder</button>
      </div>
    </div>
  );
}
