/*
 * Copyright (C) PU Convocation Management System Authors
 *
 * This software is owned by PU Convocation Management System Authors.
 * No part of the software is allowed to be copied or distributed
 * in any form. Any attempt to do so will be considered a violation
 * of copyright law.
 *
 * This software is protected by copyright law and international
 * treaties. Unauthorized copying or distribution of this software
 * is a violation of these laws and could result in severe penalties.
 */

import { Fragment, type JSX } from "react";
import { generateUUID, getBlockNode, getYouTubeVideoID } from "../../utils";
import {
  type Action,
  type Attachment,
  type BlockLifecycle,
  type BlockSchema,
  type Coordinates,
  type Style
} from "../../interfaces";
import { EmbedPicker } from "../../components/EmbedPicker";
import {
  AlignCenterIcon,
  AlignEndIcon,
  AlignStartIcon,
  ChangeIcon,
  DeleteIcon,
  ResizeIcon,
  YouTubeIcon
} from "../../assets";
import { AttachmentHolder } from "../../components/AttachmentHolder";
import { SizeDialog } from "../../components/SizeDialog";
import { type AttachmentBlockSchema } from "../../schema";
import { YoutubeURLRegex } from "../../constants";

interface YouTubeVideoBlockProps {
  block: AttachmentBlockSchema;
  blockLifecycle: BlockLifecycle;
}

const youtubeAttachmentActions: readonly Action[] = [
  {
    id: generateUUID(),
    name: "Align Left",
    icon: <AlignStartIcon size={30} />,
    execute: {
      type: "blockFunction",
      args: (block, onChange) => {
        const style: Style = {
          name: "text-align",
          value: "left",
        };
        const index = block.style.map((sty) => sty.name).indexOf(style.name);
        if (index === -1) {
          block.style.push(style);
        } else {
          block.style[index] = style;
        }
        onChange(block, block.id);
      },
    },
  },
  {
    id: generateUUID(),
    name: "Align Center",
    icon: <AlignCenterIcon size={30} />,
    execute: {
      type: "blockFunction",
      args: (block, onChange) => {
        const style: Style = {
          name: "text-align",
          value: "center",
        };
        const index = block.style.map((sty) => sty.name).indexOf(style.name);
        if (index === -1) {
          block.style.push(style);
        } else {
          block.style[index] = style;
        }
        onChange(block, block.id);
      },
    },
  },
  {
    id: generateUUID(),
    name: "Align Right",
    icon: <AlignEndIcon size={30} />,
    execute: {
      type: "blockFunction",
      args: (block, onChange) => {
        const style: Style = {
          name: "text-align",
          value: "right",
        };
        const index = block.style.map((sty) => sty.name).indexOf(style.name);
        if (index === -1) {
          block.style.push(style);
        } else {
          block.style[index] = style;
        }
        onChange(block, block.id);
      },
    },
  },
  {
    id: generateUUID(),
    name: "Resize",
    icon: <ResizeIcon size={30} />,
    execute: {
      type: "blockFunction",
      args: (block, onChange, _onDelete, _popupRoot, dialogRoot) => {
        if (dialogRoot !== undefined) {
          const currentNode = getBlockNode(block.id) as HTMLElement;
          const coordinates: Coordinates = {
            y: currentNode.getBoundingClientRect().y,
            x: currentNode.getBoundingClientRect().right,
          };

          dialogRoot.render(
            <SizeDialog
              initialSize={{
                width: (block.data as Attachment).width,
                height: (block.data as Attachment).height,
              }}
              coordinates={coordinates}
              onConfirm={(width, height) => {
                (block.data as Attachment).width = width;
                (block.data as Attachment).height = height;
                onChange(block, block.id);
              }}
              onClose={() => {
                dialogRoot.render(<Fragment />);
              }}
            />,
          );
        }
      },
    },
  },
  {
    id: generateUUID(),
    name: "Change",
    icon: <ChangeIcon size={30} />,
    execute: {
      type: "blockFunction",
      args: (block, onChange) => {
        (block.data as Attachment).url = "";
        onChange(block, block.id);
      },
    },
  },
  {
    id: generateUUID(),
    name: "Remove",
    icon: <DeleteIcon size={30} />,
    execute: {
      type: "blockFunction",
      args: (block, _onChange, onDelete) => {
        onDelete(block);
      },
    },
  },
];
export default function YouTubeVideoBlock({
  block,
  blockLifecycle,
}: YouTubeVideoBlockProps): JSX.Element {
  const { previousParentBlock, listMetadata, onChange, onCreate, onDelete } =
    blockLifecycle;
  const attachment = block.data;

  function deleteHandler(): void {
    if (listMetadata !== undefined) {
      const listData = listMetadata.parent.data as BlockSchema[];
      listData.splice(listMetadata.currentIndex, 1);
      listMetadata.parent.data = listData;

      if (
        listMetadata.currentIndex === 0 &&
        listData.length > 0 &&
        previousParentBlock != null
      ) {
        onDelete(
          block,
          listData[listMetadata.currentIndex],
          listData[listMetadata.currentIndex].id,
          false,
          listMetadata.parent.data,
        );
      } else if (
        listMetadata.currentIndex === 0 &&
        listData.length === 0 &&
        previousParentBlock != null
      ) {
        onDelete(
          listMetadata.parent,
          previousParentBlock,
          previousParentBlock.id,
        );
      } else if (
        listMetadata.currentIndex === 0 &&
        listData.length === 0 &&
        previousParentBlock == null
      ) {
        const emptyBlock: BlockSchema = {
          id: generateUUID(),
          data: "",
          role: "paragraph",
          style: [],
        };
        onCreate(listMetadata.parent, emptyBlock, undefined, {
          nodeId: emptyBlock.id,
        });
        onDelete(listMetadata.parent, emptyBlock, emptyBlock.id);
      } else {
        onDelete(
          block,
          listData[listMetadata.currentIndex - 1],
          listData[listMetadata.currentIndex - 1].id,
          false,
          listMetadata.parent.data,
        );
      }
      return;
    }

    if (previousParentBlock == null) {
      const emptyBlock: BlockSchema = {
        id: generateUUID(),
        data: "",
        role: "paragraph",
        style: [],
      };
      onCreate(block, emptyBlock, undefined, {
        nodeId: emptyBlock.id,
      });
      onDelete(block, emptyBlock, emptyBlock.id, true);
      return;
    }

    onDelete(block, previousParentBlock, previousParentBlock.id);
  }

  if (attachment.url === "") {
    return (
      <EmbedPicker
        id={block.id}
        listMetadata={listMetadata}
        icon={<YouTubeIcon size={25} />}
        message={"Click here to embed a YouTube Video"}
        regex={YoutubeURLRegex}
        onEmbedPicked={(url) => {
          attachment.url = url;
          block.data = attachment;
          onChange(block, true);
        }}
        onDelete={() => {
          deleteHandler();
        }}
      />
    );
  }

  return (
    <AttachmentHolder
      block={block}
      actions={youtubeAttachmentActions}
      onDelete={deleteHandler}
      onChange={onChange}
    >
      <iframe
        id={block.id}
        data-parent-block-id={
          listMetadata === undefined ? null : listMetadata.parent.id
        }
        data-child-block-index={
          listMetadata === undefined ? null : listMetadata.currentIndex
        }
        data-block-url={attachment.url}
        width={attachment.width}
        height={attachment.height}
        src={`https://www.youtube.com/embed/${getYouTubeVideoID(
          attachment.url,
        )}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={true}
        className={"rounded-md inline-block border border-gray-300"}
      />
    </AttachmentHolder>
  );
}
