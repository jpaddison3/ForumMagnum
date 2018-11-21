import React, { Component } from 'react';
import truncatise from 'truncatise';
import { Utils } from 'meteor/vulcan:core';

const highlightMaxChars = 2400;
export const excerptMaxChars = 300;

export const highlightFromMarkdown = (body, mdi) => {
  const htmlBody = mdi.render(body);
  return highlightFromHTML(htmlBody);
}

export const highlightFromHTML = (html) => {
  return Utils.sanitize(truncatise(html, {
    TruncateLength: highlightMaxChars,
    TruncateBy: "characters",
    Suffix: "... (Read More)",
  }));
};

export const excerptFromHTML = (html, truncationCharCount) => {
  const styles = html.match(/<style[\s\S]*?<\/style>/g) || ""
  const htmlRemovedStyles = html.replace(/<style[\s\S]*?<\/style>/g, '');

  return Utils.sanitize(truncatise(htmlRemovedStyles, {
    TruncateLength: truncationCharCount || excerptMaxChars,
    TruncateBy: "characters",
    Suffix: `... <span class="read-more"><a class="read-more-default">(Read more)</a><a class="read-more-tooltip">(Click to expand thread)</a></span>${styles}`,
  }));
};

export const excerptFromMarkdown = (body, mdi) => {
  const htmlBody = mdi.render(body);
  return excerptFromHTML(htmlBody);
}
