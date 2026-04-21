# Demo Recording Guide

## Video Requirements
- Duration: Max 5 minutes
- Quality: 1080p (recommended)
- Format: MP4, WebM, or MOV
- Tools: OBS Studio (free), Loom, ScreenFlow, etc.

## What to Showcase

### 1. Introduction (0:00 - 0:30)
- App name and purpose
- Quick overview of features
- Demo group setup

### 2. Create Group (0:30 - 1:00)
- Click "New Group"
- Create group "Weekend Trip"
- Show clean, intuitive interface

### 3. Add Members (1:00 - 1:30)
- Add 3-4 members (Alice, Bob, Carol, Diana)
- Show member list
- Mention email-based invitations

### 4. Add Expenses (1:30 - 3:00)
- **Expense 1**: Bob pays ₹3000 for hotel
  - Select participants (Alice, Bob, Carol)
  - Split equally
  - Show automatic categorization "Accommodation"

- **Expense 2**: Alice pays ₹1500 for food
  - Select participants (Alice, Bob, Carol, Diana)
  - Split equally
  - Show category "Food"

- **Expense 3**: Carol pays ₹600 for petrol
  - Select participants (all)
  - Show category "Travel"

- **Expense 4**: Diana pays ₹200 for tips
  - All participants
  - Category "Other"

### 5. View Balances (3:00 - 3:45)
- Switch to "Balances" tab
- Show real-time calculations
- Highlight: "Alice owes Bob ₹500"
- Demonstrate who owes whom clearly

### 6. Analytics & Insights (3:45 - 4:30)
- Switch to "Insights" tab
- Show spending by category
- Show spending by member
- Show key metrics (Total, Count, Average)
- Highlight AI insights

### 7. Edit/Delete Demo (4:30 - 4:45)
- Delete an expense to show real-time updates
- Balances recalculate instantly

### 8. Call to Action (4:45 - 5:00)
- Summary of key features
- Link to GitHub (if applicable)
- Call to action

## Recording Script

```
"Welcome to Smart Expense Splitter - Your solution for tracking
and settling shared expenses with ease!

[CREATE GROUP]
Whether planning a trip with friends or managing shared apartment
bills, this app automatically handles the complex math.

[ADD MEMBERS]
Start by creating a group and inviting members via email.

[ADD EXPENSES]
Add expenses as they happen. The AI automatically categorizes them,
and the app intelligently splits costs among participants.

[SHOW BALANCES]
View real-time balances showing exactly who owes whom.

[SHOW INSIGHTS]
Get spending insights with category breakdowns and member analytics.

Smart Expense Splitter makes splitting expenses smart and effortless!
Check it out at [GitHub Link]"
```

## Recording Setup

### OBS Studio Setup (Free)
1. Download OBS Studio
2. Create new scene
3. Add display capture source
4. Set output:
   - Bitrate: 6000 kbps
   - Resolution: 1920x1080
   - FPS: 60

### Loom Setup (Easier)
1. Go to loom.com
2. Click "Start recording"
3. Select screen + webcam
4. Record and auto-generate link

## Recording Checklist
- [ ] Clear desktop (close unnecessary apps)
- [ ] Zoom browser to 125% for readability
- [ ] Use dark mode or light mode consistently
- [ ] Test audio quality
- [ ] Record in quiet environment
- [ ] Practice before recording
- [ ] Test demo functionality before recording
- [ ] Close notifications
- [ ] Have sample data ready
- [ ] Have script/talking points ready

## Post-Recording

### Editing (Optional)
- Add intro title slide
- Highlight key features with arrows
- Adjust pacing with cuts
- Add background music (royalty-free)
- Add subtitles/captions

### Uploading
1. **YouTube**
   - Title: "Smart Expense Splitter - Demo"
   - Description: Include GitHub link, features, tech stack
   - Tags: expense, splitter, app, demo
   - Thumbnail: Screenshot of app

2. **GitHub**
   - Upload to assets folder
   - Link in README as "/assets/demo.mp4"
   - Or embed YouTube link

3. **LinkedIn** (Optional)
   - Post with technical write-up
   - Tag relevant technologies
   - Highlight AI features

## Tips for Better Demo
- Move mouse slower for clarity
- Pause between actions (1-2 seconds)
- Highlight important areas with cursor
- Use full app width (don't minimize)
- Show error handling if relevant
- Don't rush - 5 minutes is enough
- Speak clearly and confidently
- Show loading states
- Test on different devices/browsers

## Sample Data for Demo

Run this to populate sample data:
```bash
npx ts-node scripts/seed-demo-data.ts
```

Creates:
- Group: "Weekend Trip to Goa"
- Members: Alice, Bob, Carol, Diana
- Expenses: Hotel, Food, Petrol, Tips
- Balances: Automatically calculated

## Troubleshooting Records

| Issue | Solution |
|-------|----------|
| Audio not clear | Use external mic, test in quiet room |
| Video lag | Close background apps, reduce bitrate |
| Lost recording | Enable auto-save in OBS, use cloud service |
| Too long | Edit or use multiple cuts |
| Boring | Add music, vary pacing, use transitions |

## Final Checklist Before Submission
- [ ] Video is under 5 minutes
- [ ] All features demonstrated
- [ ] Audio is clear
- [ ] Video quality is good
- [ ] Links are working
- [ ] No sensitive data shown
- [ ] Professional presentation
- [ ] Uploaded to accessible location

---

Good luck with your demo! 🎬
