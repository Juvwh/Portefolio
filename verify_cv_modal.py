import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto("http://localhost:8000")
        await page.wait_for_load_state("domcontentloaded")
        await page.wait_for_timeout(1000)

        # Test clicking
        await page.evaluate("document.querySelector('.cv-modal-trigger').click()")
        await page.wait_for_timeout(1000)

        # Check if modal is active
        is_active = await page.evaluate("document.querySelector('#cv-modal').classList.contains('active')")
        print(f"Modal opened properly: {is_active}")

        await browser.close()

asyncio.run(main())
