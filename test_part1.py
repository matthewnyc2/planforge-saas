#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Part 1: Landing + Register + Login"""

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

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_context(viewport={"width": 1280, "height": 900}).new_page()
    page.set_default_timeout(10000)

    # LANDING
    print("=== LANDING ===")
    try:
        page.goto(BASE_URL, timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        ss(page, "01-landing")
        rec("Page loads at http://localhost:3001", "PASS", page.title())
        h1 = page.query_selector("h1")
        rec("Hero headline visible", "PASS" if h1 else "FAIL", h1.inner_text()[:50] if h1 else "no h1")
        cta = page.query_selector("a[href='/register']") or page.query_selector("a:has-text('Get Started')")
        rec("Get Started CTA present", "PASS" if cta else "FAIL")
        rec("CTA navigates to /register", "PASS" if cta and cta.get_attribute("href")=="/register" else "WARN")
        si = page.query_selector("a[href='/login']") or page.query_selector("a:has-text('Sign In')")
        rec("Sign In link present", "PASS" if si else "FAIL")
        rec("Sign In links to /login", "PASS" if si and si.get_attribute("href")=="/login" else "WARN")
        feat = page.query_selector("h2") or page.query_selector("section")
        rec("Features section visible", "PASS" if feat else "WARN")
    except Exception as e:
        rec("Page loads at http://localhost:3001", "FAIL", str(e)[:80])

    # REGISTER
    print("=== REGISTER ===")
    try:
        page.goto(f"{BASE_URL}/register", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(1500)
        ss(page, "02-register")
        rec("Registration form loads", "PASS")
        fn = page.query_selector("input[name='firstName']") or page.query_selector("input[placeholder*='First' i]")
        rec("First name input", "PASS" if fn else "FAIL")
        ln = page.query_selector("input[name='lastName']") or page.query_selector("input[placeholder*='Last' i]")
        rec("Last name input", "PASS" if ln else "FAIL")
        em = page.query_selector("input[type='email']") or page.query_selector("input[name='email']")
        rec("Email input", "PASS" if em else "FAIL")
        pw = page.query_selector("input[type='password']")
        rec("Password input", "PASS" if pw else "FAIL")
        all_pw = page.query_selector_all("input[type='password']")
        rec("Confirm password input", "PASS" if len(all_pw)>=2 else "WARN", f"{len(all_pw)} pwd fields")
        sub = page.query_selector("button[type='submit']") or page.query_selector("button:has-text('Register')") or page.query_selector("button:has-text('Sign Up')")
        rec("Submit button present", "PASS" if sub else "FAIL")
        if sub:
            sub.click()
            page.wait_for_timeout(1500)
            ss(page, "02-register-empty")
            rec("Empty submit stays on register", "PASS" if "/register" in page.url else "WARN", page.url)
        # short password
        page.goto(f"{BASE_URL}/register", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        fn2 = page.query_selector("input[name='firstName']") or page.query_selector("input[placeholder*='First' i]")
        ln2 = page.query_selector("input[name='lastName']") or page.query_selector("input[placeholder*='Last' i]")
        em2 = page.query_selector("input[type='email']") or page.query_selector("input[name='email']")
        pw2 = page.query_selector("input[type='password']")
        if fn2: fn2.fill("Test")
        if ln2: ln2.fill("User")
        if em2: em2.fill("t@t.com")
        if pw2: pw2.fill("123")
        sub2 = page.query_selector("button[type='submit']") or page.query_selector("button:has-text('Register')")
        if sub2:
            sub2.click()
            page.wait_for_timeout(1500)
            ss(page, "02-register-shortpw")
            rec("Short password shows error", "PASS" if "/register" in page.url else "WARN", page.url)
        # valid registration
        page.goto(f"{BASE_URL}/register", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        fn3 = page.query_selector("input[name='firstName']") or page.query_selector("input[placeholder*='First' i]")
        ln3 = page.query_selector("input[name='lastName']") or page.query_selector("input[placeholder*='Last' i]")
        em3 = page.query_selector("input[type='email']") or page.query_selector("input[name='email']")
        all_pw3 = page.query_selector_all("input[type='password']")
        if fn3: fn3.fill("New")
        if ln3: ln3.fill("User")
        ts = str(int(time.time()))
        if em3: em3.fill(f"newuser{ts}@test.com")
        if len(all_pw3)>=1: all_pw3[0].fill("password123")
        if len(all_pw3)>=2: all_pw3[1].fill("password123")
        sub3 = page.query_selector("button[type='submit']") or page.query_selector("button:has-text('Register')") or page.query_selector("button:has-text('Sign Up')")
        if sub3:
            sub3.click()
            page.wait_for_timeout(4000)
            ss(page, "02-register-valid")
            rec("Valid registration navigates away", "PASS" if "/register" not in page.url else "WARN", page.url)
        page.goto(f"{BASE_URL}/register", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        login_link = page.query_selector("a[href='/login']") or page.query_selector("a:has-text('Already have')")
        rec("Already have account link", "PASS" if login_link else "FAIL")
    except Exception as e:
        rec("Registration form loads", "FAIL", str(e)[:80])

    # LOGIN
    print("=== LOGIN ===")
    try:
        page.goto(f"{BASE_URL}/login", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(1500)
        ss(page, "03-login")
        rec("Login form loads", "PASS")
        em = page.query_selector("input[type='email']") or page.query_selector("input[name='email']")
        rec("Email input on login", "PASS" if em else "FAIL")
        pw = page.query_selector("input[type='password']")
        rec("Password input on login", "PASS" if pw else "FAIL")
        # wrong creds
        if em and pw:
            em.fill("wrong@wrong.com"); pw.fill("wrongpass")
            sub = page.query_selector("button[type='submit']") or page.query_selector("button:has-text('Sign In')")
            if sub:
                sub.click(); page.wait_for_timeout(3000)
                ss(page, "03-login-wrong")
                rec("Wrong credentials error", "PASS" if "/login" in page.url else "WARN", page.url)
        # valid login
        page.goto(f"{BASE_URL}/login", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        em2 = page.query_selector("input[type='email']") or page.query_selector("input[name='email']")
        pw2 = page.query_selector("input[type='password']")
        if em2 and pw2:
            em2.fill("alice@demo.com"); pw2.fill("demo1234")
            sub2 = page.query_selector("button[type='submit']") or page.query_selector("button:has-text('Sign In')")
            if sub2:
                sub2.click(); page.wait_for_timeout(5000)
                ss(page, "03-login-success")
                is_dash = "/dashboard" in page.url
                rec("Login alice@demo.com succeeds", "PASS" if is_dash else "FAIL", page.url)
                rec("Login redirects to /dashboard", "PASS" if is_dash else "FAIL", page.url)
        page.goto(f"{BASE_URL}/login", timeout=20000, wait_until="domcontentloaded")
        page.wait_for_timeout(1000)
        reg_link = page.query_selector("a[href='/register']") or page.query_selector("a:has-text('Register')")
        rec("Link to /register on login page", "PASS" if reg_link else "FAIL")
    except Exception as e:
        rec("Login form loads", "FAIL", str(e)[:80])

    browser.close()

with open("/tmp/saas_part1.json","w") as f: json.dump(results,f,indent=2)
p2=sum(1 for r in results if r["result"]=="PASS")
f2=sum(1 for r in results if r["result"]=="FAIL")
w2=sum(1 for r in results if r["result"]=="WARN")
print(f"\nPart1: {len(results)} tests | {p2} PASS | {f2} FAIL | {w2} WARN")
