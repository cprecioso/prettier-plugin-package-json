import { Plugin, SupportOption } from "prettier"
import { format } from "prettier-package-json"
import * as babylonParser from "prettier/parser-babylon"

const jsonParser = babylonParser.parsers["json-stringify"]

const PACKAGE_JSON_RE = /(^|\\|\/)package\.json$/

export const { languages, parsers, options }: Plugin = {
  languages: [
    {
      name: "package-json",
      parsers: ["json-stringify"]
    }
  ],
  parsers: {
    "json-stringify": {
      ...jsonParser,
      preprocess(text, options) {
        if (jsonParser.preprocess) {
          text = jsonParser.preprocess(text, options)
        }
        if (options.filepath && PACKAGE_JSON_RE.test(options.filepath)) {
          return format(JSON.parse(text), {
            tabWidth: options.tabWidth,
            useTabs: options.useTabs,
            // @ts-ignore
            expandUsers: options.expandPackageJsonUsers
          })
        }
        return text
      }
    }
  },
  options: (({
    expandPackageJsonUsers: {
      type: "boolean",
      category: "Global",
      default: false,
      description: "Expand author and contributors into objects."
    }
  } as Record<string, SupportOption>) as any) as SupportOption[]
}
