/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Notifications */
import { Point2d, XAndY } from "@bentley/geometry-core";
import { IModelApp } from "./IModelApp";
import { BeDuration } from "@bentley/bentleyjs-core";

/** Describes the type and behavior of a [[NotifyMessageDetails]]. */
export const enum OutputMessageType {
  /** Temporary messagebox that displays at the bottom of the screen. */
  Toast = 0,
  Pointer = 1,
  Sticky = 2,
  InputField = 3,
  /** Modal message box. */
  Alert = 4,
}

/** Classifies a [[NotifyMessageDetails]] by its level of importance. */
export const enum OutputMessagePriority {
  None = 0,
  Error = 10,
  Warning = 11,
  Info = 12,
  Debug = 13,
  Fatal = 17,
}

/** Describes the alert behavior of a [[NotifyMessageDetails]]. */
export const enum OutputMessageAlert {
  None = 0,
  Dialog = 1,
  Balloon = 2,
}

/** Relative Position for setPointerTypeDetails */
export const enum RelativePosition {
  Left = 0,
  Top = 1,
  Right = 2,
  Bottom = 3,
  TopLeft = 4,
  TopRight = 5,
  BottomLeft = 6,
  BottomRight = 7,
}

/** Reason for ending the activity message via endActivityMessage */
export const enum ActivityMessageEndReason {
  Completed = 0,
  Cancelled = 1,
}

/** Describes the set of buttons displayed in a messagebox opened using [[NotificationManager.openMessageBox]]. */
export const enum MessageBoxType {
  OkCancel,
  Ok,
  LargeOk,
  MediumAlert,
  YesNoCancel,
  YesNo,
}

/** Describes the icon displayed in a messagebox opened using [[NotificationManager.openMessageBox]]. */
export const enum MessageBoxIconType {
  NoSymbol = 0,   // Means Don't draw Symbol
  Information = 1,   // Lower Case i
  Question = 2,   // Question Mark
  Warning = 3,   // Exclamation Point
  Critical = 4,   // Stop Sign
}

/** Describes the possible return values produced when the user clicks a button in a messagebox opened using [[NotificationManager.openMessageBox]]. */
export const enum MessageBoxValue {
  Apply = 1,
  Reset = 2,
  Ok = 3,
  Cancel = 4,
  Default = 5,
  Yes = 6,
  No = 7,
  Retry = 8,
  Stop = 9,
  Help = 10,
  YesToAll = 11,
  NoToAll = 12,
}

/** Describes the behavior of a tooltip created using [[NotificationManager.openToolTip]]. */
export interface ToolTipOptions {
  duration?: BeDuration;
  placement?: string;
}

/** Describes a message to be displayed to the user. */
export class NotifyMessageDetails {
  public displayTime = BeDuration.fromSeconds(3.5);
  public viewport?: HTMLElement;
  public displayPoint?: Point2d;
  public relativePosition = RelativePosition.TopRight;

  /** Constructor
   *  @param priority        The priority this message should be accorded by the NotificationManager.
   *  @param briefMsg        A short message that conveys the simplest explanation of the issue.
   *  @param detailedMsg     A comprehensive message that explains the issue in detail and potentially offers a solution.
   *  @param msgType         The type of message.
   *  @param openAlert       Whether an alert box should be displayed or not, and if so what kind.
   */
  public constructor(public priority: OutputMessagePriority, public briefMessage: string, public detailedMessage?: string, public msgType = OutputMessageType.Toast, public openAlert = OutputMessageAlert.None) { }

  /** Set OutputMessageType.Pointer message details.
   * @param viewport            Viewport over which to display the Pointer type message.
   * @param displayPoint        Point at which to display the Pointer type message.
   * @param relativePosition    Position relative to displayPoint at which to display the Pointer type message.
   */
  public setPointerTypeDetails(viewport: HTMLElement, displayPoint: XAndY, relativePosition = RelativePosition.TopRight) {
    this.viewport = viewport;
    this.displayPoint = Point2d.fromJSON(displayPoint);
    this.relativePosition = relativePosition;
  }
}

/**
 * Specifies the details of an activity message to be displayed to the user.
 */
export class ActivityMessageDetails {
  public wasCancelled = false;

  /**
   * @param showProgressBar         Indicates whether to show the progress bar in the activity message dialog.
   * @param showPercentInMessage    Indicates whether to show the percentage complete in the activity message text.
   * @param supportsCancellation    Indicates whether to show the Cancel button, giving the user the ability to cancel the operation.
   * @param showDialogInitially     Indicates whether to show the activity message dialog initially. User can click status bar to open it.
   */
  public constructor(public showProgressBar: boolean, public showPercentInMessage: boolean, public supportsCancellation: boolean, public showDialogInitially: boolean = true) { }

  /** Called from NotificationAdmin when the user cancels the activity. */
  public onActivityCancelled() { this.wasCancelled = true; }

  /** Called from NotificationAdmin when the activity completes successfully. */
  public onActivityCompleted() { this.wasCancelled = false; }
}

/**
 * The NotificationManager controls the interaction with the user for prompts, error messages, and alert dialogs.
 * Implementations of the NotificationManager may present the information in different ways. For example, in
 * non-interactive sessions, these messages may be saved to a log file or simply discarded.
 */
export class NotificationManager {
  public readonly toolTipLocation = new Point2d();

  /** Output a prompt, given an i18n key. */
  public outputPromptByKey(key: string) { this.outputPrompt(IModelApp.i18n.translate(key)); }

  /** Output a localized prompt to the user. A 'prompt' indicates an action the user should take to proceed.
   * @param _prompt The localized string with the prompt message.
   */
  public outputPrompt(_prompt: string) { }

  /** Output a message and/or alert to the user. */
  public outputMessage(_message: NotifyMessageDetails) { }

  /** Output a MessageBox and wait for response from the user.
   * @param _mbType       The MessageBox type.
   * @param _message      The message to display.
   * @param _icon         The MessageBox icon type.
   * @return the response from the user.
   */
  public async openMessageBox(_mbType: MessageBoxType, _message: string, _icon: MessageBoxIconType): Promise<MessageBoxValue> { return Promise.resolve(MessageBoxValue.Ok); }

  /**
   * Set up for activity messages.
   * @param _details  The activity message details.
   * @return true if the message was displayed, false if an invalid priority is specified.
   */
  public setupActivityMessage(_details: ActivityMessageDetails) { return true; }

  /**
   * Output an activity message to the user.
   * @param _messageText The message text.
   * @param _percentComplete The percentage of completion.
   * @return true if the message was displayed, false if the message could not be displayed.
   */
  public outputActivityMessage(_messageText: string, _percentComplete: number) { return true; }

  /**
   * End an activity message.
   * @param _reason The reason for the end of the Activity Message.
   * @return true if the message was ended successfully, false if the activityMessage could not be ended.
   */
  public endActivityMessage(_reason: ActivityMessageEndReason) { return true; }

  /** Return true if _showTooltip has an implementation and will display a tooltip. */
  public get isToolTipSupported(): boolean { return false; }

  /** Return true if the tooltip is currently open. */
  public get isToolTipOpen(): boolean { return false; }

  /** Implement to display a tooltip message at the specified location. */
  protected _showToolTip(_htmlElement: HTMLElement, _message: HTMLElement | string, _location?: XAndY, _options?: ToolTipOptions): void { }

  /** Show a tooltip window. Saves tooltip location for AccuSnap to test if cursor has moved far enough away to close tooltip.
   * @param htmlElement The HTMLElement that that anchors the toolTip.
   * @param message What to display inside the ToolTip. String may include HTML.
   * @param location An optional location, relative to the origin of _htmlElement, for the ToolTip. If undefined, center of _htmlElement
   * @param options Options that supply additional information about how the ToolTip should function.
   */
  public openToolTip(_htmlElement: HTMLElement, message: HTMLElement | string, location?: XAndY, options?: ToolTipOptions): void {
    this.toolTipLocation.setFrom(location);
    this._showToolTip(_htmlElement, message, location, options);
  }

  /** Clear the tooltip if it is currently open. */
  public clearToolTip(): void { }

  /** Close message created with [[OutputMessageType.Pointer]]. */
  public closePointerMessage(): void { }
}
