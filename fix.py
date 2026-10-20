import sys

with open("src/app/globals.css", "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

# find where line 183 is or just take up to line 183
with open("src/app/globals.css", "w", encoding="utf-8") as f:
    f.writelines(lines[:183])
    f.write("\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n")
    f.write(".hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n")
