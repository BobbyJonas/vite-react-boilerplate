import React, { FC, useEffect } from 'react';

// import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

export interface ICodeEditorProps {}
export const CodeEditor: FC<Readonly<ICodeEditorProps>> = () => {
  // const monaco = useMonaco();

  const a = 1;
  // useEffect(() => {
  //   (monaco?.languages as any)?.javascript?.javascriptDefaults.addExtraLib(
  //     'declare function Factory (this: Number, n: Number) : void;',
  //     'ts:this-lib.d.ts'
  //   );
  //   console.log(a);
  // }, [monaco?.languages]);

  return (
    <div>
      hello
      {/* <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" /> */}
    </div>
  );
};

export default CodeEditor;
