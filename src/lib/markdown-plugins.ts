import type { PluggableList } from 'react-markdown';

/**
 * Rehype plugin: wrap bare <pre> (not fenced code blocks) in a
 * scrollable container so long lines don't overflow.
 */
export const preWrapPlugin = () => {
  return (_tree: any) => {
    const visit: any = (node: any) => {
      if (node.type === 'element' && node.tagName === 'pre') {
        const hasCodeChild = node.children?.some(
          (c: any) => c.tagName === 'code'
        );
        if (!hasCodeChild) {
          node.properties = {
            ...node.properties,
            className: [
              ...((node.properties?.className as string[]) || []),
              'overflow-x-auto',
            ],
          };
        }
      }
      node.children?.forEach(visit);
    };

    visit({ type: 'root', children: (_tree as any).children || [] });
    return _tree;
  };
};

export const rehypePlugins: PluggableList = [preWrapPlugin];
