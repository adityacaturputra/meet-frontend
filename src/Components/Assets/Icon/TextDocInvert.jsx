// eslint-disable-next-line import/no-extraneous-dependencies
import { Icon } from "@iconify/react";

export default function TextDocInvert({
  color = "#016DB2",
  width = 16,
}) {
  return (
    <Icon
      icon="entypo:text-document-inverted"
      color={color}
      width={width}
    />
  );
}
