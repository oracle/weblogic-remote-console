import { Context } from "wrc/resource/resource";
import { Response } from "../typedefs/common";
export declare const broadcastErrorMessage: (ctx: Context | null, err: Error) => void;
export declare const broadcastMessageResponse: (ctx: Context | null, messageResponse: Response) => void;
