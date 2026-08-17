import re

import markdown

MD_PATH = r"C:\VsCode\Agentic Job Platform\nextjs-template\app\docs\docs.md"
OUT_PATH = r"C:\VsCode\Agentic Job Platform\nextjs-template\app\docs\content.ts"

with open(MD_PATH, "r", encoding="utf-8") as f:
    md = f.read()

# Promote 3-space nested list/code content to 4-space so Python-Markdown
# keeps it attached to the parent list item.
md = re.sub(r"^   (?=\S)", "    ", md, flags=re.MULTILINE)

md_obj = markdown.Markdown(
    extensions=["toc", "tables", "pymdownx.superfences"],
    extension_configs={
        "pymdownx.superfences": {
            "css_class": "code-block",
            "preserve_tabs": True,
        },
    },
)
body = md_obj.convert(md)
toc = md_obj.toc

# Wrap TOC in a nav for styling
if not toc.startswith("<nav"):
    toc = f'<nav class="toc">{toc}</nav>'

# escape for JS template string
body = body.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
toc = toc.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write("export const docBody = `")
    f.write(body)
    f.write("`;\n\n")
    f.write("export const docToc = `")
    f.write(toc)
    f.write("`;\n")
