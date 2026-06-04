# AIM — Automated Impact Marketing Platform

> **Project path:** `e:\Projects\websites\aim---automated-impact-marketing`
> **Stack:** Vite · TypeScript · React · Firebase (Hosting + Auth + Firestore) · Tailwind CSS
> **Type:** Firebase-hosted SPA, marketing automation frontend
> **Production URL:** `https://aimarketing.web.app` / `https://aimmarketing.in`
> **Last major activity:** April 2026

---

## 1. Executive Technical Summary

AIM (Automated Impact Marketing) is the frontend marketing dashboard for the APEX Voice AI platform's marketing campaign features. It provides a UI for managing outbound voice campaigns, viewing analytics, and configuring tenant-level settings for the aivoice backend.

**Core purpose:** Allow non-technical business users to launch, monitor, and analyze AI voice marketing campaigns without touching the API directly. The APEX Voice AI platform handles call execution; AIM provides the campaign management interface.

**Relationship to APEX Voice AI:** AIM is the production URL referenced in `main.py`'s CORS origins:
```python
"https://aimarketing.web.app",
"https://aimarketing.firebaseapp.com",
"https://aimmarketing.in",
"https://www.aimmarketing.in",
```
This confirms AIM is the production frontend for the aivoice backend.

---

## 2. System Architecture

```
AIM Frontend (Firebase Hosting)
    ↕ Firebase Auth (JWT)
    ↕ Firestore (campaign data, analytics)
    ↕ APEX Voice AI API (campaign execution, call logs)
```

### 2.1 Frontend Stack

- **Vite** build tooling
- **TypeScript** throughout
- **React** SPA
- **Firebase SDK:** Auth + Firestore
- **Tailwind CSS** styling

### 2.2 Firebase Integration

`.firebaserc` + `firebase.json` — deployed to Firebase Hosting. `firebase-deploy.ps1` script for PowerShell deployment.

Auth flow: Firebase Auth → JWT → included in requests to APEX Voice AI API (verified against `APEX_API_AUTH_KEY` on the backend).

### 2.3 Campaign Management Flow

```
User creates campaign → Firestore document created
AIM triggers APEX API: POST /api/marketing/broadcast
APEX API: enqueues jobs in Redis queue
Worker: processes outbound calls
APEX API: updates call status in Firebase/Firestore
AIM: real-time status via Firestore snapshot listener
```

---

## 3. Engineering Assessment

**Strengths:**
- Firebase Hosting + Firestore provides zero-ops deployment and real-time sync
- Production-deployed with custom domain (aimmarketing.in)
- Tight integration with aivoice backend (same auth layer)

**Weaknesses:**
- Firebase Firestore security rules not visible — risk of unauthorized data access
- SPA without SSR — acceptable for authenticated dashboard, appropriate use case
- No offline capability — dashboard unusable without internet (acceptable for marketing tools)

**Operational maturity:** Medium. Production deployed, custom domain, integrated auth. Missing: error monitoring, analytics on dashboard usage, A/B testing infrastructure.

---

## 4. Future Evolution Path

1. **Campaign analytics:** Visualize call outcomes (answered/busy/failed), conversation length, appointment booking conversion rates. Pull data from call_store via APEX API.
2. **Campaign scheduler:** Schedule outbound campaigns for specific times (morning/evening for better pickup rates). Cron-backed via APEX queue.
3. **Multi-tenant admin:** Super-admin view across all tenants. Campaign performance comparison. This is a natural SaaS expansion.
