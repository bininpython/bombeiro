import os, re

files = []
for root, _, filenames in os.walk('src'):
    for f in filenames:
        if f.endswith('.tsx') or f.endswith('.ts'):
            files.append(os.path.join(root, f))

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check lucide-react imports
    lucide_imports = re.search(r'from\s+[\'\"]lucide-react[\'\"]', content)
    if lucide_imports:
        import_block = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'\"]lucide-react[\'\"]', content)
        if import_block:
            imports = [i.strip() for i in import_block.group(1).split(',')]
            for i in imports:
                if not i: continue
                name = i.split(' as ')[-1].strip()
                occurrences = len(re.findall(r'\b' + re.escape(name) + r'\b', content))
                if occurrences <= 1:
                    print(f'Possible unused lucide import in {f}: {name}')

    # Check components/ui imports
    ui_imports = re.findall(r'import\s+\{([^}]+)\}\s+from\s+[\'\"]@/components/ui/.*?[\'\"]', content)
    for import_block in ui_imports:
        imports = [i.strip() for i in import_block.split(',')]
        for i in imports:
            if not i: continue
            name = i.split(' as ')[-1].strip()
            occurrences = len(re.findall(r'\b' + re.escape(name) + r'\b', content))
            if occurrences <= 1:
                print(f'Possible unused UI import in {f}: {name}')

    # Check lib imports
    lib_imports = re.findall(r'import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+[\'\"]@/lib/.*?[\'\"]', content)
    for import_block in lib_imports:
        imports = [i.strip() for i in import_block.split(',')]
        for i in imports:
            if not i: continue
            name = i.split(' as ')[-1].strip()
            occurrences = len(re.findall(r'\b' + re.escape(name) + r'\b', content))
            if occurrences <= 1:
                print(f'Possible unused lib import in {f}: {name}')
