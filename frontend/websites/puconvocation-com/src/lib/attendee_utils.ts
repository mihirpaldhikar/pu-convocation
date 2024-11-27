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

export function smoothScrollLeftWithinDiv(
  container: HTMLElement,
  scrollAmount: number,
  duration: number = 300,
): void {
  const start = container.scrollLeft;
  const end = start + scrollAmount;
  const startTime = performance.now();

  function animateScroll(currentTime: number) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);
    container.scrollLeft = start + (end - start) * easedProgress;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function isElementInViewport(
  child: HTMLElement,
  parent: HTMLElement,
): boolean {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  return (
    childRect.top >= parentRect.top &&
    childRect.left >= parentRect.left &&
    childRect.bottom <= parentRect.bottom &&
    childRect.right <= parentRect.right
  );
}
