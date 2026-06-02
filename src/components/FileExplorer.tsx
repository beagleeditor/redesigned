import { useState } from "react";

export type FileNode = {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileNode[];
};

type Props = {
  tree: FileNode | null;
  onOpenFile: (path: string) => void;
};

export default function FileExplorer({ tree, onOpenFile }: Props) {
  if (!tree) return <div className="explorer">No folder opened</div>;

  return (
    <div className="explorer">
      <div className="explorer-title">EXPLORER</div>
      <div className="explorer-content">
        <TreeNode node={tree} onOpenFile={onOpenFile} />
      </div>
    </div>
  );
}

function TreeNode({
  node,
  onOpenFile,
}: {
  node: FileNode;
  onOpenFile: (path: string) => void;
}) {
  const [open, setOpen] = useState(true);

  if (!node.is_dir) {
    return (
      <div className="file" onClick={() => onOpenFile(node.path)}>
        📄 {node.name}
      </div>
    );
  }

  return (
    <div>
      <div className="folder" onClick={() => setOpen(!open)}>
        📁 {node.name}
      </div>

      {open && (
        <div style={{ paddingLeft: 12 }}>
          {node.children?.map((child) => (
            <TreeNode key={child.path} node={child} onOpenFile={onOpenFile} />
          ))}
        </div>
      )}
    </div>
  );
}
