import os
import re

def check_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match all imports from 'lucide-react'
    for match in re.finditer(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', content):
        imports = [x.strip() for x in match.group(1).split(',')]
        for imp in imports:
            if not imp: continue
            name = imp.split(' as ')[-1].strip()
            # Find all occurrences of name
            occurrences = len(re.findall(r'\b' + name + r'\b', content))
            if occurrences == 1:
                print(f"Unused lucide icon: {name} in {path}")

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            check_file(os.path.join(root, file))
