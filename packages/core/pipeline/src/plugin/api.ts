import { Registrable } from "../registry";
import { FileItem, FormItemProps, Pipeline, Runnable, Step } from "../d.ts";
import { FileStore } from "../core/file-store";
import { Logger } from "log4js";
import { IAccessService } from "../access";
import { IEmailService } from "../service";
import { IContext } from "../core";
import { AxiosInstance } from "axios";
import { logger } from "../utils";

export enum ContextScope {
  global,
  pipeline,
  runtime,
}

export type TaskOutputDefine = {
  title: string;
  value?: any;
};

export type TaskInputDefine = FormItemProps;

export type PluginDefine = Registrable & {
  default?: any;
  input?: {
    [key: string]: TaskInputDefine;
  };
  output?: {
    [key: string]: TaskOutputDefine;
  };

  autowire?: {
    [key: string]: any;
  };

  reference?: {
    src: string;
    dest: string;
    type: "computed";
  }[];
};

export type ITaskPlugin = {
  onInstance(): Promise<void>;
  execute(): Promise<void>;
  [key: string]: any;
};

export type TaskResult = {
  clearLastStatus?: boolean;
  files?: FileItem[];
};
export type TaskInstanceContext = {
  pipeline: Pipeline;
  step: Step;
  logger: Logger;
  accessService: IAccessService;
  emailService: IEmailService;
  pipelineContext: IContext;
  userContext: IContext;
  http: AxiosInstance;
  fileStore: FileStore;
  lastStatus?: Runnable;
};

export abstract class AbstractTaskPlugin implements ITaskPlugin {
  _result: TaskResult = { clearLastStatus: false, files: [] };
  ctx!: TaskInstanceContext;
  clearLastStatus() {
    this._result.clearLastStatus = true;
  }

  getFiles() {
    return this._result.files;
  }

  setCtx(ctx: TaskInstanceContext) {
    this.ctx = ctx;
  }

  randomFileId() {
    return Math.random().toString(36).substring(2, 9);
  }
  linkFile(file: FileItem) {
    this._result.files!.push({
      ...file,
      id: this.randomFileId(),
    });
  }
  saveFile(filename: string, file: Buffer) {
    const filePath = this.ctx.fileStore.writeFile(filename, file);
    logger.info(`saveFile:${filePath}`);
    this._result.files!.push({
      id: this.randomFileId(),
      filename,
      path: filePath,
    });
  }

  get pipeline() {
    return this.ctx.pipeline;
  }

  get step() {
    return this.ctx.step;
  }

  async onInstance(): Promise<void> {
    return;
  }

  abstract execute(): Promise<void>;
}

export type OutputVO = {
  key: string;
  title: string;
  value: any;
};
