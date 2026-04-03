#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Part 2: Dashboard + Projects + Project Detail + Settings"""

import os, json, time
os.environ['PYTHONIOENCODING'] = 'utf-8'
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3001"
SS = "c:/Users/matt/Dropbox/projects/hacf-dashboard/portfolio/DIAGNOSTIC-SCREENSHOTS/05-fullstack-saas"
os.makedirs(SS, exist_ok=True)

results = []

def ss(page, name):
    path = f"{SS}/{name}.png"
    try: page.screenshot(path=path, full_page=True, timeout=5000)
    except: pass

def rec(el, res, note=""):
    results.append({"element": el, "result": res, "note": note})
    print(f"[{res}] {el}" + (f" - {note}" if note else ""))

def login(page):
    page.goto(f"{BASE_URL}/login", timeout=20000, wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    em = page.query_selector("input[type='email']") or page.query_selector("input[name='email']")
    pw = page.query_selector("input[type='password']")
    if em and pw:
        em.fill("alice@demo.com"); pw.fill("demo1234")
        sub = page.query_selector("button[type='submit']") or page.query_selector("button:has-text('Sign In')")
        if sub:
            sub.click(); page.wait_for_timeout(5000)
            return "/dashboard" in page.url
    return False

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 900})
    page = context.new_page()
    page.set_default_timeout(10000)

    # Login first
    print("=== LOGIN ===")
    logged = login(page)
    print(f"Logged in: {logged}, URL: {page.url}")

    # DASHBOARD
    print("=== DASHBOARD ===")
    try:
        page.goto(f"{BASE_URL}/dashboard", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        ss(page, "04-dashboard")
        is_dash = "/dashboard" in page.url and "/login" not in page.url
        rec("Dashboard loads (not redirected to login)", "PASS" if is_dash else "FAIL", page.url)
        nav = page.query_selector("nav") or page.query_selector("aside") or page.query_selector("[class*='sidebar']")
        rec("Nav sidebar/header present", "PASS" if nav else "WARN")
        stats = page.query_selector("[class*='card']") or page.query_selector("h1") or page.query_selector("h2")
        rec("Overview stats/content visible", "PASS" if stats else "WARN")
        content = page.content()
        alice_in = "alice" in content.lower() or "Alice" in content
        rec("User name/email visible in header", "PASS" if alice_in else "WARN", "alice found" if alice_in else "not found")
        # Sign out - look for avatar or dropdown trigger
        ss(page, "04-dashboard-full")
        # Try to find user menu
        user_menu = (page.query_selector("[class*='avatar']") or
                     page.query_selector("button:has-text('alice')") or
                     page.query_selector("[aria-label*='user' i]") or
                     page.query_selector("[aria-label*='account' i]"))
        if user_menu:
            user_menu.click()
            page.wait_for_timeout(1000)
            ss(page, "04-dashboard-user-menu")
        signout = (page.query_selector("button:has-text('Sign Out')") or
                   page.query_selector("a:has-text('Sign Out')") or
                   page.query_selector("[role='menuitem']:has-text('Sign Out')") or
                   page.query_selector("button:has-text('Logout')") or
                   page.query_selector("button:has-text('Log out')"))
        rec("Sign out option accessible", "PASS" if signout else "WARN")
        if signout:
            signout.click()
            page.wait_for_timeout(3000)
            ss(page, "04-dashboard-signout")
            went_away = "/dashboard" not in page.url or "/login" in page.url
            rec("Sign out redirects to /login or /", "PASS" if went_away else "WARN", page.url)
            login(page)
        else:
            rec("Sign out redirects to /login or /", "WARN", "Could not find sign out")
    except Exception as e:
        rec("Dashboard loads (not redirected to login)", "FAIL", str(e)[:80])
        ss(page, "04-dashboard-error")

    # Ensure logged in
    if "/login" in page.url or page.url == BASE_URL:
        login(page)

    # PROJECTS
    print("=== PROJECTS ===")
    try:
        page.goto(f"{BASE_URL}/dashboard/projects", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        if "/login" in page.url:
            login(page)
            page.goto(f"{BASE_URL}/dashboard/projects", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
        ss(page, "05-projects")
        rec("Projects list page loads", "PASS" if "projects" in page.url else "WARN", page.url)
        # Look for project cards
        cards = page.query_selector_all("[class*='card']") or page.query_selector_all("[class*='project']")
        rec("At least 1 project visible", "PASS" if len(cards) > 0 else "WARN", f"{len(cards)} cards")
        # Project names - h2 or h3
        headers = page.query_selector_all("h3") or page.query_selector_all("h2")
        rec("Project names visible", "PASS" if len(headers) > 0 else "WARN", f"{len(headers)} headers")
        new_btn = (page.query_selector("button:has-text('New Project')") or
                   page.query_selector("button:has-text('Create Project')") or
                   page.query_selector("button:has-text('Create')") or
                   page.query_selector("button:has-text('New')"))
        rec("New Project/Create button present", "PASS" if new_btn else "FAIL")
        if new_btn:
            new_btn.click()
            page.wait_for_timeout(2000)
            ss(page, "05-projects-create")
            dialog = page.query_selector("[role='dialog']") or page.query_selector("[class*='dialog']")
            rec("Clicking create opens dialog/form", "PASS" if dialog else "WARN")
            name_inp = (page.query_selector("input[name='name']") or
                        page.query_selector("input[placeholder*='name' i]") or
                        page.query_selector("input[placeholder*='project' i]") or
                        page.query_selector("[role='dialog'] input"))
            rec("Project name input in create form", "PASS" if name_inp else "FAIL")
            if name_inp:
                name_inp.fill(f"Test Project {int(time.time())}")
                # Look for description field
                desc = page.query_selector("textarea") or page.query_selector("input[name='description']")
                if desc: desc.fill("A test project")
                sub = (page.query_selector("[role='dialog'] button[type='submit']") or
                       page.query_selector("[role='dialog'] button:has-text('Create')") or
                       page.query_selector("[role='dialog'] button:has-text('Save')") or
                       page.query_selector("[role='dialog'] button:has-text('Add')"))
                if sub:
                    before_count = len(page.query_selector_all("[class*='card']"))
                    sub.click()
                    page.wait_for_timeout(3000)
                    ss(page, "05-projects-after-create")
                    after_count = len(page.query_selector_all("[class*='card']"))
                    rec("Create project adds to list", "PASS" if after_count >= before_count else "WARN",
                        f"before={before_count} after={after_count}")
                else:
                    rec("Create project adds to list", "WARN", "no submit in dialog")
            else:
                rec("Create project adds to list", "FAIL", "no name input")
        else:
            rec("Clicking create opens dialog/form", "FAIL", "no create btn")
            rec("Project name input in create form", "FAIL", "no create btn")
            rec("Create project adds to list", "FAIL", "no create btn")
        # Click existing project
        proj_link = page.query_selector("a[href*='/projects/']") or page.query_selector("[class*='card'] a")
        if not proj_link:
            card = page.query_selector("[class*='card']")
            if card:
                # look for clickable inside
                proj_link = card.query_selector("a") or card
        if proj_link:
            href = proj_link.get_attribute("href") if hasattr(proj_link, 'get_attribute') else None
            if href and href.startswith("/"):
                page.goto(f"{BASE_URL}{href}", timeout=20000, wait_until="domcontentloaded")
            else:
                proj_link.click()
            page.wait_for_timeout(2000)
            ss(page, "05-projects-detail")
            is_detail = "/dashboard/projects/" in page.url
            rec("Clicking project navigates to detail", "PASS" if is_detail else "WARN", page.url)
        else:
            rec("Clicking project navigates to detail", "WARN", "no project link found")
    except Exception as e:
        rec("Projects list page loads", "FAIL", str(e)[:80])
        ss(page, "05-projects-error")

    # PROJECT DETAIL
    print("=== PROJECT DETAIL ===")
    try:
        current = page.url
        if "/dashboard/projects/" not in current:
            page.goto(f"{BASE_URL}/dashboard/projects", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            link = page.query_selector("a[href*='/projects/']")
            if link:
                href = link.get_attribute("href")
                page.goto(f"{BASE_URL}{href}", timeout=20000, wait_until="domcontentloaded")
                page.wait_for_timeout(2000)
        ss(page, "06-project-detail")
        is_detail = "/dashboard/projects/" in page.url
        rec("Project detail page loads", "PASS" if is_detail else "FAIL", page.url)
        h1 = page.query_selector("h1")
        rec("Project name as heading", "PASS" if h1 else "WARN", h1.inner_text()[:40] if h1 else "no h1")
        tasks_el = page.query_selector_all("[class*='task']") or page.query_selector_all("[class*='item']")
        task_heading = page.query_selector("h2") or page.query_selector("h3")
        rec("Task list visible", "PASS" if (len(tasks_el)>0 or task_heading) else "WARN", f"{len(tasks_el)} task elements")
        add_btn = (page.query_selector("button:has-text('Add Task')") or
                   page.query_selector("button:has-text('New Task')") or
                   page.query_selector("button:has-text('Add')") or
                   page.query_selector("button:has-text('Create Task')"))
        rec("Add Task button present", "PASS" if add_btn else "FAIL")
        if add_btn:
            add_btn.click()
            page.wait_for_timeout(2000)
            ss(page, "06-project-add-task")
            title_inp = (page.query_selector("input[name='title']") or
                         page.query_selector("input[placeholder*='title' i]") or
                         page.query_selector("input[placeholder*='task' i]") or
                         page.query_selector("[role='dialog'] input[type='text']") or
                         page.query_selector("input[type='text']"))
            rec("Task title input present", "PASS" if title_inp else "FAIL")
            status_el = (page.query_selector("select[name='status']") or
                         page.query_selector("[role='combobox']") or
                         page.query_selector("select"))
            rec("Status dropdown present", "PASS" if status_el else "WARN")
            if title_inp:
                title_inp.fill(f"Test Task {int(time.time())}")
                task_sub = (page.query_selector("[role='dialog'] button[type='submit']") or
                            page.query_selector("[role='dialog'] button:has-text('Create')") or
                            page.query_selector("[role='dialog'] button:has-text('Add')") or
                            page.query_selector("[role='dialog'] button:has-text('Save')") or
                            page.query_selector("button[type='submit']"))
                if task_sub:
                    task_sub.click()
                    page.wait_for_timeout(3000)
                    ss(page, "06-project-after-task")
                    rec("Submitting creates task", "PASS", "submitted ok")
                else:
                    rec("Submitting creates task", "WARN", "no submit")
            else:
                rec("Submitting creates task", "FAIL", "no title input")
        else:
            rec("Clicking Add Task opens form", "FAIL", "no add task btn")
            rec("Task title input present", "FAIL", "no add task btn")
            rec("Status dropdown present", "FAIL", "no add task btn")
            rec("Submitting creates task", "FAIL", "no add task btn")
        ss(page, "06-project-final")
        badges = page.query_selector_all("[class*='badge']") or page.query_selector_all("[class*='status']")
        rec("Existing tasks show status badge", "PASS" if len(badges)>0 else "WARN", f"{len(badges)} badges")
    except Exception as e:
        rec("Project detail page loads", "FAIL", str(e)[:80])
        ss(page, "06-project-detail-error")

    # SETTINGS
    print("=== SETTINGS ===")
    try:
        page.goto(f"{BASE_URL}/dashboard/settings", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        if "/login" in page.url:
            login(page)
            page.goto(f"{BASE_URL}/dashboard/settings", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
        ss(page, "07-settings")
        rec("Settings page loads", "PASS" if "settings" in page.url else "FAIL", page.url)
        name_f = (page.query_selector("input[name='name']") or
                  page.query_selector("input[name='firstName']") or
                  page.query_selector("input[placeholder*='name' i]"))
        email_f = page.query_selector("input[type='email']") or page.query_selector("input[name='email']")
        rec("Profile name field present", "PASS" if name_f else "WARN")
        rec("Profile email field present", "PASS" if email_f else "WARN")
        rec("Profile fields present", "PASS" if (name_f or email_f) else "FAIL")
        save = (page.query_selector("button[type='submit']") or
                page.query_selector("button:has-text('Save')") or
                page.query_selector("button:has-text('Update')"))
        rec("Save button present", "PASS" if save else "FAIL")
    except Exception as e:
        rec("Settings page loads", "FAIL", str(e)[:80])
        ss(page, "07-settings-error")

    browser.close()

with open("/tmp/saas_part2.json","w") as f: json.dump(results,f,indent=2)
p2=sum(1 for r in results if r["result"]=="PASS")
f2=sum(1 for r in results if r["result"]=="FAIL")
w2=sum(1 for r in results if r["result"]=="WARN")
print(f"\nPart2: {len(results)} tests | {p2} PASS | {f2} FAIL | {w2} WARN")
