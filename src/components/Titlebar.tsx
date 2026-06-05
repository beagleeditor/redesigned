import { Theme } from "../App";

type Props = {
    theme: Theme;
}

export default function TitleBar({ theme }: Props) {
  return (
    <div className={`titlebar theme-${theme}`}>
      <input className="titlebar-search" placeholder="Search files..." />
    </div>
  );
}
