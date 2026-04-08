# GHL Automation Setup for ZippyScale Quiz Funnel

## Overview

When a lead submits the quiz form, Apps Script pushes their data to GHL as a contact with tags. GHL workflows trigger on these tags and handle all downstream automation: notifications, opportunity creation, task assignment, and nurture sequences.

## What Apps Script Does (already working)

On every form submit, the Apps Script:
1. Scores the lead (0-100)
2. Creates/updates GHL contact with:
   - Name, phone, email, company name
   - Tags: `audit-waitlist`, `hot-lead` / `warm-lead` / `cool-lead`, source tag, industry tag, UTM tags
   - Custom fields: lead score, lead source, industry, awareness level, engagement status, automate areas
   - Assigned to: Bhargav
3. Fires Meta CAPI
4. Appends Google Sheets backup row

## GHL Workflows to Build

### Workflow 1: "ZS Quiz Lead Automation" (MAIN)

**Trigger:** Contact tag added = `audit-waitlist`

This is the master workflow. Every quiz lead gets this.

#### Step 1: Create Opportunity
- Pipeline: Sales Pipeline (`aTzYNdImLeTlbuaGyUEw`)
- Stage: New Lead (`b06d3ff1-f951-4cfb-9f9b-7606b3a18ee0`)
- Name: `{{contact.first_name}} {{contact.last_name}} — AI Automation Audit`
- Assigned to: Bhargav (`DWsVEAIiC5tYCO6Judqn`)
- Custom fields to map:
  - BANT Score (`CI9iTKRhBX167DVxgNXe`): `{{contact.lead_score}}`
  - Lead Source (`xjOljUoJre9yi73cCQGS`): Website
  - Industry (`1L8bItfwGnCKr2OiNs3p`): `{{contact.contact_industry}}`
  - Pain Points (`mKlkcodE3FljFOihSiAf`): `{{contact.automate_areas}}`

#### Step 2: Add Contact Note
- Body:
```
Lead Score: {{contact.lead_score}}/100
Industry: {{contact.contact_industry}}
Company: {{contact.company_name}}
Phone: {{contact.phone}}
Email: {{contact.email}}
Source: {{contact.source}}
Automate Areas: {{contact.automate_areas}}
```

#### Step 3: Create Task for Bhargav
- Title: `NEW LEAD — {{contact.first_name}} {{contact.last_name}} (Score: {{contact.lead_score}})`
- Assigned to: Bhargav
- Due date logic:
  - If contact has tag `hot-lead`: due in 2 hours
  - If contact has tag `warm-lead`: due in 24 hours
  - If contact has tag `cool-lead`: due in 72 hours
- Note: Use an If/Else branch before this step to set due date based on tag

#### Step 4: Send Internal Notification
- **Email to Sandy** (sandy@zippyscale.com):
  - Subject: `New Lead: {{contact.first_name}} (Score: {{contact.lead_score}})`
  - Body: Lead details (name, phone, email, company, industry, score, areas)
- **WhatsApp to Bhargav** (once WhatsApp is connected in GHL):
  - Template with lead name, score, industry, phone

#### Step 5: Send Lead Confirmation
- **Condition:** Contact field `whatsapp_consent` = true (or always, since they filled a form)
- **WhatsApp to Lead** (once WhatsApp is connected):
  - Template: Confirmation that audit request is received
  - Include: "Our team will review your business and send a custom roadmap within 48 hours"
- **Email to Lead:**
  - Subject: `Your AI Automation Audit is Being Prepared`
  - Body: Thank you, what to expect, timeline (48 hours)

#### Step 6: Wait 3 Days

#### Step 7: Day 3 Follow-up
- **Condition:** Opportunity status = open AND stage still = New Lead
  - (Skip if Bhargav already moved them forward)
- **WhatsApp to Lead:**
  - "Hi {{contact.first_name}}, quick follow-up from ZippyScale. We reviewed your {{contact.contact_industry}} business and have some specific automation ideas. Would you like to book a 15-min call? Reply YES."
- **Email to Lead:**
  - Similar content, include calendar link if available

#### Step 8: Wait 4 More Days (7 total)

#### Step 9: Day 7 Final Nudge
- **Condition:** Opportunity status = open AND stage still = New Lead
- **WhatsApp to Lead:**
  - "Hi {{contact.first_name}}, last check-in. Your free audit offer is still open. Reply AUDIT to claim it."
- **Email to Lead:**
  - Final nudge with same offer

---

### Workflow 2: "ZS Hot Lead Alert" (PRIORITY)

**Trigger:** Contact tag added = `hot-lead`

#### Step 1: Send URGENT Notification
- **Email to Sandy + Bhargav:**
  - Subject: `🔥 HOT LEAD: {{contact.first_name}} (Score: {{contact.lead_score}})`
  - Body: Full lead details + "Contact within 2 hours"
- **WhatsApp to Bhargav** (when connected):
  - Urgent template with lead details

#### Step 2: Create URGENT Task
- Title: `🔥 HOT — Call {{contact.first_name}} NOW`
- Due: 2 hours
- Assigned to: Bhargav
- Priority: High

---

## WhatsApp Setup (Before Workflows)

1. Go to GHL → Settings → Phone Numbers → WhatsApp
2. Connect your WhatsApp Business number
3. Verify the number via the verification process
4. Create WhatsApp templates:
   - `zs_lead_confirmation`: "Hi {{1}}, thanks for requesting your AI automation audit! Our team is reviewing your {{2}} business now. Expect your custom roadmap on WhatsApp within 48 hours."
   - `zs_lead_followup_d3`: "Hi {{1}}, quick follow-up from ZippyScale. We have automation ideas for your {{2}} business. Reply YES for a 15-min call to walk through them."
   - `zs_lead_followup_d7`: "Hi {{1}}, last check-in from ZippyScale. Your free audit offer is still open. Reply AUDIT to claim it."
   - `zs_team_alert`: "New lead: {{1}}, Score: {{2}}, Industry: {{3}}, Phone: {{4}}"
5. Submit templates for Meta approval (takes 1-24 hours)

## Email Templates to Create in GHL

### Lead Confirmation Email
- Name: `ZS Audit Confirmation`
- Subject: `Your AI Automation Audit is Being Prepared`
- Body:
```
Hi {{contact.first_name}},

Thanks for requesting your free AI automation audit.

Here's what happens next:

1. Our team reviews your business operations (within 48 hours)
2. We identify every process that can be automated
3. You get a custom roadmap with exact savings and timeline

No payment needed. No strings attached.

Questions? Reply to this email.

The ZippyScale Team
```

### Day 3 Follow-up Email
- Name: `ZS Day 3 Follow-up`
- Subject: `{{contact.first_name}}, we have automation ideas for {{contact.company_name}}`
- Body: Follow-up offering a 15-min call to discuss findings

### Day 7 Final Nudge Email
- Name: `ZS Day 7 Nudge`
- Subject: `Last chance: Free automation audit for {{contact.company_name}}`
- Body: Final offer, direct reply to claim

### Internal Alert Email
- Name: `ZS Internal Lead Alert`
- Subject: `New Lead: {{contact.first_name}} (Score: {{contact.lead_score}})`
- Body: Full lead details table

## Custom Fields Already in GHL

These are set by Apps Script. Use them in workflow conditions and email templates:

| Field | Key | Use |
|---|---|---|
| Lead Score | `contact.lead_score` | Scoring, task priority |
| Lead Source | `contact.lead_source` | Attribution |
| Industry | `contact.contact_industry` | Personalization |
| Automate Areas | custom field ID `3kFfjrcLQjoHsiXhRhOA` | Audit context |
| Awareness Level | custom field ID `IcU2GqKV41bDHXcUcfEU` | Segmentation |
| Customer Status | `contact.customer_status` | Lifecycle tracking |

## Tags Set by Apps Script

| Tag | Meaning |
|---|---|
| `audit-waitlist` | Triggers main workflow |
| `hot-lead` | Score 70+, triggers hot lead alert |
| `warm-lead` | Score 40-69 |
| `cool-lead` | Score 0-39 |
| `utm-{source}` | Ad source tracking |
| `medium-{medium}` | Ad medium tracking |
| Industry tag (lowercase) | e.g., `it/software`, `healthcare` |

## Setup Checklist

- [ ] Connect WhatsApp Business number in GHL
- [ ] Create 4 WhatsApp templates, submit for approval
- [ ] Create 4 email templates in GHL
- [ ] Build Workflow 1: ZS Quiz Lead Automation (trigger + 9 steps)
- [ ] Build Workflow 2: ZS Hot Lead Alert (trigger + 2 steps)
- [ ] Test: submit a test lead from the test site
- [ ] Verify: contact created, opportunity created, task created, email sent
- [ ] Verify: WhatsApp sent (after templates approved)
- [ ] Publish both workflows
