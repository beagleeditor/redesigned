type StatusBarProps = {
  language: string;
};

export default function StatusBar({ language }: StatusBarProps) {
  return (
    <footer className="status-bar">
      <span>{language}</span>
    </footer>
  );
}
