# Convert html file to markdown using markdownitfy

from markdownify import MarkdownConverter
import sys


def md(html):
    return MarkdownConverter(
        heading_style="ATX",
        escape_underscores=False,
        escape_asterisk=False,
    ).convert(html)


if __name__ == "__main__":
    # check argv
    if len(sys.argv) < 3:
        print("Convert html file to markdown using markdownitfy")
        print()
        print(" Usage: python html2md.py [html_file] [markdown_file_path]")
        print("  e.g) python html2md.py docs/ui-sample.html docs/ui-sample.md")
        print()
    else:
        in_file = sys.argv[1]
        out_file = sys.argv[2]

        with open(in_file, "r") as f:
            html = f.read()
            markdown = md(html)

            with open(out_file, "w") as f:
                f.write(markdown)
