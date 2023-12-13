"use client";

import { Component as content } from "./rich-text";
const components = { content };

export const RenderBlocks = ({ layout }: { layout: any }) => {
  return (
    <div>
      {layout.map((block: any, i: number) => {
        console.log(layout);
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
