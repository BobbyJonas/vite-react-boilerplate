/* eslint-disable no-prototype-builtins */
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import cs from 'classnames';

import Editor, { DiffEditor, useMonaco, loader, Monaco } from '@monaco-editor/react';
import { languages } from 'monaco-editor';

import typesRaw from './types.d.ts?raw';

import './index.less';

const testAutoCompleteMap = {
  testObject: {
    a: 11,
    b: {
      c: () => {},
    },
  },
};

export interface ICodeEditorProps {}
export const CodeEditor: FC<Readonly<ICodeEditorProps>> = () => {
  const monaco = useMonaco();

  const providerListRef = useRef<Array<Function>>([]);

  const transformObject2CustomCompletionProvider = useCallback(
    (obj: Record<string, any>): languages.CompletionItemProvider => {
      // https://gist.github.com/mwrouse/05d8c11cd3872c19c684bd1904a2202e
      function getType(thing: any, isMember?: boolean) {
        isMember =
          isMember == undefined ? (typeof isMember == 'boolean' ? isMember : false) : false; // Give isMember a default value of false

        switch ((typeof thing).toLowerCase()) {
          case 'object':
            return languages.CompletionItemKind.Class;

          case 'function':
            return isMember
              ? languages.CompletionItemKind.Method
              : languages.CompletionItemKind.Function;

          default:
            return isMember
              ? languages.CompletionItemKind.Property
              : languages.CompletionItemKind.Variable;
        }
      }
      return {
        // Run this function when the period or open parenthesis is typed (and anything after a space)
        triggerCharacters: ['.', '('],

        // Function to generate autocompletion results
        provideCompletionItems: function (model, position, token) {
          // Split everything the user has typed on the current line up at each space, and only look at the last word
          const last_chars = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
          const words = last_chars.replace('\t', '').split(' ');
          const active_typing = words[words.length - 1]; // What the user is currently typing (everything after the last space)

          // If the last character typed is a period then we need to look at member objects of the obj object
          const is_member = active_typing.charAt(active_typing.length - 1) == '.';

          // Array of autocompletion results
          const result: languages.CompletionItem[] = [];

          // Used for generic handling between member and non-member objects
          let last_token = obj;
          let prefix = '';

          if (is_member) {
            // Is a member, get a list of all members, and the prefix
            const parents = active_typing.substring(0, active_typing.length - 1).split('.');
            last_token = obj[parents[0]];
            prefix = parents[0];

            // Loop through all the parents the current one will have (to generate prefix)
            for (let i = 1; i < parents.length; i++) {
              if (last_token.hasOwnProperty(parents[i])) {
                prefix += '.' + parents[i];
                last_token = last_token[parents[i]];
              } else {
                // Not valid
                return result;
              }
            }

            prefix += '.';
          }

          // Get all the child properties of the last token
          for (const prop in last_token) {
            // Do not show properites that begin with "__"
            if (last_token.hasOwnProperty(prop) && !prop.startsWith('__')) {
              // Get the detail type (try-catch) incase object does not have prototype
              let details = '';
              try {
                details = last_token[prop].__proto__.constructor.name;
              } catch (e) {
                details = typeof last_token[prop];
              }

              // Create completion object
              const to_push: languages.CompletionItem = {
                label: prefix + prop,
                kind: getType(last_token[prop], is_member),
                detail: details,
                insertText: prop,
              } as any;

              // Change insertText and documentation for functions
              if (to_push.detail?.toLowerCase() == 'function') {
                to_push.insertText += '()';
                to_push.documentation = last_token[prop].toString().split('{')[0]; // Show function prototype in the documentation popup
              }

              // Add to final results
              result.push(to_push);
            }
          }

          return {
            suggestions: result,
          } as any;
        },
      };
    },
    []
  );

  const registerCompletionProvider = useCallback(
    (monaco: Monaco, provider: languages.CompletionItemProvider) => {
      return monaco.languages.registerCompletionItemProvider('javascript', provider).dispose;
    },
    []
  );

  const onFocus = useCallback(() => {
    providerListRef.current = [
      registerCompletionProvider(
        monaco as any,
        transformObject2CustomCompletionProvider(testAutoCompleteMap)
      ),
    ];
  }, [monaco, registerCompletionProvider, transformObject2CustomCompletionProvider]);

  const onBlur = useCallback(() => {
    providerListRef.current.forEach((dispose) => {
      dispose?.();
    });
  }, []);

  useEffect(() => {
    monaco?.languages?.typescript.typescriptDefaults.addExtraLib(typesRaw, 'ts:utils.d.ts');
    monaco?.languages?.typescript.javascriptDefaults.addExtraLib(typesRaw, 'ts:utils.d.ts');
    monaco && onFocus();
  }, [monaco, monaco?.languages, onFocus]);

  return (
    <div>
      demo
      <Editor
        className={cs('code-editor')}
        defaultLanguage="javascript"
        defaultValue="// hello world"
        // onFocus={onFocus}
        // onBlur={onBlur}
      />
    </div>
  );
};

export default CodeEditor;
