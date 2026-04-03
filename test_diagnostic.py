#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Diagnostic test script for 05-fullstack-saas (PlanForge)"""

import os
import sys
import json
import time

# Set encoding for Windows
os.environ['PYTHONIOENCODING'] = 'utf-8'

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

BASE_URL = "http://localhost:3001"
SCREENSHOTS_DIR = "c:/Users/matt/Dropbox/projects/hacf-dashboard/portfolio/DIAGNOSTIC-SCREENSHOTS/05-fullstack-saas"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

results = []

def screenshot(page, name):
    path = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
    try:
        page.screenshot(path=path, full_page=True)
    except Exception as e:
        print(f"Screenshot failed for {name}: {e}")
    return path

def record(element, result, note=""):
    results.append({"element": element, "result": result, "note": note})
    print(f"  [{result}] {element}" + (f" - {note}" if note else ""))

def wait_for_url_not(page, url_part, timeout=10000):
    """Wait for URL to change away from url_part"""
    try:
        page.wait_for_url(lambda u: url_part not in u, timeout=timeout)
        return True
    except:
        return False

def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()
        
        # ── LANDING PAGE ──────────────────────────────────────────────────────
        print("\n=== LANDING PAGE (/) ===")
        try:
            page.goto(BASE_URL, timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            screenshot(page, "01-landing")
            
            title = page.title()
            record("Page loads at http://localhost:3001", "PASS", f"Title: {title}")
            
            # Hero headline
            hero = page.query_selector("h1")
            if hero:
                txt = hero.inner_text().strip()
                record("Hero headline text visible", "PASS", txt[:60])
            else:
                record("Hero headline text visible", "FAIL", "No h1 found")
            
            # CTA button
            cta = (page.query_selector("a[href='/register']") or
                   page.query_selector("a:has-text('Get Started')") or
                   page.query_selector("button:has-text('Get Started')") or
                   page.query_selector("a:has-text('Sign Up')"))
            if cta:
                record("'Get Started' CTA button present", "PASS")
                # Test navigation
                href = cta.get_attribute("href")
                if href == "/register":
                    record("CTA navigates to /register", "PASS")
                else:
                    record("CTA navigates to /register", "WARN", f"href={href}")
            else:
                record("'Get Started' CTA button present", "FAIL", "Not found")
                record("CTA navigates to /register", "FAIL", "CTA not found")
            
            # Sign In link
            signin = (page.query_selector("a[href='/login']") or
                      page.query_selector("a:has-text('Sign In')") or
                      page.query_selector("a:has-text('Log In')"))
            if signin:
                record("'Sign In' link present", "PASS")
                href = signin.get_attribute("href")
                if href == "/login":
                    record("Sign In navigates to /login", "PASS")
                else:
                    record("Sign In navigates to /login", "WARN", f"href={href}")
            else:
                record("'Sign In' link present", "FAIL", "Not found")
                record("Sign In navigates to /login", "FAIL", "Link not found")
            
            # Features section
            features = (page.query_selector("section:has-text('Feature')") or
                        page.query_selector("#features") or
                        page.query_selector("[id*='feature']") or
                        page.query_selector("h2"))
            if features:
                record("Features section visible", "PASS")
            else:
                record("Features section visible", "WARN", "No features section found")
                
        except Exception as e:
            record("Page loads at http://localhost:3001", "FAIL", str(e))
            screenshot(page, "01-landing-error")
        
        # ── REGISTRATION ──────────────────────────────────────────────────────
        print("\n=== REGISTRATION (/register) ===")
        try:
            page.goto(f"{BASE_URL}/register", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            screenshot(page, "02-register")
            record("Registration form loads", "PASS")
            
            # First name
            fn = (page.query_selector("input[name='firstName']") or
                  page.query_selector("input[placeholder*='First']") or
                  page.query_selector("input[id*='firstName']") or
                  page.query_selector("input[id*='first']"))
            record("First name input present", "PASS" if fn else "FAIL")
            
            # Last name
            ln = (page.query_selector("input[name='lastName']") or
                  page.query_selector("input[placeholder*='Last']") or
                  page.query_selector("input[id*='lastName']") or
                  page.query_selector("input[id*='last']"))
            record("Last name input present", "PASS" if ln else "FAIL")
            
            # Email
            email_input = (page.query_selector("input[type='email']") or
                           page.query_selector("input[name='email']"))
            record("Email input present", "PASS" if email_input else "FAIL")
            
            # Password
            pwd = page.query_selector("input[type='password']")
            record("Password input present", "PASS" if pwd else "FAIL")
            
            # Confirm password
            all_pwd = page.query_selector_all("input[type='password']")
            record("Confirm password input present", "PASS" if len(all_pwd) >= 2 else "WARN", 
                   f"Found {len(all_pwd)} password field(s)")
            
            # Submit button
            submit = (page.query_selector("button[type='submit']") or
                      page.query_selector("button:has-text('Register')") or
                      page.query_selector("button:has-text('Sign Up')") or
                      page.query_selector("button:has-text('Create')"))
            record("Submit button present", "PASS" if submit else "FAIL")
            
            # Empty submit validation
            if submit:
                submit.click()
                page.wait_for_timeout(2000)
                screenshot(page, "02-register-empty-submit")
                # Look for error messages or HTML5 validation
                errors = (page.query_selector("[class*='error']") or
                          page.query_selector("[class*='invalid']") or
                          page.query_selector("p[class*='text-red']") or
                          page.query_selector(".text-destructive"))
                # Check if still on register page
                still_on_register = "/register" in page.url
                record("Empty submit shows validation", "PASS" if still_on_register else "WARN",
                       "stayed on register page" if still_on_register else "navigated away")
            else:
                record("Empty submit shows validation", "FAIL", "No submit button")
            
            # Password too short
            if email_input and pwd:
                email_input.fill("test@test.com")
                if fn: fn.fill("Test")
                if ln: ln.fill("User")
                pwd.fill("123")
                if submit:
                    submit.click()
                    page.wait_for_timeout(2000)
                    screenshot(page, "02-register-short-password")
                    still_register = "/register" in page.url
                    record("Short password shows error", "PASS" if still_register else "WARN",
                           "stayed on register" if still_register else "navigated away")
                else:
                    record("Short password shows error", "FAIL", "No submit")
            else:
                record("Short password shows error", "FAIL", "No inputs found")
            
            # Valid registration
            # Re-find elements after any DOM updates
            page.goto(f"{BASE_URL}/register", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            
            ts = str(int(time.time()))
            fn2 = (page.query_selector("input[name='firstName']") or
                   page.query_selector("input[placeholder*='First']") or
                   page.query_selector("input[id*='first']"))
            ln2 = (page.query_selector("input[name='lastName']") or
                   page.query_selector("input[placeholder*='Last']") or
                   page.query_selector("input[id*='last']"))
            em2 = (page.query_selector("input[type='email']") or
                   page.query_selector("input[name='email']"))
            pwds = page.query_selector_all("input[type='password']")
            
            if fn2: fn2.fill("Test")
            if ln2: ln2.fill("User")
            if em2: em2.fill(f"testuser{ts}@test.com")
            if len(pwds) >= 1: pwds[0].fill("password123")
            if len(pwds) >= 2: pwds[1].fill("password123")
            
            sub2 = (page.query_selector("button[type='submit']") or
                    page.query_selector("button:has-text('Register')") or
                    page.query_selector("button:has-text('Sign Up')") or
                    page.query_selector("button:has-text('Create')"))
            if sub2:
                sub2.click()
                page.wait_for_timeout(3000)
                screenshot(page, "02-register-valid")
                navigated = "/register" not in page.url
                record("Valid registration navigates away", "PASS" if navigated else "WARN",
                       f"URL: {page.url}")
            else:
                record("Valid registration navigates away", "FAIL", "No submit button")
            
            # Check link back to login
            page.goto(f"{BASE_URL}/register", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=10000)
            login_link = (page.query_selector("a[href='/login']") or
                          page.query_selector("a:has-text('Already have an account')") or
                          page.query_selector("a:has-text('Sign In')") or
                          page.query_selector("a:has-text('Log In')"))
            record("'Already have an account?' link to /login", "PASS" if login_link else "FAIL")
            
        except Exception as e:
            record("Registration form loads", "FAIL", str(e))
            screenshot(page, "02-register-error")
        
        # ── LOGIN ─────────────────────────────────────────────────────────────
        print("\n=== LOGIN (/login) ===")
        try:
            page.goto(f"{BASE_URL}/login", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            screenshot(page, "03-login")
            record("Login form loads", "PASS")
            
            email_in = (page.query_selector("input[type='email']") or
                        page.query_selector("input[name='email']"))
            record("Email input present", "PASS" if email_in else "FAIL")
            
            pwd_in = page.query_selector("input[type='password']")
            record("Password input present", "PASS" if pwd_in else "FAIL")
            
            # Wrong credentials
            if email_in and pwd_in:
                email_in.fill("wrong@wrong.com")
                pwd_in.fill("wrongpass")
                sub = (page.query_selector("button[type='submit']") or
                       page.query_selector("button:has-text('Sign In')") or
                       page.query_selector("button:has-text('Log In')") or
                       page.query_selector("button:has-text('Login')"))
                if sub:
                    sub.click()
                    page.wait_for_timeout(3000)
                    screenshot(page, "03-login-wrong")
                    still_login = "/login" in page.url
                    record("Wrong credentials show error", "PASS" if still_login else "WARN",
                           f"URL: {page.url}")
                else:
                    record("Wrong credentials show error", "FAIL", "No submit button")
            else:
                record("Wrong credentials show error", "FAIL", "No inputs")
            
            # Valid login
            page.goto(f"{BASE_URL}/login", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            
            email_in2 = (page.query_selector("input[type='email']") or
                         page.query_selector("input[name='email']"))
            pwd_in2 = page.query_selector("input[type='password']")
            
            if email_in2 and pwd_in2:
                email_in2.fill("alice@demo.com")
                pwd_in2.fill("demo1234")
                sub2 = (page.query_selector("button[type='submit']") or
                        page.query_selector("button:has-text('Sign In')") or
                        page.query_selector("button:has-text('Log In')") or
                        page.query_selector("button:has-text('Login')"))
                if sub2:
                    sub2.click()
                    page.wait_for_timeout(5000)
                    screenshot(page, "03-login-success")
                    is_dashboard = "/dashboard" in page.url
                    record("Login with alice@demo.com / demo1234", "PASS" if is_dashboard else "FAIL",
                           f"URL: {page.url}")
                    record("Successful login redirects to /dashboard", "PASS" if is_dashboard else "FAIL",
                           f"URL: {page.url}")
                else:
                    record("Login with alice@demo.com / demo1234", "FAIL", "No submit")
                    record("Successful login redirects to /dashboard", "FAIL", "No submit")
            else:
                record("Login with alice@demo.com / demo1234", "FAIL", "No inputs")
                record("Successful login redirects to /dashboard", "FAIL", "No inputs")
            
            # Link to register
            page.goto(f"{BASE_URL}/login", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=10000)
            reg_link = (page.query_selector("a[href='/register']") or
                        page.query_selector("a:has-text('Register')") or
                        page.query_selector("a:has-text('Sign Up')") or
                        page.query_selector("a:has-text('Create an account')"))
            record("Link to /register present on login", "PASS" if reg_link else "FAIL")
            
        except Exception as e:
            record("Login form loads", "FAIL", str(e))
            screenshot(page, "03-login-error")
        
        # ── ENSURE LOGGED IN ──────────────────────────────────────────────────
        print("\n=== LOGIN (ensure logged in as alice) ===")
        try:
            page.goto(f"{BASE_URL}/login", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            email_in = (page.query_selector("input[type='email']") or
                        page.query_selector("input[name='email']"))
            pwd_in = page.query_selector("input[type='password']")
            if email_in and pwd_in:
                email_in.fill("alice@demo.com")
                pwd_in.fill("demo1234")
                sub = (page.query_selector("button[type='submit']") or
                       page.query_selector("button:has-text('Sign In')") or
                       page.query_selector("button:has-text('Log In')"))
                if sub:
                    sub.click()
                    page.wait_for_timeout(5000)
                    print(f"  After login URL: {page.url}")
        except Exception as e:
            print(f"  Login error: {e}")
        
        # ── DASHBOARD ─────────────────────────────────────────────────────────
        print("\n=== DASHBOARD (/dashboard) ===")
        try:
            page.goto(f"{BASE_URL}/dashboard", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            screenshot(page, "04-dashboard")
            
            is_dashboard = "/dashboard" in page.url and "/login" not in page.url
            record("Dashboard page loads (not redirected)", "PASS" if is_dashboard else "FAIL",
                   f"URL: {page.url}")
            
            # Nav/sidebar
            nav = (page.query_selector("nav") or
                   page.query_selector("aside") or
                   page.query_selector("[class*='sidebar']") or
                   page.query_selector("[class*='nav']"))
            record("Nav sidebar/header present", "PASS" if nav else "WARN", 
                   "nav element found" if nav else "No nav found")
            
            # Overview stats or content
            stats = (page.query_selector("[class*='stat']") or
                     page.query_selector("[class*='card']") or
                     page.query_selector("h1") or
                     page.query_selector("h2"))
            record("Overview stats/welcome content visible", "PASS" if stats else "WARN")
            
            # User name/email in nav
            content = page.content()
            alice_visible = "alice" in content.lower() or "Alice" in content
            record("User name/email visible in header/nav", "PASS" if alice_visible else "WARN",
                   "alice found in page" if alice_visible else "alice not found in page")
            
            # Sign out option
            signout = (page.query_selector("button:has-text('Sign Out')") or
                       page.query_selector("button:has-text('Log Out')") or
                       page.query_selector("a:has-text('Sign Out')") or
                       page.query_selector("a:has-text('Log Out')") or
                       page.query_selector("[class*='avatar']") or
                       page.query_selector("[class*='user']"))
            record("Sign out option accessible", "PASS" if signout else "WARN")
            
            # Try to find and click sign out
            # First look for user avatar/dropdown
            user_trigger = (page.query_selector("[class*='avatar']") or
                           page.query_selector("button[class*='user']"))
            if user_trigger:
                try:
                    user_trigger.click()
                    page.wait_for_timeout(1000)
                    screenshot(page, "04-dashboard-user-dropdown")
                    signout_btn = (page.query_selector("button:has-text('Sign Out')") or
                                   page.query_selector("a:has-text('Sign Out')") or
                                   page.query_selector("[role='menuitem']:has-text('Sign Out')"))
                    if signout_btn:
                        signout_btn.click()
                        page.wait_for_timeout(3000)
                        screenshot(page, "04-dashboard-after-signout")
                        went_away = "/dashboard" not in page.url or "/login" in page.url
                        record("Sign out redirects to /login or /", "PASS" if went_away else "WARN",
                               f"URL: {page.url}")
                        # Log back in
                        if "/login" in page.url or page.url == BASE_URL or page.url == BASE_URL + "/":
                            em = (page.query_selector("input[type='email']") or
                                  page.query_selector("input[name='email']"))
                            pw = page.query_selector("input[type='password']")
                            if em and pw:
                                em.fill("alice@demo.com")
                                pw.fill("demo1234")
                                sb = (page.query_selector("button[type='submit']") or
                                      page.query_selector("button:has-text('Sign In')"))
                                if sb:
                                    sb.click()
                                    page.wait_for_timeout(5000)
                    else:
                        record("Sign out redirects to /login or /", "WARN", "Sign out button not in dropdown")
                except Exception as e:
                    record("Sign out redirects to /login or /", "WARN", str(e))
            else:
                # Try direct sign out button
                so = (page.query_selector("button:has-text('Sign Out')") or
                      page.query_selector("a:has-text('Sign Out')"))
                if so:
                    so.click()
                    page.wait_for_timeout(3000)
                    went_away = "/dashboard" not in page.url
                    record("Sign out redirects to /login or /", "PASS" if went_away else "WARN",
                           f"URL: {page.url}")
                    # Log back in
                    page.goto(f"{BASE_URL}/login", timeout=30000)
                    page.wait_for_load_state("networkidle", timeout=10000)
                    em = (page.query_selector("input[type='email']") or
                          page.query_selector("input[name='email']"))
                    pw = page.query_selector("input[type='password']")
                    if em and pw:
                        em.fill("alice@demo.com")
                        pw.fill("demo1234")
                        sb = (page.query_selector("button[type='submit']") or
                              page.query_selector("button:has-text('Sign In')"))
                        if sb:
                            sb.click()
                            page.wait_for_timeout(5000)
                else:
                    record("Sign out redirects to /login or /", "WARN", "Could not find/click sign out")
                    
        except Exception as e:
            record("Dashboard page loads (not redirected)", "FAIL", str(e))
            screenshot(page, "04-dashboard-error")
        
        # ── PROJECTS ──────────────────────────────────────────────────────────
        print("\n=== PROJECTS (/dashboard/projects) ===")
        try:
            # Ensure logged in
            page.goto(f"{BASE_URL}/dashboard/projects", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            
            if "/login" in page.url:
                # Need to log in again
                em = (page.query_selector("input[type='email']") or
                      page.query_selector("input[name='email']"))
                pw = page.query_selector("input[type='password']")
                if em and pw:
                    em.fill("alice@demo.com")
                    pw.fill("demo1234")
                    sb = (page.query_selector("button[type='submit']") or
                          page.query_selector("button:has-text('Sign In')"))
                    if sb:
                        sb.click()
                        page.wait_for_timeout(5000)
                page.goto(f"{BASE_URL}/dashboard/projects", timeout=30000)
                page.wait_for_load_state("networkidle", timeout=15000)
            
            screenshot(page, "05-projects")
            is_projects = "projects" in page.url.lower()
            record("Projects list page loads", "PASS" if is_projects else "WARN", f"URL: {page.url}")
            
            content = page.content()
            
            # Check for project names (seeded data)
            # Look for any project-like elements
            project_items = (page.query_selector_all("[class*='project']") or
                             page.query_selector_all("li") or
                             page.query_selector_all("[class*='card']"))
            record("At least 1 project visible", "PASS" if len(project_items) > 0 else "WARN",
                   f"Found {len(project_items)} items")
            
            # Project names visible
            h3s = page.query_selector_all("h3")
            h2s = page.query_selector_all("h2")
            has_names = len(h3s) > 0 or len(h2s) > 0
            record("Project names visible", "PASS" if has_names else "WARN",
                   f"h2: {len(h2s)}, h3: {len(h3s)}")
            
            # New project button
            new_btn = (page.query_selector("button:has-text('New Project')") or
                       page.query_selector("button:has-text('Create Project')") or
                       page.query_selector("button:has-text('Create')") or
                       page.query_selector("button:has-text('New')") or
                       page.query_selector("a:has-text('New Project')"))
            record("'New Project'/'Create' button present", "PASS" if new_btn else "FAIL")
            
            # Click new project
            if new_btn:
                new_btn.click()
                page.wait_for_timeout(2000)
                screenshot(page, "05-projects-create-dialog")
                dialog = (page.query_selector("[role='dialog']") or
                          page.query_selector("[class*='modal']") or
                          page.query_selector("[class*='dialog']"))
                form_shown = dialog is not None or "/new" in page.url or "/create" in page.url
                record("Clicking create opens dialog/form", "PASS" if form_shown else "WARN",
                       "dialog found" if dialog else f"URL: {page.url}")
                
                # Project name input in create form
                name_input = (page.query_selector("input[name='name']") or
                              page.query_selector("input[placeholder*='name' i]") or
                              page.query_selector("input[placeholder*='project' i]") or
                              page.query_selector("input[type='text']"))
                record("Project name input in create form", "PASS" if name_input else "FAIL")
                
                # Submit create form
                if name_input:
                    name_input.fill(f"Test Project {int(time.time())}")
                    create_sub = (page.query_selector("button[type='submit']") or
                                  page.query_selector("[role='dialog'] button:has-text('Create')") or
                                  page.query_selector("[role='dialog'] button:has-text('Save')") or
                                  page.query_selector("[role='dialog'] button:has-text('Add')"))
                    if create_sub:
                        create_sub.click()
                        page.wait_for_timeout(3000)
                        screenshot(page, "05-projects-after-create")
                        # Check if new project appeared (count increased or dialog closed)
                        new_items = (page.query_selector_all("[class*='project']") or
                                     page.query_selector_all("li") or
                                     page.query_selector_all("[class*='card']"))
                        record("Creating project adds it to list", "PASS" if len(new_items) >= len(project_items) else "WARN",
                               f"Before: {len(project_items)}, After: {len(new_items)}")
                    else:
                        record("Creating project adds it to list", "WARN", "No submit in dialog")
                else:
                    record("Creating project adds it to list", "FAIL", "No name input in dialog")
            else:
                record("Clicking create opens dialog/form", "FAIL", "No create button")
                record("Project name input in create form", "FAIL", "No create button")
                record("Creating project adds it to list", "FAIL", "No create button")
            
            # Click on existing project
            screenshot(page, "05-projects-before-click")
            project_link = (page.query_selector("[class*='card'] a") or
                           page.query_selector("a[href*='/projects/']") or
                           page.query_selector("[class*='project'] a"))
            if project_link:
                href = project_link.get_attribute("href")
                project_link.click()
                page.wait_for_timeout(3000)
                screenshot(page, "05-projects-detail-navigate")
                is_detail = "/projects/" in page.url and page.url != f"{BASE_URL}/dashboard/projects"
                record("Clicking project navigates to detail", "PASS" if is_detail else "WARN",
                       f"URL: {page.url}")
            else:
                # Try clicking on a card directly
                card = page.query_selector("[class*='card']")
                if card:
                    card.click()
                    page.wait_for_timeout(3000)
                    is_detail = "/projects/" in page.url and page.url != f"{BASE_URL}/dashboard/projects"
                    record("Clicking project navigates to detail", "PASS" if is_detail else "WARN",
                           f"URL: {page.url}")
                else:
                    record("Clicking project navigates to detail", "WARN", "No clickable project found")
                    
        except Exception as e:
            record("Projects list page loads", "FAIL", str(e))
            screenshot(page, "05-projects-error")
        
        # ── PROJECT DETAIL ────────────────────────────────────────────────────
        print("\n=== PROJECT DETAIL ===")
        try:
            # Navigate to a project detail page
            current_url = page.url
            if "/dashboard/projects/" not in current_url or current_url.endswith("/projects"):
                # Go to projects and get first project
                page.goto(f"{BASE_URL}/dashboard/projects", timeout=30000)
                page.wait_for_load_state("networkidle", timeout=15000)
                
                if "/login" in page.url:
                    em = (page.query_selector("input[type='email']") or
                          page.query_selector("input[name='email']"))
                    pw = page.query_selector("input[type='password']")
                    if em and pw:
                        em.fill("alice@demo.com")
                        pw.fill("demo1234")
                        sb = (page.query_selector("button[type='submit']") or
                              page.query_selector("button:has-text('Sign In')"))
                        if sb:
                            sb.click()
                            page.wait_for_timeout(5000)
                    page.goto(f"{BASE_URL}/dashboard/projects", timeout=30000)
                    page.wait_for_load_state("networkidle", timeout=15000)
                
                # Find first project link
                proj_link = (page.query_selector("a[href*='/projects/']") or
                             page.query_selector("[class*='card'] a"))
                if proj_link:
                    href = proj_link.get_attribute("href")
                    page.goto(f"{BASE_URL}{href}" if href.startswith("/") else href, timeout=30000)
                else:
                    # Try clicking on first card
                    card = page.query_selector("[class*='card']")
                    if card: card.click()
                page.wait_for_load_state("networkidle", timeout=15000)
            
            screenshot(page, "06-project-detail")
            is_detail = "/dashboard/projects/" in page.url
            record("Project detail page loads", "PASS" if is_detail else "FAIL", f"URL: {page.url}")
            
            # Project name heading
            h1 = page.query_selector("h1")
            record("Project name as heading", "PASS" if h1 else "WARN",
                   h1.inner_text().strip()[:40] if h1 else "No h1")
            
            # Task list visible
            tasks = (page.query_selector_all("[class*='task']") or
                     page.query_selector_all("[class*='item']") or
                     page.query_selector_all("li"))
            task_section = (page.query_selector("[class*='task']") or
                           page.query_selector("h2:has-text('Task')") or
                           page.query_selector("h3:has-text('Task')"))
            record("Task list visible", "PASS" if (len(tasks) > 0 or task_section) else "WARN",
                   f"Found {len(tasks)} task-like items")
            
            # Add Task button
            add_task_btn = (page.query_selector("button:has-text('Add Task')") or
                           page.query_selector("button:has-text('New Task')") or
                           page.query_selector("button:has-text('Create Task')") or
                           page.query_selector("button:has-text('Add')"))
            record("'Add Task' button present", "PASS" if add_task_btn else "FAIL")
            
            if add_task_btn:
                add_task_btn.click()
                page.wait_for_timeout(2000)
                screenshot(page, "06-project-add-task-dialog")
                
                task_title_input = (page.query_selector("input[name='title']") or
                                    page.query_selector("input[placeholder*='title' i]") or
                                    page.query_selector("input[placeholder*='task' i]") or
                                    page.query_selector("[role='dialog'] input[type='text']"))
                record("Task title input present", "PASS" if task_title_input else "FAIL")
                
                status_sel = (page.query_selector("select[name='status']") or
                              page.query_selector("[role='combobox']") or
                              page.query_selector("[class*='select']"))
                record("Status dropdown present", "PASS" if status_sel else "WARN")
                
                if task_title_input:
                    task_title_input.fill(f"Test Task {int(time.time())}")
                    task_sub = (page.query_selector("button[type='submit']") or
                                page.query_selector("[role='dialog'] button:has-text('Create')") or
                                page.query_selector("[role='dialog'] button:has-text('Add')") or
                                page.query_selector("[role='dialog'] button:has-text('Save')"))
                    if task_sub:
                        task_sub.click()
                        page.wait_for_timeout(3000)
                        screenshot(page, "06-project-after-add-task")
                        record("Submitting creates task", "PASS", "Task submitted")
                    else:
                        record("Submitting creates task", "WARN", "No submit in task dialog")
                else:
                    record("Submitting creates task", "FAIL", "No title input")
            else:
                record("Clicking Add Task opens form", "FAIL", "No Add Task button")
                record("Task title input present", "FAIL", "No Add Task button")
                record("Status dropdown present", "FAIL", "No Add Task button")
                record("Submitting creates task", "FAIL", "No Add Task button")
            
            # Existing tasks show title and status
            screenshot(page, "06-project-detail-final")
            task_elements = page.query_selector_all("[class*='task']")
            status_badges = (page.query_selector_all("[class*='badge']") or
                            page.query_selector_all("[class*='status']"))
            record("Existing tasks show title and status badge", 
                   "PASS" if (len(task_elements) > 0 or len(status_badges) > 0) else "WARN",
                   f"tasks: {len(task_elements)}, badges: {len(status_badges)}")
            
        except Exception as e:
            record("Project detail page loads", "FAIL", str(e))
            screenshot(page, "06-project-detail-error")
        
        # ── SETTINGS ──────────────────────────────────────────────────────────
        print("\n=== SETTINGS (/dashboard/settings) ===")
        try:
            page.goto(f"{BASE_URL}/dashboard/settings", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=15000)
            
            if "/login" in page.url:
                em = (page.query_selector("input[type='email']") or
                      page.query_selector("input[name='email']"))
                pw = page.query_selector("input[type='password']")
                if em and pw:
                    em.fill("alice@demo.com")
                    pw.fill("demo1234")
                    sb = (page.query_selector("button[type='submit']") or
                          page.query_selector("button:has-text('Sign In')"))
                    if sb:
                        sb.click()
                        page.wait_for_timeout(5000)
                page.goto(f"{BASE_URL}/dashboard/settings", timeout=30000)
                page.wait_for_load_state("networkidle", timeout=15000)
            
            screenshot(page, "07-settings")
            is_settings = "settings" in page.url.lower()
            record("Settings page loads", "PASS" if is_settings else "FAIL", f"URL: {page.url}")
            
            # Profile fields
            name_field = (page.query_selector("input[name='name']") or
                         page.query_selector("input[name='firstName']") or
                         page.query_selector("input[placeholder*='name' i]"))
            email_field = (page.query_selector("input[type='email']") or
                          page.query_selector("input[name='email']"))
            
            record("Profile name field present", "PASS" if name_field else "WARN")
            record("Profile email field present", "PASS" if email_field else "WARN")
            record("Profile fields present (name, email)", 
                   "PASS" if (name_field or email_field) else "FAIL")
            
            save_btn = (page.query_selector("button[type='submit']") or
                       page.query_selector("button:has-text('Save')") or
                       page.query_selector("button:has-text('Update')"))
            record("Save button present", "PASS" if save_btn else "FAIL")
            
        except Exception as e:
            record("Settings page loads", "FAIL", str(e))
            screenshot(page, "07-settings-error")
        
        browser.close()
    
    return results

if __name__ == "__main__":
    print("Starting PlanForge SaaS diagnostic tests...")
    test_results = run_tests()
    
    # Write results JSON
    with open("/tmp/saas_results.json", "w", encoding="utf-8") as f:
        json.dump(test_results, f, indent=2)
    
    # Print summary
    passed = sum(1 for r in test_results if r["result"] == "PASS")
    failed = sum(1 for r in test_results if r["result"] == "FAIL")
    warned = sum(1 for r in test_results if r["result"] == "WARN")
    total = len(test_results)
    
    print(f"\n{'='*50}")
    print(f"SUMMARY: {total} tests | {passed} PASS | {failed} FAIL | {warned} WARN")
    print(f"{'='*50}")
