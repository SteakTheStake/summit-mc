"use client";

export const RenderBlocks = ({
  layout,
}: {
  layout: {
    [k: string]: unknown;
  }[];
}) => {
  return (
    <div>
      {layout.map((block: any, i: number) => {
        // @ts-ignore
        const Block: React.FC<any> = components[block.blockType];

        if (Block) {
          return <Block {...block} key={i} />;
        }

        return null;
      })}
    </div>
  );
};
