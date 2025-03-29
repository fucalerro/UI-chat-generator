"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export const postMessage = async (
  inputMessage: string
): Promise<{ error: boolean; message?: string; styles?: Style }> => {
  console.log(inputMessage);

  const timeout = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await timeout(1000);

  const props = {
    type: "object",
    properties: {
      backgroundColor: {
        type: "string",
        description: "The background colorof the item",
      },
      borderRadius: {
        type: "number",
        description: "The border radius of the item",
      },
      borderColor: {
        type: "string",
        description: "The border color of the item",
      },
      color: {
        type: "string",
        description: "The font color of the item",
      },
      padding: {
        type: "string",
        description: "The padding of the item",
      },
      borderWidth: {
        type: "string",
        description: "The border width of the item",
      },
      margin: {
        type: "string",
        description: "The margin of the item",
      },
      width: {
        type: "string",
        description: "The width of the item",
      },
    },
    additionalProperties: true,
    required: [],
  };

  const schema: OpenAI.ResponseFormatJSONSchema["json_schema"] = {
    name: "output",
    description: "The output message and its style.",
    schema: {
      type: "object",
      properties: {
        outputMessage: {
          type: "string",
          description: "The message to be displayed in the chat box.",
        },
        styles: {
          type: "object",
          properties: {
            outputMessages: props,
            inputMessages: props,
            inputBox: props,
            sendButton: props,
            background: props,
            chatBox: props,
            title: props,
          },
        },
      },
      required: ["outputMessage", "outputStyle"],
    },
  };

  const prePrompt =
    "you must follow user instruction to modify the styling. dont hesitate to be creative and use shadows, hover, and other css properties to make it look good. \n\n";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: {
      type: "json_schema",
      json_schema: schema,
    },
    messages: [{ role: "user", content: prePrompt + "\n\n" + inputMessage }],
  });

  const msg = completion.choices[0].message;

  if (!msg.content) {
    return {
      error: true,
    };
  }

  const parsed = JSON.parse(msg.content);
  console.log({ parsed });

  return {
    error: false,
    message: parsed.outputMessage,
    styles: parsed.styles,
  };
};

type PrimitiveStyle = {
  [key: string]: string | number | undefined;
};

export type Style = {
  outputMessages: PrimitiveStyle;
  inputMessages: PrimitiveStyle;
  inputBox: PrimitiveStyle;
  sendButton: PrimitiveStyle;
  background: PrimitiveStyle;
  chatBox: PrimitiveStyle;
  title: PrimitiveStyle;
};
