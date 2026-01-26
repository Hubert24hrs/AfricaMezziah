from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Verify Collections Page
            print("Visiting /collections")
            page.goto("http://localhost:3000/collections")
            page.wait_for_load_state("networkidle")
            page.screenshot(path="verification/collections.png", full_page=True)
            print("Screenshot saved to verification/collections.png")

            # Verify Home Page
            print("Visiting /")
            page.goto("http://localhost:3000/")
            page.wait_for_load_state("networkidle")
            page.screenshot(path="verification/home.png", full_page=True)
            print("Screenshot saved to verification/home.png")

            # Verify Cart Page
            print("Visiting /cart")
            page.goto("http://localhost:3000/cart")
            page.wait_for_load_state("networkidle")
            page.screenshot(path="verification/cart.png", full_page=True)
            print("Screenshot saved to verification/cart.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_changes()
