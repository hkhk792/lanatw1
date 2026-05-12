from pathlib import Path

import requests
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "pinky-imported"
SOURCE_PAGE = "https://sites.google.com/view/product-catalogue-e"

CATALOG_IDS = [
    "relx-pod-pro2-pods",
    "relx-infinity-pro2-host",
    "relx-phantom-gen5-host",
    "relx-ga8000",
    "ilia-gen4-6500",
    "meel-boost-10000",
    "meel-max-6000",
    "meel-marbo-9000",
    "max-g-gen1",
    "ilia-gen1",
    "tutx-gen1",
    "luckin-gen1",
    "sars-gen1",
    "ilia-gen5",
    "ice-bear-gen5",
    "tisic-cola-bottle",
    "tisic-black-cat",
    "kis5-gen1",
    "kis5-disposable-6500",
    "mehai-gen1",
    "mehai-gen5",
    "infinity-series",
    "universal-sleeve",
    "marbo-9000",
    "obi-disposable-8000",
    "chill-disposable-8800",
    "relx-smash-go-12k",
    "dot-plus-8000",
    "mistx-6500",
    "meha-titan-15000-host",
]

# 按來源導航序號移除：LANA 一代、SP2 一代、魔盒系列
SKIP_INDEXES = {8, 12, 16}


def extract_fresh_image_urls(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    anchors: list[tuple[str, str]] = []
    for a in soup.find_all("a"):
        href = (a.get("href") or "").strip()
        text = " ".join(a.get_text(" ", strip=True).split())
        if href.startswith("#h.") and text:
            anchors.append((text, href[1:]))

    # dedupe by heading id, keep order
    seen: set[str] = set()
    uniq: list[tuple[str, str]] = []
    for text, hid in anchors:
        if hid in seen:
            continue
        seen.add(hid)
        uniq.append((text, hid))

    urls: list[str] = []
    for _, hid in uniq:
        el = soup.find(id=hid)
        img = el.find_next("img") if el else None
        urls.append((img.get("src") if img else "") or "")

    urls = [u for idx, u in enumerate(urls) if idx not in SKIP_INDEXES]
    return urls


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    common_headers = {
        "Referer": SOURCE_PAGE,
        "User-Agent": "Mozilla/5.0",
    }

    page = session.get(SOURCE_PAGE, headers=common_headers, timeout=30)
    page.raise_for_status()
    image_urls = extract_fresh_image_urls(page.text)

    if len(image_urls) != len(CATALOG_IDS):
        raise SystemExit(f"Image count mismatch: {len(image_urls)} != {len(CATALOG_IDS)}")

    ok = 0
    fail = 0
    for image_id, url in zip(CATALOG_IDS, image_urls):
        target = OUT_DIR / f"{image_id}.jpg"
        try:
            resp = session.get(url, headers=common_headers, timeout=30)
            resp.raise_for_status()
            target.write_bytes(resp.content)
            ok += 1
            print(f"OK   {image_id} -> {target.name} ({len(resp.content)} bytes)")
        except Exception as exc:
            fail += 1
            print(f"FAIL {image_id}: {exc}")

    print(f"Done. success={ok} failed={fail}")


if __name__ == "__main__":
    main()
