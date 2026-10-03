#!/usr/bin/env python3
"""Resolve draft links after the repository and demo have been published and verified."""
from pathlib import Path
from urllib.parse import urlparse, quote
import argparse,re
parser=argparse.ArgumentParser()
parser.add_argument('--repository-url',required=True)
parser.add_argument('--branch',required=True)
parser.add_argument('--demo-url',required=True)
parser.add_argument('--output',required=True)
args=parser.parse_args()
for url in [args.repository_url,args.demo_url]:
 parsed=urlparse(url)
 if parsed.scheme!='https' or not parsed.netloc or parsed.username or parsed.password or parsed.fragment:parser.error('Use verified public HTTPS URLs without credentials.')
repository=args.repository_url.rstrip('/')
if urlparse(repository).hostname!='github.com':parser.error('This publication layout expects GitHub.')
project=Path(__file__).resolve().parents[1]
source=project/'docs/dev-submission-draft.md'
text=source.read_text().replace('[PUBLIC_DEMO_URL]',f'[Watch the Suniye Android pilot | Voice: elevenlabs.io]({args.demo_url})').replace('[PUBLIC_REPOSITORY_URL]',f'[Suniye source]({repository})')
def absolute(match):
 label,target=match.group(1),match.group(2)
 if '://' in target or target.startswith('#'):return match.group(0)
 path=target.split('#')[0]
 if not (source.parent/path).resolve().is_relative_to(project/'docs') or not (source.parent/path).is_file():raise ValueError('Invalid supporting document link')
 return f'[{label}]({repository}/blob/{quote(args.branch,safe="")}/outputs/suniye/docs/{quote(target,safe="/#")})'
text=re.sub(r'\[([^\]\n]*)\]\(([^)\s]+)\)',absolute,text)
text=re.sub(r'\*Prepared for the .*?Publication is pending the public demo and source links\.\*\n\n','',text)
if '[PUBLIC_' in text:raise ValueError('Unresolved publication placeholder')
# Keep publication false: generating a reviewable file is separate from posting it.
Path(args.output).write_text(text)
print('Prepared publication copy with public URLs; not posted.')
