#!/usr/bin/env python3
"""
Scrapes the latest Word for the Week (WFTW) articles from CFC India (cfcindia.com)
and generates wftwData.json and wftwData.ts for the Devotional Companion app.
"""
import requests
from bs4 import BeautifulSoup
import json
import re
import os

from datetime import datetime

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

MONTH_MAP = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
}

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_latest_article_urls(target_count=5):
    """Dynamically discover the newest WFTW article URLs from CFC India's listing."""
    urls = []
    now = datetime.now()
    year = now.year
    month = now.month

    # Check current month, plus previous 2 months if needed
    for _ in range(3):
        listing_url = f"https://www.cfcindia.com/wftw?&y={year}&m={month}"
        try:
            resp = requests.get(listing_url, headers=HEADERS, timeout=20)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.content, 'html.parser')
                for el in soup.select('.wftw-title a, .wftw_title a'):
                    href = el.get('href', '').strip()
                    if href and href.startswith('http') and href not in urls:
                        urls.append(href)
                        if len(urls) >= target_count:
                            return urls
        except Exception as e:
            print(f"Warning fetching {listing_url}: {e}")

        # Roll back one month
        month -= 1
        if month == 0:
            month = 12
            year -= 1

    return urls

def scrape_articles():
    print("Discovering latest Word for the Week article URLs from cfcindia.com...")
    urls = get_latest_article_urls(target_count=5)
    print(f"Found {len(urls)} article(s):")
    for u in urls:
        print(f"  -> {u}")

    
    articles = []
    for idx, url in enumerate(urls):
        resp = requests.get(url, headers=HEADERS, timeout=20)
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        title_el = soup.find('h4', class_='wftw_title')
        title = clean_text(title_el.get_text()) if title_el else f'Edition {idx+1}'
        
        day_el = soup.find('div', class_='wftw-day')
        month_el = soup.find('div', class_='wftw-month')
        year_el = soup.find('div', class_='wftw-year')
        day = clean_text(day_el.get_text()) if day_el else '1'
        month = clean_text(month_el.get_text()) if month_el else 'Jan'
        year = clean_text(year_el.get_text()) if year_el else '2026'
        
        m_num = MONTH_MAP.get(month[:3], '01')
        day_padded = f'{int(day):02d}' if day.isdigit() else '01'
        iso_date = f'{year}-{m_num}-{day_padded}'
        display_date = f'{month} {day}, {year}'
        
        body_el = soup.find('div', class_='field-item')
        paragraphs = []
        scriptures = []
        seen_scriptures = set()
        
        if body_el:
            # First extract scriptures from links
            for a in body_el.find_all('a'):
                href = a.get('href', '')
                t = clean_text(a.get_text())
                if ('ref.ly' in href or 'biblegateway' in href or 'biblia' in href) and len(t) < 30:
                    clean_ref = re.sub(r'^[(\[]|[\])]$', '', t).strip()
                    if clean_ref and clean_ref not in seen_scriptures:
                        seen_scriptures.add(clean_ref)
                        scriptures.append(clean_ref)
            
            # Extract paragraphs
            for p in body_el.find_all('p'):
                p_text = clean_text(p.get_text())
                if p_text and len(p_text) > 20 and not p_text.startswith('Copyright - Zac'):
                    paragraphs.append(p_text)
                    
            if not paragraphs:
                raw_text = clean_text(body_el.get_text())
                paragraphs = [line.strip() for line in raw_text.split('\n') if len(line.strip()) > 30]

        # Additional regex search for scriptures if few were found
        for p in paragraphs:
            found = re.findall(r'\b(?:Prov(?:erbs)?|Matt(?:hew)?|Mark|Luke|John|Acts|Rom(?:ans)?|1\s*Cor(?:inthians)?|2\s*Cor(?:inthians)?|Gal(?:atians)?|Eph(?:esians)?|Phil(?:ippians)?|Col(?:ossians)?|1\s*Thess(?:alonians)?|2\s*Thess(?:alonians)?|1\s*Tim(?:othy)?|2\s*Tim(?:othy)?|Titus|Heb(?:rews)?|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Rev(?:elation)?)\.?\s+\d+[:\d\-\–, ]*\b', p)
            for ref in found:
                r = clean_text(ref).rstrip(',.;- ')
                if r and r not in seen_scriptures and len(r) < 35:
                    seen_scriptures.add(r)
                    scriptures.append(r)

        summary = paragraphs[0][:160] + '...' if paragraphs else ''
        
        article_id = f'wftw-{iso_date}'
        articles.append({
            'id': article_id,
            'title': title,
            'date': iso_date,
            'displayDate': display_date,
            'author': 'Zac Poonen',
            'summary': summary,
            'scriptures': scriptures[:6],
            'paragraphs': paragraphs,
            'sourceUrl': url
        })
    
    return articles

if __name__ == '__main__':
    articles = scrape_articles()
    base_dir = os.path.dirname(os.path.abspath(__file__))
    out_dir = os.path.join(base_dir, '..', 'src', 'data')
    os.makedirs(out_dir, exist_ok=True)
    
    # Save as JSON
    json_path = os.path.join(out_dir, 'wftwData.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({'updatedAt': '2026-09-18', 'articles': articles}, f, indent=2, ensure_ascii=False)
    print(f'Wrote {len(articles)} articles to {json_path}')

    # Save as TypeScript
    ts_path = os.path.join(out_dir, 'wftwData.ts')
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write('// Auto-generated by scripts/fetch_wftw.py\n')
        f.write('import { WftwArticle } from "../types/devotional";\n\n')
        f.write('export const WFTW_ARTICLES: WftwArticle[] = ')
        f.write(json.dumps(articles, indent=2, ensure_ascii=False))
        f.write(';\n')
    print(f'Wrote TypeScript data to {ts_path}')
