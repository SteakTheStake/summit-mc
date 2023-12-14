"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export const Compare = ({ data }: { data: NodeProps }) => {
  return (
    <ReactCompareSlider
      className="border-2"
      itemOne={
        <ReactCompareSliderImage
          src={process.env.NEXT_PUBLIC_API + data.one.url}
          alt={data.one.alt}
          className="!m-0 aspect-video"
        />
      }
      itemTwo={
        <ReactCompareSliderImage
          src={process.env.NEXT_PUBLIC_API + data.two.url}
          alt={data.two.alt}
          className="!m-0 aspect-video"
        />
      }
    />
  );
};

interface NodeProps {
  one: Image;
  two: Image;
}

interface Image {
  url: string;
  alt: string;
}
