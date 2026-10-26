"""Package the Stage 3 HTML preview with local, licensed font assets. No dependencies."""
from pathlib import Path
import json, base64, re
root=Path(__file__).resolve().parent
assets=root/'assets'
text=(root/'studyflow-today.template.html').read_text()
metadata=json.loads((assets/'fontawesome-icons.json').read_text())
names=set(re.findall(r'data-icon="([a-z-]+)"',text))|{'play','pause','circle-check','flag'}
icons={name:metadata[name]['unicode'] for name in sorted(names)}
for marker,name in [('__INTER__','InterVariable.woff2'),('__FA_SOLID__','fa-solid-900.woff2'),('__FA_REGULAR__','fa-regular-400.woff2')]:
    text=text.replace(marker,base64.b64encode((assets/name).read_bytes()).decode())
text=text.replace('__ICON_CSS__','').replace('__ICONS_JSON__',json.dumps(icons))
licenses='Inter Variable:\n'+(assets/'Inter-LICENSE.txt').read_text()+'\nFont Awesome Free 6.7.2:\n'+(assets/'fontawesome-LICENSE.txt').read_text()
text=text.replace('__LICENSES__',licenses.replace('--','—'))
(root/'studyflow-today.html').write_text(text)
print('Packaged self-contained design preview:',len(text.encode()),'bytes')
