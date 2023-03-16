import { remark } from 'remark';
import html from 'remark-html';

export const renderMarkdown = async (markdown: string) => {
  const processedContent = await remark()
    .use(html)
    .process(markdown);
  const contentHtml = processedContent.toString();
  return contentHtml;
}