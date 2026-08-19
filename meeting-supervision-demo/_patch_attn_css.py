# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).with_name('styles.css')
text = p.read_text(encoding='utf-8')
start = text.find('/* ——— 领导端：Linear 风格优先级滑动推送 ——— */')
end = text.find('.tech-stats .stat-card')
if start < 0 or end < 0:
    raise SystemExit(f'markers not found: {start}, {end}')

new = Path(__file__).with_name('_attn_block.css').read_text(encoding='utf-8')
p.write_text(text[:start] + new + text[end:], encoding='utf-8')
print('css ok')
