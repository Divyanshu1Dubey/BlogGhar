'use client';

/**
 * CustomBlogFrame — safe isolated wrapper for CUSTOM_CODE blog posts.
 *
 * Sanitizes the outer wrapper environment so custom code blogs cannot
 * escape their container or interfere with the main application:
 * - customCss is scoped under a unique attribute
 * - customJs is injected inside a sandboxed iframe
 * - customHtml is rendered as-is (must be sanitized server-side)
 */

import { useId } from 'react';

interface Props {
  customHtml: string;
  customCss?: string | null;
  customJs?: string | null;
}

export default function CustomBlogFrame({ customHtml, customCss, customJs }: Props) {
  const uid = useId().replace(/:/g, '');

  return (
    <div className="custom-blog-frame">
      {/* Scoped CSS */}
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: scopedCss(customCss, uid) }} />
      )}

      {/* Isolated JS iframe (optional) */}
      {customJs && (
        <iframe
          sandbox="allow-scripts"
          srcDoc={`<html><body><script>${customJs}<\/script></body></html>`}
          className="custom-blog-iframe"
          title="Custom blog interactive elements"
        />
      )}

      {/* Custom HTML */}
      <div data-scope={uid} className="custom-blog-content" dangerouslySetInnerHTML={{ __html: customHtml }} />
    </div>
  );
}

/**
 * Wraps custom CSS rules with a scoped selector so they only apply
 * inside this blog post. This prevents custom CSS from leaking
 * into the parent page or other content.
 */
function scopedCss(css: string, uid: string): string {
  const scoped = css
    // Wrap simple selectors with our scope
    .replace(
      /(^|\})\s*([^{}\n][^{}]*?)(\s*\{)/g,
      `$1[data-scope="${uid}"] $2$3`
    )
    // Remove any url() that could exfiltrate (basic safety)
    .replace(/url\((['"]?)javascript:[^'"]*(['"]?)\)/gi, 'url($1about:blank$2)')
    .replace(/url\((['"]?)data:[^'"]*(['"]?)\)/gi, 'url($1about:blank$2)');
  return scoped;
}
