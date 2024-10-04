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

export function subscribeToEditorEvent(
  eventName: string,
  listener: EventListenerOrEventListenerObject,
): void {
  document.addEventListener(eventName, listener);
}

export function unsubscribeFromEditorEvent(
  eventName: string,
  listener: EventListenerOrEventListenerObject,
): void {
  document.removeEventListener(eventName, listener);
}

export function dispatchEditorEvent(eventName: string, data?: any): void {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}
