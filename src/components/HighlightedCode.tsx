import { useMemo } from "react";
import type { ReactNode } from "react";

// Match comments and strings first so their contents stay a single token.
const tokens = /(?<comment>\/\/[^\r\n]*|\/\*[\s\S]*?\*\/)|(?<string>"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\x60(?:\\[\s\S]|[^\x60\\])*\x60)|(?<keyword>\b(?:export|default|import|from|return|if|else|for|of|in|while|do|switch|case|break|continue|try|catch|finally|throw|async|await|yield|as|satisfies)\b)|(?<declaration>\b(?:const|let|var|function|class|interface|type|enum|namespace|declare|extends|implements|new|readonly|public|private|protected|static)\b)|(?<literal>\b(?:true|false|null|undefined)\b)|(?<type>\b(?:string|number|boolean|void|never|unknown|any|object|[A-Z][\w$]*)\b)|(?<number>\b(?:0[xX][\da-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?[\d_]+)?)\b)|(?<function>\b[a-zA-Z_$][\w$]*(?=\s*\())|(?<property>\b[a-zA-Z_$][\w$]*(?=\s*\??:))|(?<operator>=>|===|!==|==|!=|<=|>=|&&|\|\||\?\?|[+\-*/%=!<>?:])/g;

const luauTokens = /(?<comment>--\[\[[\s\S]*?\]\]|--[^\r\n]*)|(?<string>"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\[\[[\s\S]*?\]\])|(?<keyword>\b(?:return|if|then|else|elseif|end|for|in|do|while|repeat|until|break|continue|and|or|not|export)\b)|(?<declaration>\b(?:local|function|type)\b)|(?<literal>\b(?:true|false|nil)\b)|(?<number>\b(?:0[xX][\da-fA-F_]+|0[bB][01_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?[\d_]+)?)\b)|(?<function>\b[a-zA-Z_][\w]*(?=\s*\())|(?<type>\b(?:number|string|boolean|any|unknown|never|buffer|[A-Z][\w]*)\b)|(?<property>\b[a-zA-Z_][\w]*(?=\s*:))|(?<operator>~=|==|<=|>=|->|\.\.|[+\-*/%#=<>:])/g;

function highlight(source: string, grammar: RegExp): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of source.matchAll(grammar)) {
    if (match.index > cursor) parts.push(source.slice(cursor, match.index));
    const kind = Object.keys(match.groups!).find(key => match.groups![key] !== undefined);
    parts.push(
      <span key={match.index} className={"MapCodeToken MapCodeToken-" + kind}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) parts.push(source.slice(cursor));
  return parts;
}

export default function HighlightedCode({ code, language }: { code: string; language: string }) {
  const grammar = language === "TypeScript" ? tokens
    : language === "Luau" || language === "Lua" ? luauTokens : undefined;
  const content = useMemo(
    () => grammar ? highlight(code.trim(), grammar) : code.trim(),
    [code, grammar],
  );
  return <code className={grammar ? "language-" + language.toLowerCase() : undefined}>{content}</code>;
}
