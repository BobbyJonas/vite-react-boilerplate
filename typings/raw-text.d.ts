declare module '*.md' {
  const markdownRawText: string;
  export default markdownRawText;
}

declare module '*?raw' {
  const rawText: string;
  export default rawText;
}
